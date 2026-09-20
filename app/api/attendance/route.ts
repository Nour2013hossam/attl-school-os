import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!(await hasPermission(session.user.id, session.user.role, "academics.read"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const records = await prisma.attendanceRecord.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
    take: 200,
    include: { subject: { select: { code: true, name: true } } },
  });

  const totals = records.reduce(
    (acc, record) => {
      acc.total += 1;
      acc[record.status] += 1;
      return acc;
    },
    {
      total: 0,
      PRESENT: 0,
      ABSENT: 0,
      LATE: 0,
      EXCUSED: 0,
    } as Record<string, number>
  );

  return NextResponse.json({ records, totals });
}
