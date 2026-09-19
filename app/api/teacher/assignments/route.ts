import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== UserRole.TEACHER) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const assignments = await prisma.assignment.findMany({
    where: {
      subject: {
        schedule: { some: { teacherId: session.user.id, active: true } },
      },
    },
    orderBy: { dueAt: "asc" },
    include: {
      subject: { select: { code: true, name: true } },
      submissions: { select: { status: true, score: true, submittedAt: true } },
    },
  });

  return NextResponse.json({ assignments });
}
