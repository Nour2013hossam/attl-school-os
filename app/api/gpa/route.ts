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

  const grades = await prisma.grade.findMany({
    where: { userId: session.user.id, published: true },
    include: { subject: { select: { credits: true, code: true, name: true } } },
  });

  const byTerm = new Map<string, { weighted: number; credits: number }>();

  for (const grade of grades) {
    if (!byTerm.has(grade.term)) {
      byTerm.set(grade.term, { weighted: 0, credits: 0 });
    }

    const row = byTerm.get(grade.term)!;
    const percentage = grade.maxScore > 0 ? grade.score / grade.maxScore : 0;
    row.weighted += percentage * grade.subject.credits;
    row.credits += grade.subject.credits;
  }

  const terms = [...byTerm.entries()].map(([term, row]) => ({
    term,
    gpa: row.credits ? Number((row.weighted / row.credits * 4).toFixed(2)) : 0,
    credits: row.credits,
  }));

  return NextResponse.json({ terms });
}
