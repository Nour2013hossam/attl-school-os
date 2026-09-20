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
  if (!session?.user?.id || !(await hasPermission(session.user.id, session.user.role, "competitions.read"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const competition = await prisma.competition.findUnique({ where: { id } });
  if (!competition) return NextResponse.json({ error: "Competition not found." }, { status: 404 });
  return NextResponse.json({ competition });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await context.params;
  if (!session?.user?.id || !(await hasPermission(session.user.id, session.user.role, "competitions.manage"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid competition update." }, { status: 400 });

  const current = await prisma.competition.findUnique({ where: { id }, select: { startsAt: true, deadlineAt: true } });
  if (!current) return NextResponse.json({ error: "Competition not found." }, { status: 404 });

  const startsAt = parsed.data.startsAt === undefined ? current.startsAt : parsed.data.startsAt;
  const deadlineAt = parsed.data.deadlineAt === undefined ? current.deadlineAt : parsed.data.deadlineAt;
  if (deadlineAt && startsAt && deadlineAt > startsAt) {
    return NextResponse.json({ error: "Deadline must be before the competition starts." }, { status: 400 });
  }

  const competition = await prisma.competition.update({ where: { id }, data: parsed.data });
  await prisma.auditLog.create({
    data: { actorId: session.user.id, action: "COMPETITION_UPDATED", entity: "Competition", entityId: id, metadata: { title: competition.title } },
  });

  return NextResponse.json({ competition });
}
