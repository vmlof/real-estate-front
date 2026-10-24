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
} from "./ui/sidebar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { roleLinks, type Role } from "@/lib/auth";

export default function AppSideBar({ role }: { role: Role }) {
  const pathname = usePathname();
  return (
    <Sidebar
      collapsible="icon"
      style={{
        top: NAVBAR_HEIGHT,
        height: "calc(100vh - " + NAVBAR_HEIGHT + "px)",
      }}
    >
      <SidebarHeader>
        <span className="px-2 font-semibold group-data-[collapsible=icon]:sr-only">
          {role === "Manager" ? "Gestor" : "Inquilino"}
        </span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {roleLinks[role].map(({ href, label }) => (
            <SidebarMenuItem key={href}>
              <SidebarMenuButton
                isActive={pathname === href}
                render={<Link href={href} />}
                tooltip={label}
              >
                <span>{label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
