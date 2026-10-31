import "server-only";
import type { SessionUser } from "./auth";
import { AuthError, readBody, responseError } from "./auth-http";
import { JWTPayload, jwtVerify } from "jose";

export const API_URL = process.env.API_URL;
const secretKey = process.env.SECRET_KEY;

if (!secretKey) {
  throw new Error("secret key was not configured.");
}

const encodedKey = Buffer.from(secretKey, "base64");

export interface TokenSet {
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: number;
  refreshExpiresAt: number;
  user: SessionUser;
}

type ValidClaims = JWTPayload & {
  sub: string;
  email: string;
  role: SessionUser["role"];
  exp: number;
};

type AuthCredentials = {
  email: string;
  password: string;
};

type BackendAuthParams =
  | {
      operation: "login";
      credentials: AuthCredentials;
    }
  | {
      operation: "refresh-token";
      refreshToken: string;
    }
  | {
      operation: "logout";
      refreshToken?: string;
    };

export async function backendAuth(params: BackendAuthParams) {
  const headers = new Headers();
  let loginBody;

  switch (params.operation) {
    case "login":
      headers.set("Content-Type", "application/json");
      loginBody = params.credentials;
      break;
    case "refresh-token":
      headers.set(
        "Cookie",
        "refreshToken=" + encodeURIComponent(params.refreshToken),
      );
      break;
    case "logout":
      if (params.refreshToken) {
        headers.set(
          "Cookie",
          "refreshToken=" + encodeURIComponent(params.refreshToken),
        );
      }
  }

  const response = await fetch(`${API_URL}/auth/${params.operation}`, {
    method: "POST",
    headers,
    body: loginBody ? JSON.stringify(loginBody) : undefined,
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) throw await responseError(response);
  return response;
}

export async function readTokens(response: Response): Promise<TokenSet> {
  const body = await readBody(response);

  if (!validResponse(body))
    throw new AuthError(502, "Invalid authentication response.");

  let claims;

  try {
    const result = await jwtVerify(body.accessToken, encodedKey, {
      algorithms: ["HS256"],
    });
    claims = result.payload;
  } catch {
    throw new AuthError(502, "Invalid access token.");
  }

  if (!validClaims(claims))
    throw new AuthError(502, "Invalid user data or token validity.");

  const { sub, email, role, exp } = claims;

  const cookie = response.headers
    .getSetCookie()
    .find((value) => /^refreshToken=/i.test(value));

  const raw = cookie?.split(";")[0].slice("refreshToken=".length);
  const maxAgeText = cookie?.match(/;\s*max-age=(\d+)/i)?.[1];
  const maxAge = maxAgeText === undefined ? NaN : Number(maxAgeText);

  if (!raw || !Number.isSafeInteger(maxAge) || maxAge <= 0) {
    throw new AuthError(502, "Renewal cookie missing or invalid.");
  }

  let refreshToken: string;

  try {
    refreshToken = decodeURIComponent(raw);
  } catch {
    throw new AuthError(502, "Invalid renewal cookie.");
  }

  return {
    accessToken: body.accessToken,
    refreshToken,
    accessExpiresAt: exp * 1000,
    refreshExpiresAt: Date.now() + Number(maxAge) * 1000,
    user: { id: sub, email, role },
  };
}

export function validClaims(claims: JWTPayload): claims is ValidClaims {
  const { sub, email, role, exp, nbf } = claims;

  if (
    typeof sub !== "string" ||
    !sub ||
    typeof email !== "string" ||
    !email ||
    (role !== "Manager" && role !== "Tenant") ||
    typeof exp !== "number" ||
    !Number.isFinite(exp) ||
    (nbf !== undefined && (typeof nbf !== "number" || !Number.isFinite(nbf)))
  ) {
    return false;
  }
  return true;
}

export function validResponse(body: unknown): body is { accessToken: string } {
  return (
    typeof body === "object" &&
    body !== null &&
    "accessToken" in body &&
    typeof body.accessToken === "string"
  );
}
