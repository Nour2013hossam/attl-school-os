import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { hasAnyPermission } from "@/lib/permissions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const canEnterAdmin = await hasAnyPermission(session.user.id, session.user.role, [
    "users.read",
    "roles.read",
    "permissions.read",
    "academics.grades.write",
    "results.release",
    "analytics.read",
    "audit.read",
    "security.manage",
    "system.manage",
  ]);

  if (!canEnterAdmin) redirect("/dashboard");

  return children;
}
