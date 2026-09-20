import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole, AttendanceStatus } from "@prisma/client";
import { z } from "zod";
import { hasPermission } from "@/lib/permissions";

const attendanceSchema = z.object({
  userId: z.string().min(1),
  subjectId: z.string().min(1),
  date: z.coerce.date(),
  status: z.nativeEnum(AttendanceStatus),
  note: z.string().max(500).nullable().optional(),
});

async function requireTeacher() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== UserRole.TEACHER) return null;
  return session;
}

export async function GET() {
  const session = await requireTeacher();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!(await hasPermission(session.user.id, session.user.role, "academics.attendance.write"))) return NextResponse.json({ error: "You do not have permission to access attendance management." }, { status: 403 });

  const [records, subjects] = await Promise.all([
    prisma.attendanceRecord.findMany({
      where: { subject: { schedule: { some: { teacherId: session.user.id, active: true } } } },
      orderBy: { date: "desc" },
      take: 500,
      include: {
        user: { select: { id: true, name: true, schoolId: true } },
        subject: { select: { id: true, code: true, name: true } },
      },
    }),
    prisma.subject.findMany({
      where: { schedule: { some: { teacherId: session.user.id, active: true } } },
      orderBy: { name: "asc" },
      select: { id: true, code: true, name: true },
    }),
  ]);

  return NextResponse.json({ records, subjects });
}

export async function POST(request: Request) {
  const session = await requireTeacher();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = attendanceSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid attendance data." }, { status: 400 });

  const canTeach = await prisma.scheduleItem.findFirst({
    where: { teacherId: session.user.id, subjectId: parsed.data.subjectId, active: true },
    select: { id: true },
  });
  if (!canTeach) return NextResponse.json({ error: "You do not teach this subject." }, { status: 403 });

  const student = await prisma.user.findUnique({
    where: { id: parsed.data.userId },
    select: { id: true, role: true },
  });
  if (!student || student.role !== UserRole.STUDENT) return NextResponse.json({ error: "Student not found." }, { status: 404 });

  const date = new Date(parsed.data.date);
  date.setHours(0, 0, 0, 0);

  const record = await prisma.attendanceRecord.upsert({
    where: {
      userId_subjectId_date: {
        userId: parsed.data.userId,
        subjectId: parsed.data.subjectId,
        date,
      },
    },
    update: { status: parsed.data.status, note: parsed.data.note ?? null },
    create: {
      userId: parsed.data.userId,
      subjectId: parsed.data.subjectId,
      date,
      status: parsed.data.status,
      note: parsed.data.note ?? null,
    },
  });

  return NextResponse.json({ record });
}
