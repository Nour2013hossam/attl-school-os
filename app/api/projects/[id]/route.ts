import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { projectSchema } from "@/lib/validation";
import { hasPermission } from "@/lib/permissions";

async function getAccess(id: string, userId: string, role: UserRole) {
  const project = await prisma.project.findUnique({
    where: { id },
    select: {
      id: true,
      ownerId: true,
      title: true,
      visibility: true,
      members: { select: { userId: true, role: true } },
    },
  });

  if (!project) return { project: null, member: false, canManage: false };

  const member = project.ownerId === userId || project.members.some((item) => item.userId === userId);
  const canManage =
    (project.ownerId === userId || ([UserRole.ADMIN, UserRole.SUPER_ADMIN] as UserRole[]).includes(role)) &&
    await hasPermission(userId, role, "projects.manage");

  return { project, member, canManage };
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await context.params;

  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await hasPermission(session.user.id, session.user.role, "projects.read"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, name: true, avatarUrl: true } },
      members: { include: { user: { select: { id: true, name: true, avatarUrl: true, email: true } } } },
      tasks: { orderBy: [{ status: "asc" }, { createdAt: "desc" }] },
      milestones: { orderBy: { dueAt: "asc" } },
    },
  });

  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  const member = project.ownerId === session.user.id || project.members.some((item) => item.userId === session.user.id);
  if (!member && !["school", "public"].includes(project.visibility)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ project, canManage: (project.ownerId === session.user.id || ([UserRole.ADMIN, UserRole.SUPER_ADMIN] as UserRole[]).includes(session.user.role)) && await hasPermission(session.user.id, session.user.role, "projects.manage") });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await context.params;

  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const access = await getAccess(id, session.user.id, session.user.role);
  if (!access.project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
  if (!access.canManage) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = projectSchema.partial().safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid project update." }, { status: 400 });

  const updated = await prisma.project.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ project: updated });
}
