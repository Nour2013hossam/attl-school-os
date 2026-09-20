import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { z } from "zod";

const schema = z.object({
  title: z.string().trim().min(2).max(180).optional(),
  content: z.string().trim().max(20000).nullable().optional(),
  position: z.number().int().min(0).max(10000).optional(),
  duration: z.number().int().min(0).max(10000).nullable().optional(),
});

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await context.params;
  if (!session?.user?.id || !(await hasPermission(session.user.id, session.user.role, "learning.manage"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid lesson update." }, { status: 400 });
  const lesson = await prisma.lesson.update({ where: { id }, data: parsed.data });
  await prisma.auditLog.create({ data: { actorId: session.user.id, action: "LESSON_UPDATED", entity: "Lesson", entityId: id } });
  return NextResponse.json({ lesson });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await context.params;
  if (!session?.user?.id || !(await hasPermission(session.user.id, session.user.role, "learning.manage"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await prisma.lesson.delete({ where: { id } });
  await prisma.auditLog.create({ data: { actorId: session.user.id, action: "LESSON_DELETED", entity: "Lesson", entityId: id } });
  return NextResponse.json({ ok: true });
}
