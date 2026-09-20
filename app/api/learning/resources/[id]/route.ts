import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { z } from "zod";

const schema = z.object({
  title: z.string().trim().min(2).max(180).optional(),
  description: z.string().trim().max(5000).nullable().optional(),
  type: z.string().trim().min(1).max(60).optional(),
  url: z.string().url().nullable().optional(),
  courseId: z.string().nullable().optional(),
});

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await context.params;
  if (!session?.user?.id || !(await hasPermission(session.user.id, session.user.role, "learning.manage"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid resource update." }, { status: 400 });
  const data = {
    ...parsed.data,
    courseId: parsed.data.courseId === undefined ? undefined : parsed.data.courseId || null,
    description: parsed.data.description === undefined ? undefined : parsed.data.description || null,
    url: parsed.data.url === undefined ? undefined : parsed.data.url || null,
  };
  const resource = await prisma.resource.update({ where: { id }, data });
  await prisma.auditLog.create({ data: { actorId: session.user.id, action: "RESOURCE_UPDATED", entity: "Resource", entityId: id } });
  return NextResponse.json({ resource });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await context.params;
  if (!session?.user?.id || !(await hasPermission(session.user.id, session.user.role, "learning.manage"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await prisma.resource.delete({ where: { id } });
  await prisma.auditLog.create({ data: { actorId: session.user.id, action: "RESOURCE_DELETED", entity: "Resource", entityId: id } });
  return NextResponse.json({ ok: true });
}
