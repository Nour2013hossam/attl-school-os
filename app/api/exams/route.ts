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

  const exams = await prisma.exam.findMany({
    where: {
      published: true,
      subject: {
        enrollments: {
          some: { userId: session.user.id },
        },
      },
    },
    orderBy: { startsAt: "asc" },
    include: {
      subject: { select: { code: true, name: true } },
    },
  });

  return NextResponse.json({ exams });
}
