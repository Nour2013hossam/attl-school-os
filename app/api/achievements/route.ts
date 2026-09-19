import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const achievements = await prisma.userAchievement.findMany({
    where: { userId: session.user.id },
    orderBy: { awardedAt: "desc" },
    include: { achievement: true },
  });

  return NextResponse.json({ achievements });
}
