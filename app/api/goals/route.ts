import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { goalSchema } from "@/lib/validation";
import { hasPermission } from "@/lib/permissions";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!(await hasPermission(session.user.id, session.user.role, "profile.read"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const goals = await prisma.goal.findMany({
    where: { userId: session.user.id },
    orderBy: [{ completedAt: "asc" }, { targetDate: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ goals });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!(await hasPermission(session.user.id, session.user.role, "goals.manage"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = goalSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid goal data." }, { status: 400 });
  }

  const goal = await prisma.goal.create({
    data: {
      userId: session.user.id,
      title: parsed.data.title,
      description: parsed.data.description,
      targetDate: parsed.data.targetDate ? new Date(parsed.data.targetDate) : undefined,
    },
  });

  return NextResponse.json({ goal }, { status: 201 });
}


export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await hasPermission(session.user.id, session.user.role, "goals.manage"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  if (typeof body.id !== "string") return NextResponse.json({ error: "Goal id is required." }, { status: 400 });

  const existing = await prisma.goal.findFirst({ where: { id: body.id, userId: session.user.id } });
  if (!existing) return NextResponse.json({ error: "Goal not found." }, { status: 404 });

  const progress = body.progress === undefined ? existing.progress : Math.max(0, Math.min(100, Number(body.progress) || 0));
  const title = body.title === undefined ? existing.title : String(body.title).trim().slice(0, 140);
  if (!title) return NextResponse.json({ error: "Goal title is required." }, { status: 400 });

  const goal = await prisma.goal.update({
    where: { id: existing.id },
    data: {
      title,
      description: body.description === undefined ? undefined : String(body.description).trim().slice(0, 2000) || null,
      progress,
      completedAt: progress >= 100 ? (existing.completedAt ?? new Date()) : null,
      targetDate: body.targetDate === undefined ? undefined : (body.targetDate ? new Date(body.targetDate) : null),
    },
  });

  await prisma.auditLog.create({
    data: { actorId: session.user.id, action: "GOAL_UPDATED", entity: "Goal", entityId: goal.id, metadata: { progress: goal.progress } },
  });

  return NextResponse.json({ goal });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await hasPermission(session.user.id, session.user.role, "goals.manage"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  if (typeof body.id !== "string") return NextResponse.json({ error: "Goal id is required." }, { status: 400 });

  const existing = await prisma.goal.findFirst({ where: { id: body.id, userId: session.user.id }, select: { id: true } });
  if (!existing) return NextResponse.json({ error: "Goal not found." }, { status: 404 });

  await prisma.goal.delete({ where: { id: existing.id } });
  await prisma.auditLog.create({
    data: { actorId: session.user.id, action: "GOAL_DELETED", entity: "Goal", entityId: existing.id },
  });

  return NextResponse.json({ ok: true });
}
