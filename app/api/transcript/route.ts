import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!(await hasPermission(session.user.id, session.user.role, "academics.read"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const grades = await prisma.grade.findMany({
    where: {
      userId: session.user.id,
      published: true,
    },
    orderBy: [{ term: "asc" }, { createdAt: "asc" }],
    include: {
      subject: {
        select: { code: true, name: true, credits: true },
      },
    },
  });

  const terms = Array.from(new Set(grades.map((grade) => grade.term)));

  return NextResponse.json({ grades, terms });
}
