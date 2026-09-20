import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { z } from "zod";

const schema = z.object({
  courseId: z.string().nullable().optional(),
  title: z.string().trim().min(2).max(180),
  description: z.string().trim().max(5000).nullable().optional(),
  type: z.string().trim().min(1).max(60),
  url: z.string().url().nullable().optional(),
});

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id || !(await hasPermission(session.user.id, session.user.role, "learning.read"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const courseId = new URL(request.url).searchParams.get("courseId");
  const resources = await prisma.resource.findMany({ where: courseId ? { courseId } : {}, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ resources });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || !(await hasPermission(session.user.id, session.user.role, "learning.manage"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid resource data." }, { status: 400 });
  const resource = await prisma.resource.create({ data: parsed.data });
  await prisma.auditLog.create({ data: { actorId: session.user.id, action: "RESOURCE_CREATED", entity: "Resource", entityId: resource.id } });
  return NextResponse.json({ resource }, { status: 201 });
}
