import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { z } from "zod";

const schema = z.object({
  courseId: z.string().min(1),
  title: z.string().trim().min(2).max(180),
  content: z.string().trim().max(20000).nullable().optional(),
  position: z.number().int().min(0).max(10000).optional(),
  duration: z.number().int().min(0).max(10000).nullable().optional(),
});

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id || !(await hasPermission(session.user.id, session.user.role, "learning.read"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const courseId = new URL(request.url).searchParams.get("courseId");
  if (!courseId) return NextResponse.json({ error: "courseId is required." }, { status: 400 });
  const lessons = await prisma.lesson.findMany({ where: { courseId }, orderBy: { position: "asc" } });
  return NextResponse.json({ lessons });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || !(await hasPermission(session.user.id, session.user.role, "learning.manage"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid lesson data." }, { status: 400 });

  const lesson = await prisma.lesson.create({ data: {
    courseId: parsed.data.courseId,
    title: parsed.data.title,
    content: parsed.data.content ?? null,
    position: parsed.data.position ?? 0,
    duration: parsed.data.duration ?? null,
  }});
  await prisma.auditLog.create({ data: { actorId: session.user.id, action: "LESSON_CREATED", entity: "Lesson", entityId: lesson.id, metadata: { courseId: lesson.courseId } } });
  return NextResponse.json({ lesson }, { status: 201 });
}
