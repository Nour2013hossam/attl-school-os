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

  const achievements = await prisma.achievement.findMany({
    orderBy: [{ createdAt: "asc" }, { title: "asc" }],
    include: {
      users: {
        where: { userId: session.user.id },
        select: { id: true, awardedAt: true },
      },
    },
  });

  return NextResponse.json({
    achievements: achievements.map(({ users, ...achievement }) => ({
      ...achievement,
      unlocked: users.length > 0,
      awardedAt: users[0]?.awardedAt ?? null,
    })),
  });
}
