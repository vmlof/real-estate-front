import "./register.mjs";
import { appendFile } from "node:fs/promises";
import path from "node:path";

globalThis.__testCookies = {
  getStore: () => ({ get: () => ({ value: process.env.TEST_SESSION_ID }) }),
};
globalThis.fetch = async () => {
  await appendFile(
    path.join(process.env.SESSION_STORE_DIR, "refresh-calls.txt"),
    "refresh\n",
  );
  await new Promise((resolve) => setTimeout(resolve, 100));
  const payload = Buffer.from(
    JSON.stringify({
      sub: "1",
      email: "user@example.test",
      role: "Tenant",
      exp: Math.floor(Date.now() / 1000) + 900,
    }),
  ).toString("base64url");
  return Response.json(
    { accessToken: "header." + payload + ".signature" },
    {
      headers: {
        "Set-Cookie":
          "refreshToken=worker-successor; Max-Age=604800; Path=/api/auth; HttpOnly; Secure",
      },
    },
  );
};
const { getSession } = await import("../src/lib/session.ts");
const session = await getSession();
if (session?.user.role !== "Tenant")
  throw new Error("Session was not restored");
