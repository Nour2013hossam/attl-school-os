import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const releases = await prisma.resultRelease.findMany({
    orderBy: { releaseAt: "desc" },
  });

  const grades = await prisma.grade.findMany({
    where: {
      userId: session.user.id,
      published: true,
    },
    orderBy: { createdAt: "desc" },
    include: {
      subject: {
        select: { code: true, name: true },
      },
    },
  });

  return NextResponse.json({ grades, releases });
}
