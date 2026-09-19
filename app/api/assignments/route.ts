import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const assignments = await prisma.assignment.findMany({
    where: {
      subject: {
        enrollments: {
          some: { userId: session.user.id },
        },
      },
    },
    orderBy: { dueAt: "asc" },
    include: {
      subject: { select: { code: true, name: true } },
      submissions: {
        where: { userId: session.user.id },
        select: { status: true, submittedAt: true, score: true, feedback: true },
      },
    },
  });

  return NextResponse.json({ assignments });
}
