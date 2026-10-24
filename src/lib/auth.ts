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
export const roleLinks: Record<Role, { href: string; label: string }[]> = {
  Manager: [{ href: roleHome.Manager, label: "Visão geral" }],
  Tenant: [{ href: roleHome.Tenant, label: "Favoritos" }],
};

export function safeReturnTo(value: unknown, role: Role): string {
  // Allow only implemented destinations belonging to this role.
  return typeof value === "string" &&
    roleLinks[role].some(({ href }) => value === href)
    ? value
    : roleHome[role];
}
