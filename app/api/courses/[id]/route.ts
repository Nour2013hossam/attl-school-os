import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { z } from "zod";

const schema = z.object({
  title: z.string().trim().min(2).max(180).optional(),
  description: z.string().trim().max(5000).nullable().optional(),
  level: z.string().trim().max(60).nullable().optional(),
  subjectId: z.string().nullable().optional(),
  published: z.boolean().optional(),
});

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const session = await auth();
  const manage = Boolean(session?.user?.id && await hasPermission(session.user.id, session.user.role, "learning.manage"));

  const course = await prisma.course.findFirst({
    where: manage ? { id } : { id, published: true },
    include: {
      subject: { select: { code: true, name: true, description: true } },
      lessons: { orderBy: { position: "asc" } },
      resources: true,
      _count: { select: { enrollments: true } },
    },
  });

  if (!course) return NextResponse.json({ error: "Course not found." }, { status: 404 });
  return NextResponse.json({ course });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await context.params;
  if (!session?.user?.id || !(await hasPermission(session.user.id, session.user.role, "learning.manage"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid course update." }, { status: 400 });

  const course = await prisma.course.update({ where: { id }, data: {
    ...parsed.data,
    subjectId: parsed.data.subjectId === undefined ? undefined : parsed.data.subjectId || null,
    description: parsed.data.description === undefined ? undefined : parsed.data.description || null,
    level: parsed.data.level === undefined ? undefined : parsed.data.level || null,
  }});

  await prisma.auditLog.create({
    data: { actorId: session.user.id, action: "COURSE_UPDATED", entity: "Course", entityId: id, metadata: parsed.data },
  });

  return NextResponse.json({ course });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await context.params;
  if (!session?.user?.id || !(await hasPermission(session.user.id, session.user.role, "learning.manage"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.course.delete({ where: { id } });
  await prisma.auditLog.create({
    data: { actorId: session.user.id, action: "COURSE_DELETED", entity: "Course", entityId: id },
  });

  return NextResponse.json({ ok: true });
}
