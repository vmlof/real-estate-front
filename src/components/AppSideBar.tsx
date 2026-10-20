import { usePathname } from "next/navigation";
import React from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import {
  Building,
  FileText,
  Heart,
  Home,
  Menu,
  Settings,
  X,
} from "lucide-react";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { cn } from "cn";

const AppSideBar = ({ userType }: { userType: string }) => {
  const pathName = usePathname();
  const { toggleSideBar, open } = useSidebar();

  // adicionar enums para roles
  const navLinks =
    userType === "manager"
      ? [
          { icon: Building, label: "Properties", href: "/managers/properties" },
          {
            icon: FileText,
            label: "Applications",
            href: "/managers/applications",
          },

          {
            icon: Settings,
            label: "Settings",
            href: "/managers/settings",
          },
        ]
      : [
          { icon: Heart, label: "Favorites", href: "/tenants/favorites" },
          {
            icon: FileText,
            label: "Applications",
            href: "/tenants/applications",
          },
          { icon: Home, label: "Residences", href: "/tenants/residences" },
          {
            icon: Settings,
            label: "Settings",
            href: "/tenants/settings",
          },
        ];

  return (
    <Sidebar
      collapsible="icon"
      className="fixed left-0 bg-white shadow-lg"
      style={{
        top: `${NAVBAR_HEIGHT}px`,
        height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
      }}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div
              className={cn(
                "min-h[56px] mb-3 flex w-full items-center pt-3",
                open ? "justify-between px-6" : "justify-center",
              )}
            >
              {open ? (
                <>
                  <h1 className="text-xl font-bold text-gray-800">
                    {userType === "manager" ? "Manager View" : "Renter View"}
                    <button
                      className="hove:bg-gray-100 rounded-md p-2"
                      onClick={() => toggleSideBar()}
                    >
                      <X className="h-6 w-6 text-gray-600" />
                    </button>
                  </h1>
                </>
              ) : (
                <button
                  className="hove:bg-gray-100 rounded-md p-2"
                  onClick={() => toggleSideBar()}
                >
                  <Menu className="h-6 w-6 text-gray-600" />
                </button>
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
    </Sidebar>
  );
};

export default AppSideBar;
