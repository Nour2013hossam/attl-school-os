import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { z } from "zod";
import { hasPermission } from "@/lib/permissions";

const gradeSchema = z.object({
  userId: z.string().min(1),
  subjectId: z.string().min(1),
  term: z.string().min(1).max(80),
  assessment: z.string().min(1).max(120),
  score: z.number().min(0),
  maxScore: z.number().positive(),
  published: z.boolean().optional(),
});

async function requireTeacher() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== UserRole.TEACHER) return null;
  return session;
}

async function canTeachSubject(teacherId: string, subjectId: string) {
  return prisma.scheduleItem.findFirst({
    where: { teacherId, subjectId, active: true },
    select: { id: true },
  });
}

export async function GET() {
  const session = await requireTeacher();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!(await hasPermission(session.user.id, session.user.role, "academics.grades.write"))) return NextResponse.json({ error: "You do not have permission to access the gradebook." }, { status: 403 });

  const [grades, subjects] = await Promise.all([
    prisma.grade.findMany({
      where: { subject: { schedule: { some: { teacherId: session.user.id, active: true } } } },
      orderBy: { createdAt: "desc" },
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

  return NextResponse.json({ grades, subjects });
}

export async function POST(request: Request) {
  const session = await requireTeacher();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = gradeSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid grade data." }, { status: 400 });

  if (!(await canTeachSubject(session.user.id, parsed.data.subjectId))) {
    return NextResponse.json({ error: "You do not teach this subject." }, { status: 403 });
  }

  const student = await prisma.user.findUnique({
    where: { id: parsed.data.userId },
    select: { id: true, role: true },
  });

  if (!student || student.role !== UserRole.STUDENT) {
    return NextResponse.json({ error: "Student not found." }, { status: 404 });
  }

  const existing = await prisma.grade.findFirst({
    where: {
      userId: parsed.data.userId,
      subjectId: parsed.data.subjectId,
      term: parsed.data.term,
      assessment: parsed.data.assessment,
    },
    select: { id: true },
  });

  const grade = existing
    ? await prisma.grade.update({ where: { id: existing.id }, data: parsed.data })
    : await prisma.grade.create({ data: parsed.data });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      action: existing ? "TEACHER_GRADE_UPDATED" : "TEACHER_GRADE_CREATED",
      entity: "Grade",
      entityId: grade.id,
      metadata: { userId: parsed.data.userId, subjectId: parsed.data.subjectId, assessment: parsed.data.assessment },
    },
  });

  return NextResponse.json({ grade }, { status: existing ? 200 : 201 });
}
