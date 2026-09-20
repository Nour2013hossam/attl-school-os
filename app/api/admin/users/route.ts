import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { hasAnyPermission } from "@/lib/permissions";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }


  if (!(await hasAnyPermission(session.user.id, session.user.role, ["users.read", "xp.manage"]))) return NextResponse.json({ error: "You do not have permission to view users." }, { status: 403 });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      schoolId: true,
      gradeLevel: true,
      className: true,
      xp: true,
      level: true,
      isActive: true,
      attlMembershipActive: true,
      customRole: { select: { id: true, name: true } },
      createdAt: true,
    },
  });

  return NextResponse.json({ users });
}
