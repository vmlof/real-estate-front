import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { roleHome } from "@/lib/auth";

export default async function Page() {
  const session = await getSession();
  if (session) redirect(roleHome[session.user.role]);
  return (
    <main className="mx-auto max-w-md space-y-4 p-8">
      <h1 className="text-2xl font-semibold">Cadastro indisponível</h1>
      <p>O cadastro de novas contas ainda não está disponível.</p>
      <Link href="/login" className="underline">
        Entrar com uma conta existente
      </Link>
    </main>
  );
}
