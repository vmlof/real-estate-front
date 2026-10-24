"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession, destroySession } from "@/lib/session";
import { backendAuth, readTokens } from "@/lib/auth-backend";
import { authErrorMessage } from "@/lib/auth-http";
import { safeReturnTo } from "@/lib/auth";

export type AuthState = { error?: string } | null;

const loginSchema = z.object({
  email: z.string().trim().pipe(z.email()),
  password: z.string().min(1),
});

export async function loginAction(
  _previous: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const credentials = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!credentials.success)
    return { error: "Enter a valid email address and your password." };

  let destination: string;

  try {
    // Do not silently abandon a previous session or a pending revocation.
    await destroySession();

    const tokens = await readTokens(
      await backendAuth({ operation: "login", credentials: credentials.data }),
    );

    await createSession(tokens);

    destination = safeReturnTo(formData.get("returnTo"), tokens.user.role);
  } catch (error) {
    return { error: authErrorMessage(error) };
  }
  redirect(destination);
}

export async function logoutAction(): Promise<AuthState> {
  try {
    await destroySession();
  } catch (error) {
    return {
      error: "The logout was not confirmed: " + authErrorMessage(error),
    };
  }
  return null;
}
