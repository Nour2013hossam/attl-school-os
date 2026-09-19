import { auth } from "@/auth";
import type { UserRole } from "@prisma/client";

export async function requireUser() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }

  return session.user;
}

export async function requireRole(roles: UserRole | UserRole[]) {
  const user = await requireUser();
  const allowed = Array.isArray(roles) ? roles : [roles];

  if (!allowed.includes(user.role)) {
    throw new Error("FORBIDDEN");
  }

  return user;
}
