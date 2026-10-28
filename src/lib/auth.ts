import {
  Building,
  FileText,
  Heart,
  Home,
  LucideIcon,
  Settings,
} from "lucide-react";

export type Role = "Manager" | "Tenant";

export interface SessionUser {
  id: string;
  email: string;
  role: Role;
}

export const roleHome: Record<Role, string> = {
  Manager: "/managers",
  Tenant: "/tenants/favorites",
};

export const roleLinks: Record<
  Role,
  { Icon: LucideIcon; href: string; label: string }[]
> = {
  Manager: [
    {
      Icon: Building,
      href: `${roleHome.Manager}/properties`,
      label: "Properties",
    },
    {
      Icon: FileText,
      href: `${roleHome.Manager}/applications`,
      label: "Applications",
    },
    { Icon: Settings, href: `${roleHome.Manager}/settings`, label: "Settings" },
  ],
  Tenant: [
    {
      Icon: Heart,
      href: roleHome.Tenant,
      label: "Favorites",
    },
    {
      Icon: Home,
      href: "/tenants/residences",
      label: "Residences",
    },
    {
      Icon: Settings,
      href: "/tenants/settings",
      label: "Settings",
    },
  ],
};

export function safeReturnTo(value: unknown, role: Role): string {
  // Allow only implemented destinations belonging to this role.
  return typeof value === "string" &&
    roleLinks[role].some(({ href }) => value === href)
    ? value
    : roleHome[role];
}
