import "server-only";
import { getSession } from "./session";
import { AuthError, readBody, responseError } from "./auth-http";
import { API_URL } from "./auth-backend";

function validateEndpoint(endpoint: string) {
  if (
    !endpoint.startsWith("/") ||
    endpoint.startsWith("//") ||
    endpoint.startsWith("/auth") ||
    /[\\\r\n]/.test(endpoint)
  ) {
    throw new Error("Invalid endpoint for the authenticated client.");
  }
}

function requestWithToken(
  endpoint: string,
  options: RequestInit,
  token: string,
) {
  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);
  headers.delete("Cookie");

  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    cache: "no-store",
    redirect: "error",
    signal: options.signal ?? AbortSignal.timeout(10_000),
  });
}

export async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T | undefined> {
  validateEndpoint(endpoint);

  const session = await getSession();

  if (!session) throw new AuthError(401, "Log in again to continue.");

  let response = await requestWithToken(endpoint, options, session.accessToken);

  if (response.status === 401) {
    const renewedSession = await getSession(session.accessToken);

    if (!renewedSession)
      throw new AuthError(
        401,
        "Your session has expired. Please log in again.",
      );

    response = await requestWithToken(
      endpoint,
      options,
      renewedSession.accessToken,
    );
  }

  if (!response.ok) throw await responseError(response);

  return (await readBody(response)) as T | undefined;
}
