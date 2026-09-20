import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { UserRole } from "@prisma/client";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await hasPermission(session.user.id, session.user.role, "users.read"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const students = await prisma.user.findMany({
    where: { role: { in: [UserRole.STUDENT, UserRole.ATTL_MEMBER, UserRole.TRACK_LEAD] } },
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
    select: {
      id: true, name: true, email: true, role: true, isActive: true, gradeLevel: true, className: true,
      attlMembershipActive: true, xp: true, level: true, createdAt: true, avatarUrl: true,
      studentProfile: { select: { portfolioUrl: true, interests: true } },
      _count: { select: { projectMemberships: true, grades: true, achievements: true } },
    },
  });

  return NextResponse.json({ students });
}
