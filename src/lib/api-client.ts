import "server-only";
import { getSession } from "./session";
import { AuthError, readBody, responseError } from "./auth-http";
import { API_URL } from "./auth-backend";

export async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T | undefined> {
  if (
    !endpoint.startsWith("/") ||
    endpoint.startsWith("//") ||
    endpoint.startsWith("/auth") ||
    /[\\\r\n]/.test(endpoint)
  ) {
    throw new Error("Endpoint inválido para o cliente autenticado.");
  }
  let session = await getSession();
  if (!session) throw new AuthError(401, "Entre novamente para continuar.");
  const request = (token: string) => {
    const headers = new Headers(options.headers);
    headers.set("Authorization", "Bearer " + token);
    headers.delete("Cookie");
    return fetch(`${API_URL}/${endpoint}`, {
      ...options,
      headers,
      cache: "no-store",
      redirect: "error",
      signal: options.signal ?? AbortSignal.timeout(10_000),
    });
  };
  let response = await request(session.accessToken);
  if (response.status === 401) {
    session = await getSession(session.accessToken);
    if (!session)
      throw new AuthError(401, "Sua sessão expirou. Entre novamente.");
    response = await request(session.accessToken);
  }
  if (!response.ok) throw await responseError(response);
  return (await readBody(response)) as T | undefined;
}
