import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.js
  if (!(await hasPermission(session.user.id, session.user.role, "academics.read"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
on({ error: "Unauthorized" }, { status: 401 });
  }

  const teachers = await prisma.user.findMany({
    where: { role: "TEACHER", isActive: true },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      teacherProfile: true,
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ teachers });
}
