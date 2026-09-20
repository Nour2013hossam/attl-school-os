import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await hasPermission(session.user.id, session.user.role, "profile.read"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [logs, projects, goals] = await Promise.all([
    prisma.auditLog.findMany({
      where: { actorId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: { id: true, action: true, entity: true, entityId: true, createdAt: true, metadata: true },
    }),
    prisma.project.findMany({
      where: { OR: [{ ownerId: session.user.id }, { members: { some: { userId: session.user.id } } }] },
      orderBy: { updatedAt: "desc" },
      take: 10,
      select: { id: true, title: true, status: true, progress: true, updatedAt: true },
    }),
    prisma.goal.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      take: 10,
      select: { id: true, title: true, progress: true, completedAt: true, updatedAt: true },
    }),
  ]);

  return NextResponse.json({ logs, projects, goals });
}
