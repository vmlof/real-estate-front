import { cookies } from "next/headers";

const ACCESS_TOKEN_KEY = "homely_access_token";
const REFRESH_TOKEN_KEY = "homely_refresh_token";

export async function createSession(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_TOKEN_KEY, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // 1 hora
  });

  cookieStore.set(REFRESH_TOKEN_KEY, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 dias
  });
}

export async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_KEY)?.value;
}

export async function getRefreshToken() {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_KEY)?.value;
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_KEY);
  cookieStore.delete(REFRESH_TOKEN_KEY);
}
