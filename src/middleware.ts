import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/properties", "/profile"];
const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("homely_access_token")?.value;
  const refreshToken = request.cookies.get("homely_refresh_token")?.value;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redireciona usuários não autenticados
  if (isProtectedRoute && !accessToken && !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Se já possui sessão ativa e tenta acessar /login ou /register
  if (isAuthRoute && (accessToken || refreshToken)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Caso o Access Token expirou mas o Refresh Token existe
  if (isProtectedRoute && !accessToken && refreshToken) {
    try {
      const response = await fetch(
        `${process.env.API_BASE_URL}/auth/refresh-token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        const res = NextResponse.next();

        res.cookies.set("homely_access_token", data.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60,
        });

        res.cookies.set("homely_refresh_token", data.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 7 * 24 * 60 * 60,
        });

        return res;
      }
    } catch {
      // Em caso de falha na renovação
      const res = NextResponse.redirect(new URL("/login", request.url));
      res.cookies.delete("homely_access_token");
      res.cookies.delete("homely_refresh_token");
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
