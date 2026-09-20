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

  const term = "2026-2027";
  const release = await prisma.resultRelease.findUnique({
    where: { term },
  });

  const now = new Date();

  if (release?.locked && now < release.releaseAt) {
    return NextResponse.json({
      locked: true,
      term,
      releaseAt: release.releaseAt,
      grades: [],
    });
  }

  const grades = await prisma.grade.findMany({
    where: {
      userId: session.user.id,
      term,
      published: true,
    },
    orderBy: { createdAt: "desc" },
    include: {
      subject: {
        select: { code: true, name: true },
      },
    },
  });

  return NextResponse.json({
    locked: false,
    term,
    releaseAt: release?.releaseAt ?? null,
    grades,
  });
}
