import "server-only";
import { randomBytes, createHash } from "node:crypto";
import {
  mkdir,
  readFile,
  writeFile,
  rename,
  rm,
  readdir,
} from "node:fs/promises";
import path from "node:path";
import type { TokenSet } from "./auth-backend";
import { AuthError } from "./auth-http";

export interface StoredSession extends TokenSet {
  expiresAt: number;
  logoutPending?: boolean;
  retryAfter?: number;
  lastError?: { status: number; message: string };
}

const directory = () =>
  process.env.SESSION_STORE_DIR || path.join(process.cwd(), ".sessions");
const validId = (id: string) => /^[a-f0-9]{64}$/.test(id);
// Runtime session data must never be traced into a deployment artifact.
const filename = (id: string) =>
  path.join(
    /* turbopackIgnore: true */ directory(),
    createHash("sha256").update(id).digest("hex"),
  );

export async function readStoredSession(
  id: string,
): Promise<StoredSession | null> {
  if (!validId(id)) return null;
  try {
    const session: StoredSession = JSON.parse(
      await readFile(
        /* turbopackIgnore: true */ filename(id) + ".json",
        "utf8",
      ),
    );
    return session.expiresAt > Date.now() ? session : null;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

export async function writeStoredSession(id: string, session: StoredSession) {
  if (!validId(id)) throw new AuthError(401, "Sessão inválida.");
  const target = filename(id) + ".json";
  const temporary = target + "." + randomBytes(8).toString("hex") + ".tmp";
  try {
    await writeFile(temporary, JSON.stringify(session), {
      mode: 0o600,
      flag: "wx",
    });
    await rename(temporary, target);
  } finally {
    await rm(temporary, { force: true });
  }
}

export async function removeStoredSession(id: string) {
  if (validId(id)) await rm(filename(id) + ".json", { force: true });
}

// Shared filesystem lock coordinates tabs and Next.js processes on the same volume.
// Never steal an old lock: its owner may still be rotating a one-use refresh token.
export async function withSessionLock<T>(
  id: string,
  operation: () => Promise<T>,
): Promise<T> {
  if (!validId(id)) throw new AuthError(401, "Sessão inválida.");
  await mkdir(directory(), { recursive: true, mode: 0o700 });
  const lock = filename(id) + ".lock";
  const deadline = Date.now() + 15_000;
  for (;;) {
    try {
      await mkdir(lock);
      break;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      if (Date.now() >= deadline)
        throw new AuthError(
          503,
          "Sessão ocupada. Tente novamente ou entre em uma nova sessão.",
        );
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
  try {
    return await operation();
  } finally {
    await rm(lock, { recursive: true, force: true });
  }
}

export async function createStoredSession(tokens: TokenSet) {
  await mkdir(directory(), { recursive: true, mode: 0o700 });
  // Best-effort cleanup after the absolute deadline; sessions never extend it.
  for (const entry of await readdir(/* turbopackIgnore: true */ directory())) {
    if (!/^[a-f0-9]{64}\.json$/.test(entry)) continue;
    const target = path.join(/* turbopackIgnore: true */ directory(), entry);
    try {
      const stored: StoredSession = JSON.parse(
        await readFile(/* turbopackIgnore: true */ target, "utf8"),
      );
      if (stored.expiresAt < Date.now() - 60_000)
        await rm(target, { force: true });
    } catch {
      /* Another request may already have removed this expired session. */
    }
  }
  const id = randomBytes(32).toString("hex");
  const session: StoredSession = {
    ...tokens,
    expiresAt: tokens.refreshExpiresAt,
  };
  await writeStoredSession(id, session);
  return { id, session };
}
