import { LoginForm } from "@/components/login-form";
import { LogoutButton } from "@/components/logout-button";
import { getSession, hasPendingLogout } from "@/lib/session";
import { roleHome } from "@/lib/auth";
import { authErrorMessage } from "@/lib/auth-http";
import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  let session;
  let error: string | undefined;

  try {
    session = await getSession();
  } catch (failure) {
    error = authErrorMessage(failure);
  }

  if (session) redirect(roleHome[session.user.role]);
  const pendingLogout = await hasPendingLogout();
  const { returnTo } = await searchParams;

  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4">
        {error && <p role="alert">{error}</p>}
        {pendingLogout && (
          <div className="space-y-2">
            <p>
              Local access blocked. Exit still needs to be confirmed by the
              service.
            </p>
            <LogoutButton />
          </div>
        )}
        <LoginForm returnTo={returnTo} />
      </div>
    </main>
  );
}
