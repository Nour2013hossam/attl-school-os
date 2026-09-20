import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await hasPermission(session.user.id, session.user.role, "community.read"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const ideas = await prisma.idea.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { author: { select: { id: true, name: true, avatarUrl: true } } },
  });

  const announcements = await prisma.notification.findMany({
    where: { type: "COMMUNITY" },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { user: { select: { id: true, name: true, avatarUrl: true } } },
  });

  return NextResponse.json({ ideas, announcements });
}
