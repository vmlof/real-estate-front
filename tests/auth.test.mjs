import "./register.mjs";
import { test, after } from "node:test";
import assert from "node:assert/strict";
import { AsyncLocalStorage } from "node:async_hooks";
import { mkdtemp, rm, readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";

const { readTokens, backendAuth } = await import("../src/lib/auth-backend.ts");
const { AuthError, readBody, responseError } =
  await import("../src/lib/auth-http.ts");
const { safeReturnTo } = await import("../src/lib/auth.ts");
const { createStoredSession, readStoredSession, writeStoredSession } =
  await import("../src/lib/session-store.ts");
const { getSession, destroySession, requireUser, createSession } =
  await import("../src/lib/session.ts");
const { fetchWithAuth } = await import("../src/lib/api-client.ts");

process.env.SESSION_STORE_DIR = await mkdtemp(
  path.join(tmpdir(), "homely-auth-test-"),
);
process.env.API_BASE_URL = "https://api.example.test/api";
globalThis.__testCookies = new AsyncLocalStorage();
const originalFetch = globalThis.fetch;
after(async () => {
  globalThis.fetch = originalFetch;
  await rm(process.env.SESSION_STORE_DIR, { recursive: true, force: true });
});

function jwt(role = "Tenant", expires = Math.floor(Date.now() / 1000) + 900) {
  return (
    "header." +
    Buffer.from(
      JSON.stringify({
        sub: "1",
        email: "user@example.test",
        role,
        exp: expires,
      }),
    ).toString("base64url") +
    ".signature"
  );
}
function authResponse(role = "Tenant", refresh = "replacement") {
  return Response.json(
    { accessToken: jwt(role) },
    {
      headers: {
        "Set-Cookie":
          "refreshToken=" +
          refresh +
          "; Max-Age=604800; Path=/api/auth; Secure; HttpOnly; SameSite=Strict",
      },
    },
  );
}
async function fixture(expired = false) {
  const tokens = await readTokens(authResponse());
  if (expired) tokens.accessExpiresAt = 0;
  return createStoredSession(tokens);
}
function request(id, fn) {
  const values = new Map(id ? [["homely_session", id]] : []);
  return globalThis.__testCookies.run(
    {
      get: (name) =>
        values.has(name) ? { value: values.get(name) } : undefined,
      set: (name, value, options) => values.set(name, { value, options }),
      delete: (name) => values.delete(name),
      values,
    },
    fn,
  );
}

test("public contract uses Set-Cookie, validates claims and rejects unknown roles", async () => {
  const tokens = await readTokens(authResponse());
  assert.equal(tokens.refreshToken, "replacement");
  assert.deepEqual(tokens.user, {
    id: "1",
    email: "user@example.test",
    role: "Tenant",
  });
  await assert.rejects(readTokens(authResponse("Admin")), /inválidos/);
  await assert.rejects(
    readTokens(Response.json({ accessToken: jwt() })),
    /Cookie/,
  );
  await assert.rejects(
    readTokens(Response.json({ accessToken: jwt("Tenant", 1) })),
    /inválidos/,
  );
  await assert.rejects(
    readTokens(Response.json({ accessToken: "invalid" })),
    /inválido/,
  );
});

test("refresh and logout forward a cookie, never a JSON refresh token", async () => {
  globalThis.fetch = async (url, options) => {
    assert.equal(options.headers.get("Cookie"), "refreshToken=private-token");
    assert.equal(options.body, undefined);
    assert.equal(options.cache, "no-store");
    return url.endsWith("logout")
      ? new Response(null, { status: 204 })
      : authResponse();
  };
  await backendAuth("refresh-token", { refreshToken: "private-token" });
  await backendAuth("logout", { refreshToken: "private-token" });
});

test("empty responses, business errors, validation and rate limiting are distinct", async () => {
  assert.equal(await readBody(new Response(null, { status: 204 })), undefined);
  assert.equal(
    (await responseError(new Response(null, { status: 401 }))).status,
    401,
  );
  assert.equal(
    (
      await responseError(
        Response.json({ description: "Invalid credentials" }, { status: 401 }),
      )
    ).message,
    "Invalid credentials",
  );
  assert.equal(
    (
      await responseError(
        Response.json(
          { errors: { email: ["Invalid email"] } },
          { status: 400 },
        ),
      )
    ).message,
    "Invalid email",
  );
  assert.equal(
    (await responseError(new Response("not JSON", { status: 429 }))).status,
    429,
  );
  assert.ok(
    !(
      await responseError(Response.json({ detail: "secret" }, { status: 500 }))
    ).message.includes("secret"),
  );
});

test("opaque cookie cannot impersonate a user; destinations are role restricted", async () => {
  assert.equal(await request(jwt("Manager"), () => getSession()), null);
  assert.equal(await request("a".repeat(64), () => getSession()), null);
  assert.equal(
    safeReturnTo("https://evil.test", "Tenant"),
    "/tenants/favorites",
  );
  assert.equal(safeReturnTo("/managers", "Tenant"), "/tenants/favorites");
  const { id } = await fixture();
  await assert.rejects(
    request(id, () => requireUser("Manager")),
    /REDIRECT:\/tenants\/favorites/,
  );
});

test("creation stores only an opaque HttpOnly identifier in the browser", async () => {
  await request(null, async () => {
    await createSession(await readTokens(authResponse()));
    const cookie = globalThis.__testCookies
      .getStore()
      .values.get("homely_session");
    assert.match(cookie.value, /^[a-f0-9]{64}$/);
    assert.equal(cookie.options.httpOnly, true);
    assert.equal(cookie.options.path, "/");
    assert.equal((await readStoredSession(cookie.value)).user.role, "Tenant");
  });
});

test("simultaneous requests share one rotation and read its successor", async () => {
  const { id } = await fixture(true);
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    await new Promise((resolve) => setTimeout(resolve, 80));
    return authResponse("Tenant", "rotated-once");
  };
  const sessions = await Promise.all(
    Array.from({ length: 5 }, () => request(id, () => getSession())),
  );
  assert.equal(calls, 1);
  assert.ok(
    sessions.every((session) => session.refreshToken === "rotated-once"),
  );
});

test("independent Node processes share the session and serialize rotation", async () => {
  const { id } = await fixture(true);
  const worker = () =>
    new Promise((resolve, reject) => {
      const child = spawn(process.execPath, ["tests/refresh-worker.mjs"], {
        env: { ...process.env, TEST_SESSION_ID: id },
        stdio: ["ignore", "ignore", "pipe"],
      });
      let errors = "";
      child.stderr.on("data", (data) => {
        errors += data;
      });
      child.on("error", reject);
      child.on("exit", (code) =>
        code === 0 ? resolve() : reject(new Error(errors)),
      );
    });
  await Promise.all([worker(), worker(), worker()]);
  assert.equal(
    await readFile(
      path.join(process.env.SESSION_STORE_DIR, "refresh-calls.txt"),
      "utf8",
    ),
    "refresh\n",
  );
  assert.equal((await readStoredSession(id)).refreshToken, "worker-successor");
});

test("temporary errors preserve the session and apply backoff; 401 removes it", async () => {
  const { id } = await fixture(true);
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    return new Response(null, { status: 429 });
  };
  await assert.rejects(
    request(id, () => getSession()),
    (error) => error.status === 429,
  );
  await assert.rejects(
    request(id, () => getSession()),
    (error) => error.status === 429,
  );
  assert.equal(calls, 1);
  const stored = await readStoredSession(id);
  assert.equal(stored.refreshToken, "replacement");
  await writeStoredSession(id, { ...stored, retryAfter: 0 });
  globalThis.fetch = async () => new Response(null, { status: 401 });
  assert.equal(await request(id, () => getSession()), null);
  assert.equal(await readStoredSession(id), null);
});

test("refresh completing first cannot resurrect a logged out session", async () => {
  const { id } = await fixture(true);
  let release;
  let started;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  const entered = new Promise((resolve) => {
    started = resolve;
  });
  globalThis.fetch = async (url, options) => {
    if (url.endsWith("refresh-token")) {
      started();
      await gate;
      return authResponse("Tenant", "successor");
    }
    assert.equal(options.headers.get("Cookie"), "refreshToken=successor");
    return new Response(null, { status: 204 });
  };
  const refresh = request(id, () => getSession());
  await entered;
  const logout = request(id, () => destroySession());
  release();
  await Promise.all([refresh, logout]);
  assert.equal(await request(id, () => getSession()), null);
});

test("logout first blocks queued refresh and failed logout can be retried", async () => {
  const { id } = await fixture(true);
  let calls = 0;
  globalThis.fetch = async (url) => {
    calls++;
    assert.ok(url.endsWith("logout"));
    return new Response(null, { status: 500 });
  };
  await assert.rejects(
    request(id, () => destroySession()),
    AuthError,
  );
  assert.equal(await request(id, () => getSession()), null);
  assert.equal((await readStoredSession(id)).accessToken, "");
  assert.equal(calls, 1);
  globalThis.fetch = async () => new Response(null, { status: 204 });
  await request(id, () => destroySession());
  assert.equal(await readStoredSession(id), null);
});

test("authenticated client retries a 401 once, supports 204, never refreshes 403", async () => {
  const { id } = await fixture();
  let resourceCalls = 0;
  let refreshCalls = 0;
  globalThis.fetch = async (url, options) => {
    if (url.endsWith("refresh-token")) {
      refreshCalls++;
      return authResponse();
    }
    assert.ok(options.headers.get("Authorization").startsWith("Bearer "));
    resourceCalls++;
    return new Response(null, { status: resourceCalls === 1 ? 401 : 204 });
  };
  assert.equal(await request(id, () => fetchWithAuth("/example")), undefined);
  assert.equal(resourceCalls, 2);
  assert.equal(refreshCalls, 1);
  let forbiddenCalls = 0;
  globalThis.fetch = async () => {
    forbiddenCalls++;
    return new Response(null, { status: 403 });
  };
  await assert.rejects(
    request(id, () => fetchWithAuth("/example")),
    (error) => error.status === 403,
  );
  assert.equal(forbiddenCalls, 1);
  let unauthorizedCalls = 0;
  globalThis.fetch = async (url) => {
    if (url.endsWith("refresh-token")) {
      refreshCalls++;
      return authResponse();
    }
    unauthorizedCalls++;
    return new Response(null, { status: 401 });
  };
  await assert.rejects(
    request(id, () => fetchWithAuth("/example")),
    (error) => error.status === 401,
  );
  assert.equal(unauthorizedCalls, 2);
  assert.equal(refreshCalls, 2);
});
