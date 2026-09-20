import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { z } from "zod";
import { hasPermission } from "@/lib/permissions";

const schema = z.object({ userId: z.string().min(1), role: z.string().trim().max(60).optional() });

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await context.params;
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await hasPermission(session.user.id, session.user.role, "projects.read"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const project = await prisma.project.findUnique({
    where: { id },
    select: { ownerId: true, members: { include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } } } },
  });
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  const allowed = project.ownerId === session.user.id || project.members.some((m) => m.userId === session.user.id);
  if (!allowed && !([UserRole.ADMIN, UserRole.SUPER_ADMIN] as UserRole[]).includes(session.user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  return NextResponse.json({ members: project.members });
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await context.params;
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const project = await prisma.project.findUnique({ where: { id }, select: { ownerId: true } });
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  const canManage = project.ownerId === session.user.id || ([UserRole.ADMIN, UserRole.SUPER_ADMIN] as UserRole[]).includes(session.user.role);
  if (!canManage || !(await hasPermission(session.user.id, session.user.role, "projects.members.manage"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid member data." }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id: parsed.data.userId }, select: { id: true, name: true } });
  if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });

  const member = await prisma.projectMember.upsert({
    where: { projectId_userId: { projectId: id, userId: user.id } },
    update: { role: parsed.data.role || "Member" },
    create: { projectId: id, userId: user.id, role: parsed.data.role || "Member" },
    include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
  });

  await prisma.notification.create({
    data: {
      userId: user.id,
      title: "Added to a project",
      body: "You have been added to a School OS project.",
      type: "PROJECT",
    },
  });

  return NextResponse.json({ member }, { status: 201 });
}
