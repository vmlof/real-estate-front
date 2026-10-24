"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="space-y-4 p-8">
      <h1 className="text-xl font-semibold">
        Não foi possível carregar esta página
      </h1>
      <p>
        O serviço pode estar temporariamente indisponível. Aguarde e tente
        novamente.
      </p>
      <button onClick={reset} className="underline">
        Tentar novamente
      </button>
      <a href="/login" className="ml-4 underline">
        Ir para o login
      </a>
    </main>
  );
}
