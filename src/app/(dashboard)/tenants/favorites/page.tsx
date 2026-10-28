import { requireUser } from "@/lib/session";

export default async function Favorites() {
  await requireUser("Tenant");

  return (
    <section>
      <h1 className="text-2xl font-semibold">Favoritos</h1>
      <p className="text-muted-foreground mt-2">
        Seus imóveis favoritos estarão disponíveis aqui em breve.
      </p>
    </section>
  );
}
