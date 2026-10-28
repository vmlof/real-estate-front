"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "./ui/sidebar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { roleLinks, type Role } from "@/lib/auth";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";

interface AppSideBarProps {
  role: Role;
}

export default function AppSideBar({ role }: AppSideBarProps) {
  const pathname = usePathname();
  const { open, openMobile, isMobile, toggleSidebar } = useSidebar();
  const isOpen = isMobile ? openMobile : open;

  return (
    <Sidebar
      collapsible="icon"
      className="fixed left-0 bg-white shadow-lg"
      style={{
        top: NAVBAR_HEIGHT,
        height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
      }}
    >
      <SidebarHeader>
        <div
          className={`flex items-center ${
            isOpen ? "justify-between" : "justify-center"
          }`}
        >
          {isOpen && (
            <span className="px-2 font-semibold">
              {role === "Manager" ? "Manager View" : "Renter View"}
            </span>
          )}

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={toggleSidebar}
            aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {roleLinks[role].map(({ Icon, href, label }) => (
            <SidebarMenuItem key={href}>
              <SidebarMenuButton
                isActive={pathname === href}
                render={<Link href={href} />}
                tooltip={label}
                className="group-data-[collapsible=icon]:mx-auto"
              >
                <Icon />
                <span>{label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
