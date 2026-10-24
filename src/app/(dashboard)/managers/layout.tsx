import { requireUser } from "@/lib/session";

export default async function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser("Manager");
  return children;
}
