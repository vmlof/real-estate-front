import NavBar from "@/components/NavBar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { getSession } from "@/lib/session";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return (
    <div className="h-full w-full">
      <NavBar user={session?.user ?? null} />
      <main
        className="flex h-full w-full flex-col"
        style={{ paddingTop: NAVBAR_HEIGHT }}
      >
        {children}
      </main>
    </div>
  );
}
