import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== UserRole.TEACHER) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [timetable, assignments, taughtSubjects, upcomingExams] = await Promise.all([
    prisma.scheduleItem.count({ where: { teacherId: session.user.id, active: true } }),
    prisma.assignment.count({
      where: { subject: { schedule: { some: { teacherId: session.user.id, active: true } } } },
    }),
    prisma.subject.count({
      where: { schedule: { some: { teacherId: session.user.id, active: true } } },
    }),
    prisma.exam.count({
      where: { subject: { schedule: { some: { teacherId: session.user.id, active: true } } }, startsAt: { gte: new Date() } },
    }),
  ]);

  return NextResponse.json({
    stats: { timetable, assignments, taughtSubjects, upcomingExams },
  });
}
