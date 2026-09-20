import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { z } from "zod";
import { hasPermission } from "@/lib/permissions";

const updateSchema = z.object({
  title: z.string().trim().min(2).max(160).optional(),
  description: z.string().trim().max(5000).nullable().optional(),
  assigneeId: z.string().nullable().optional(),
  status: z.string().trim().min(1).max(40).optional(),
  dueAt: z.string().datetime().nullable().optional(),
});

export async function PATCH(request: Request, context: { params: Promise<{ id: string; taskId: string }> }) {
  const session = await auth();
  const { id, taskId } = await context.params;
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const task = await prisma.projectTask.findUnique({
    where: { id: taskId },
    select: { id: true, projectId: true, assigneeId: true, project: { select: { ownerId: true, members: { select: { userId: true } } } } },
  });
  if (!task || task.projectId !== id) return NextResponse.json({ error: "Task not found." }, { status: 404 });

  const canManage =
    task.project.ownerId === session.user.id ||
    task.project.members.some((m) => m.userId === session.user.id) ||
    ([UserRole.ADMIN, UserRole.SUPER_ADMIN] as UserRole[]).includes(session.user.role);
  if (!canManage && task.assigneeId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (canManage && !(await hasPermission(session.user.id, session.user.role, "projects.tasks.manage"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid task update." }, { status: 400 });

  if (parsed.data.assigneeId && !task.project.members.some((m) => m.userId === parsed.data.assigneeId) && parsed.data.assigneeId !== task.project.ownerId) {
    return NextResponse.json({ error: "Assignee must be a project member." }, { status: 400 });
  }

  const updated = await prisma.projectTask.update({
    where: { id: taskId },
    data: {
      ...parsed.data,
      description: parsed.data.description === undefined ? undefined : parsed.data.description || null,
      dueAt: parsed.data.dueAt === undefined ? undefined : parsed.data.dueAt ? new Date(parsed.data.dueAt) : null,
    },
    include: { assignee: { select: { id: true, name: true, avatarUrl: true } } },
  });

  return NextResponse.json({ task: updated });
}
