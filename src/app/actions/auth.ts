"use server";

import { redirect } from "next/navigation";
import { createSession, destroySession, getRefreshToken } from "@/lib/session";
import { LoginRequest, LoginResponse, Result } from "@/types/index";

const API_URL = process.env.API_BASE_URL || "http://localhost:5149/api";

export type AuthState = { error?: string } | null;

export async function loginAction(
  prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const body: LoginRequest = { email, password };

  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json();
    return { error: errorData.message || "Falha na autenticação" };
  }

  const data: LoginResponse = await response.json();
  await createSession(data.accessToken, data.refreshToken);

  redirect("/dashboard");
}

export async function refreshTokenAction(): Promise<boolean> {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      await destroySession();
      return false;
    }

    const data: LoginResponse = await response.json();
    await createSession(data.accessToken, data.refreshToken);
    return true;
  } catch {
    await destroySession();
    return false;
  }
}

export async function logoutAction() {
  const refreshToken = await getRefreshToken();

  if (refreshToken) {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
    } catch {
      // Ignora erros na revogação do backend caso a conexão falhe
    }
  }

  await destroySession();
  redirect("/login");
}
