import { getAccessToken } from "@/lib/session";
import { refreshTokenAction } from "@/app/actions/auth";

const API_URL = process.env.API_BASE_URL || "http://localhost:5149/api";

export async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  let accessToken = await getAccessToken();

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Se o token expirou (401 Unauthorized), tenta o refresh automaticamente
  if (response.status === 401) {
    const refreshed = await refreshTokenAction();

    if (refreshed) {
      accessToken = await getAccessToken();
      headers.set("Authorization", `Bearer ${accessToken}`);

      response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });
    }
  }

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.statusText}`);
  }

  return response.json();
}
