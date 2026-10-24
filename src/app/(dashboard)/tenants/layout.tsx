import { requireUser } from "@/lib/session";

export default async function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser("Tenant");
  return children;
}
