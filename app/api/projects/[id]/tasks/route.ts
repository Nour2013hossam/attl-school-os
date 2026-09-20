import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().trim().min(2).max(160),
  description: z.string().trim().max(5000).optional(),
  assigneeId: z.string().nullable().optional(),
  status: z.string().trim().min(1).max(40).optional(),
  dueAt: z.string().datetime().nullable().optional(),
});

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await context.params;
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const project = await prisma.project.findUnique({
    where: { id },
    select: { ownerId: true, visibility: true, members: { select: { userId: true } } },
  });
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  const allowed =
    project.ownerId === session.user.id ||
    project.members.some((m) => m.userId === session.user.id) ||
    ["school", "public"].includes(project.visibility);
  if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const tasks = await prisma.projectTask.findMany({
    where: { projectId: id },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: { assignee: { select: { id: true, name: true, avatarUrl: true } } },
  });

  return NextResponse.json({ tasks });
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await context.params;
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const project = await prisma.project.findUnique({
    where: { id },
    select: { ownerId: true, members: { select: { userId: true } } },
  });
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  const canManage =
    project.ownerId === session.user.id ||
    project.members.some((m) => m.userId === session.user.id) ||
    [UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(session.user.role);
  if (!canManage) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = createSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid task data." }, { status: 400 });

  if (parsed.data.assigneeId && !project.members.some((m) => m.userId === parsed.data.assigneeId) && parsed.data.assigneeId !== project.ownerId) {
    return NextResponse.json({ error: "Assignee must be a project member." }, { status: 400 });
  }

  const task = await prisma.projectTask.create({
    data: {
      projectId: id,
      title: parsed.data.title,
      description: parsed.data.description || null,
      assigneeId: parsed.data.assigneeId || null,
      status: parsed.data.status || "Todo",
      dueAt: parsed.data.dueAt ? new Date(parsed.data.dueAt) : null,
    },
    include: { assignee: { select: { id: true, name: true, avatarUrl: true } } },
  });

  await prisma.auditLog.create({
    data: { actorId: session.user.id, action: "PROJECT_TASK_CREATED", entity: "ProjectTask", entityId: task.id, metadata: { projectId: id } },
  });

  return NextResponse.json({ task }, { status: 201 });
}
