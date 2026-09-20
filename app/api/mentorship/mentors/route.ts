import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { hasPermission } from "@/lib/permissions";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await hasPermission(session.user.id, session.user.role, "mentorship.request"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const mentors = await prisma.user.findMany({
    where: {
      isActive: true,
      id: { not: session.user.id },
      role: { in: [UserRole.TEACHER, UserRole.ATTL_MEMBER, UserRole.TRACK_LEAD] },
    },
    orderBy: [{ role: "asc" }, { name: "asc" }],
    select: {
      id: true, name: true, email: true, role: true, avatarUrl: true, bio: true,
      teacherProfile: { select: { title: true, department: true } },
    },
    take: 100,
  });

  return NextResponse.json({ mentors });
}
