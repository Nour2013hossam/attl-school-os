import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { z } from "zod";

const schema = z.object({
  title: z.string().trim().min(2).max(180).optional(),
  description: z.string().trim().max(5000).nullable().optional(),
  organizer: z.string().trim().max(180).nullable().optional(),
  startsAt: z.coerce.date().nullable().optional(),
  deadlineAt: z.coerce.date().nullable().optional(),
  location: z.string().trim().max(240).nullable().optional(),
  url: z.string().url().nullable().optional(),
});

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await context.params;
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await hasPermission(session.user.id, session.user.role, "competitions.read"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const competition = await prisma.competition.findUnique({
    where: { id },
    include: { applications: { orderBy: { createdAt: "desc" }, include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } } } },
  });
  if (!competition) return NextResponse.json({ error: "Competition not found." }, { status: 404 });
  return NextResponse.json({ competition });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await context.params;
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await hasPermission(session.user.id, session.user.role, "competitions.manage"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid competition data." }, { status: 400 });
  if (parsed.data.deadlineAt && parsed.data.startsAt && parsed.data.deadlineAt > parsed.data.startsAt) return NextResponse.json({ error: "Deadline must be before the competition starts." }, { status: 400 });
  try {
    const competition = await prisma.competition.update({ where: { id }, data: parsed.data });
    await prisma.auditLog.create({ data: { actorId: session.user.id, action: "COMPETITION_UPDATED", entity: "Competition", entityId: id, metadata: { title: competition.title } } });
    return NextResponse.json({ competition });
  } catch {
    return NextResponse.json({ error: "Competition not found." }, { status: 404 });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await context.params;
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await hasPermission(session.user.id, session.user.role, "competitions.manage"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const competition = await prisma.competition.findUnique({ where: { id }, select: { id: true, title: true } });
  if (!competition) return NextResponse.json({ error: "Competition not found." }, { status: 404 });
  await prisma.competition.delete({ where: { id } });
  await prisma.auditLog.create({ data: { actorId: session.user.id, action: "COMPETITION_DELETED", entity: "Competition", entityId: id, metadata: { title: competition.title } } });
  return NextResponse.json({ ok: true });
}