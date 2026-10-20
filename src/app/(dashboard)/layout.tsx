"use client";

import NavBar from "@/components/NavBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "@/components/AppSideBar";
import { NAVBAR_HEIGHT } from "@/lib/constants";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  //verificar qual user está logado
  const userLogged = "manager";

  return (
    <SidebarProvider>
      <div className="bg-primary-100 min-h-screen w-full">
        <NavBar />
        <div style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}>
          <div className="flex">
            <Sidebar userType={userLogged} />
            <div className="grow transition-all duration-300">{children}</div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
