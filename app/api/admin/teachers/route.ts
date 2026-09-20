import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { UserRole } from "@prisma/client";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await hasPermission(session.user.id, session.user.role, "users.read"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const teachers = await prisma.user.findMany({
    where: { role: UserRole.TEACHER },
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
    select: {
      id: true, name: true, email: true, role: true, isActive: true, createdAt: true, avatarUrl: true,
      teacherProfile: { select: { department: true, title: true, office: true, bio: true } },
      _count: { select: { taughtSchedules: true, grades: true, attendance: true, auditLogs: true } },
    },
  });

  return NextResponse.json({ teachers });
}
