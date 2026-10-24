import "./register.mjs";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { once } from "node:events";

// Exercise the built Next server and real HTTP routing using isolated session fixtures.
// This does not contact ASP.NET or claim to test browser behavior.
const directory = await mkdtemp(path.join(tmpdir(), "homely-smoke-"));
process.env.SESSION_STORE_DIR = directory;
const { createStoredSession } = await import("../src/lib/session-store.ts");
const tokens = (role) => ({
  user: {
    id: role === "Manager" ? "1" : "2",
    email: role.toLowerCase() + "@example.test",
    role,
  },
  accessToken: "fixture-only",
  refreshToken: "fixture-only",
  accessExpiresAt: Date.now() + 900_000,
  refreshExpiresAt: Date.now() + 3_600_000,
});
const manager = await createStoredSession(tokens("Manager"));
const tenant = await createStoredSession(tokens("Tenant"));
const port = process.env.SMOKE_PORT || "3217";
const server = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "start", "--port", port],
  {
    env: { ...process.env, NODE_ENV: "production" },
    stdio: ["ignore", "pipe", "pipe"],
  },
);
let logs = "";
server.stdout.on("data", (chunk) => {
  logs += chunk;
});
server.stderr.on("data", (chunk) => {
  logs += chunk;
});
const exit = once(server, "exit");
const url = "http://localhost:" + port;
const request = (route, id) =>
  fetch(url + route, {
    redirect: "manual",
    headers: id ? { Cookie: "homely_session=" + id } : {},
  });
async function redirected(route, id, destination) {
  const response = await request(route, id);
  assert.equal(response.status, 307, route + " should redirect");
  assert.equal(response.headers.get("location"), destination);
}
try {
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    if (server.exitCode !== null) throw new Error(logs);
    try {
      if ((await request("/login")).ok) {
        ready = true;
        break;
      }
    } catch {
      /* Wait for server startup. */
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  assert.ok(ready, logs || "Next.js failed to start");
  await redirected("/managers", undefined, "/login");
  await redirected("/tenants/favorites", undefined, "/login");
  await redirected("/managers", tenant.id, "/tenants/favorites");
  await redirected("/tenants/favorites", manager.id, "/managers");
  await redirected("/login", tenant.id, "/tenants/favorites");
  await redirected("/login", manager.id, "/managers");
  assert.match(
    await (await request("/managers", manager.id)).text(),
    /Painel do gestor/,
  );
  assert.match(
    await (await request("/tenants/favorites", tenant.id)).text(),
    /Favoritos/,
  );
  const session = await request("/api/auth/session", tenant.id);
  assert.equal(session.headers.get("cache-control"), "no-store");
  assert.deepEqual(await session.json(), { user: tokens("Tenant").user });
  assert.deepEqual(
    await (await request("/api/auth/session", "a".repeat(64))).json(),
    { user: null },
  );
  assert.equal(
    (
      await fetch(url + "/api/auth/session", {
        headers: { "sec-fetch-site": "cross-site" },
      })
    ).status,
    403,
  );
  console.log(
    "HTTP smoke passed: anonymous access, both roles, redirects, public session response, forged cookie and cross-site rejection.",
  );
} finally {
  server.kill();
  await exit;
  assert.ok(
    path.resolve(directory).startsWith(path.resolve(tmpdir()) + path.sep),
  );
  await rm(directory, { recursive: true, force: true });
}
