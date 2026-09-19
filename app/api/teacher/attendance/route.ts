import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== UserRole.TEACHER) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const records = await prisma.attendanceRecord.findMany({
    where: {
      subject: {
        schedule: { some: { teacherId: session.user.id, active: true } },
      },
    },
    orderBy: { date: "desc" },
    take: 500,
    include: {
      user: { select: { id: true, name: true, schoolId: true } },
      subject: { select: { code: true, name: true } },
    },
  });

  return NextResponse.json({ records });
}
