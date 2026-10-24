import NavBar from "@/components/NavBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSideBar from "@/components/AppSideBar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { requireUser } from "@/lib/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full">
        <NavBar user={user} isDashboard />
        <div className="flex" style={{ paddingTop: NAVBAR_HEIGHT }}>
          <AppSideBar role={user.role} />
          <main className="min-w-0 grow p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
