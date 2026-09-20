import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { z } from "zod";

const assignmentSchema = z.object({
  subjectId: z.string().min(1),
  title: z.string().trim().min(2).max(160),
  description: z.string().trim().max(5000).optional(),
  dueAt: z.coerce.date(),
  maxScore: z.number().positive().max(10000).default(100),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== UserRole.TEACHER) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [assignments, subjects] = await Promise.all([
    prisma.assignment.findMany({
      where: { subject: { schedule: { some: { teacherId: session.user.id, active: true } } } },
      orderBy: { dueAt: "asc" },
      include: {
        subject: { select: { id: true, code: true, name: true } },
        submissions: { select: { status: true, score: true, submittedAt: true } },
      },
    }),
    prisma.subject.findMany({
      where: { schedule: { some: { teacherId: session.user.id, active: true } } },
      orderBy: { name: "asc" },
      select: { id: true, code: true, name: true },
    }),
  ]);

  return NextResponse.json({ assignments, subjects });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== UserRole.TEACHER) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = assignmentSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid assignment data." }, { status: 400 });

  const canTeach = await prisma.scheduleItem.findFirst({
    where: { teacherId: session.user.id, subjectId: parsed.data.subjectId, active: true },
    select: { id: true },
  });
  if (!canTeach) return NextResponse.json({ error: "You do not teach this subject." }, { status: 403 });

  const assignment = await prisma.assignment.create({ data: parsed.data });
  return NextResponse.json({ assignment }, { status: 201 });
}
