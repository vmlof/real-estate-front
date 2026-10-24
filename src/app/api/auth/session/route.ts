import { getSession } from "@/lib/session";
import { AuthError, authErrorMessage } from "@/lib/auth-http";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const headers = { "Cache-Control": "no-store" };

  if (request.headers.get("sec-fetch-site") === "cross-site") {
    return Response.json(
      { description: "Origin not permitted." },
      { status: 403, headers },
    );
  }
  try {
    const session = await getSession();
    return Response.json({ user: session?.user ?? null }, { headers });
  } catch (error) {
    return Response.json(
      { description: authErrorMessage(error) },
      {
        status: error instanceof AuthError ? error.status : 503,
        headers,
      },
    );
  }
}
