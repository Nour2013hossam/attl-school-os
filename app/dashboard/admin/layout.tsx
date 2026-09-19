import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(session.user.role)) {
    redirect("/dashboard");
  }

  return children;
}
