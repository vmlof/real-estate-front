import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { backendAuth, readTokens, type TokenSet } from "./auth-backend";
import { AuthError } from "./auth-http";
import { roleHome, type Role } from "./auth";
import {
  createStoredSession,
  readStoredSession,
  removeStoredSession,
  withSessionLock,
  writeStoredSession,
} from "./session-store";

const SESSION_COOKIE = "homely_session";

export async function sessionId() {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

export async function createSession(tokens: TokenSet) {
  const { id, session } = await createStoredSession(tokens);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(session.expiresAt),
  });
  jar.delete("homely_access_token");
  jar.delete("homely_refresh_token");
}

export async function getSession(rejectedAccessToken?: string) {
  const id = await sessionId();
  if (!id || !/^[a-f0-9]{64}$/.test(id)) return null;
  return withSessionLock(id, async () => {
    const session = await readStoredSession(id);
    if (!session || session.logoutPending) return null;
    const rejected =
      rejectedAccessToken && rejectedAccessToken === session.accessToken;
    if (!rejected && session.accessExpiresAt > Date.now()) return session;
    if (session.retryAfter && session.retryAfter > Date.now()) {
      throw new AuthError(
        session.lastError?.status ?? 503,
        session.lastError?.message ?? "Tente novamente em instantes.",
      );
    }
    try {
      const tokens = await readTokens(
        await backendAuth({
          operation: "refresh-token",
          refreshToken: session.refreshToken,
        }),
      );
      if (tokens.user.id !== session.user.id)
        throw new AuthError(401, "A sessão mudou. Entre novamente.");
      const updated = { ...tokens, expiresAt: session.expiresAt };
      await writeStoredSession(id, updated);
      return updated;
    } catch (error) {
      if (error instanceof AuthError && error.status === 401) {
        await removeStoredSession(id);
        return null;
      }
      const failure =
        error instanceof AuthError
          ? error
          : new AuthError(503, "Serviço indisponível. Tente novamente.");
      await writeStoredSession(id, {
        ...session,
        retryAfter: Date.now() + (failure.status === 429 ? 60_000 : 10_000),
        lastError: { status: failure.status, message: failure.message },
      });
      throw failure;
    }
  });
}

export async function requireUser(role?: Role) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (role && session.user.role !== role) redirect(roleHome[session.user.role]);
  return session.user;
}

export async function hasPendingLogout() {
  const id = await sessionId();
  return id ? !!(await readStoredSession(id))?.logoutPending : false;
}

export async function destroySession() {
  const id = await sessionId();

  if (id && /^[a-f0-9]{64}$/.test(id)) {
    await withSessionLock(id, async () => {
      const session = await readStoredSession(id);
      if (!session) return;
      // Block local access immediately but retain the refresh token for retry.
      await writeStoredSession(id, {
        ...session,
        accessToken: "",
        accessExpiresAt: 0,
        logoutPending: true,
      });
      const response = await backendAuth({
        operation: "logout",
        refreshToken: session.refreshToken,
      });
      if (response.status !== 204)
        throw new AuthError(
          502,
          "O serviço não confirmou a saída. Tente novamente.",
        );
      await removeStoredSession(id);
    });
  }
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  jar.delete("homely_access_token");
  jar.delete("homely_refresh_token");
}
