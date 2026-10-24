import { requireUser } from "@/lib/session";

export default async function ManagerPage() {
  await requireUser("Manager");
  return (
    <section>
      <h1 className="text-2xl font-semibold">Painel do gestor</h1>
      <p className="text-muted-foreground mt-2">
        Você está conectado. A gestão de imóveis estará disponível em breve.
      </p>
    </section>
  );
}
