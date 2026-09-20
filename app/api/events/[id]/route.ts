import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { z } from "zod";

const schema = z.object({
  title: z.string().trim().min(2).max(180).optional(),
  description: z.string().trim().max(5000).nullable().optional(),
  startsAt: z.coerce.date().optional(),
  endsAt: z.coerce.date().optional(),
  location: z.string().trim().max(240).nullable().optional(),
  capacity: z.number().int().positive().max(100000).nullable().optional(),
});

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await context.params;
  if (!session?.user?.id || !(await hasPermission(session.user.id, session.user.role, "events.read"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const event = await prisma.event.findUnique({
    where: { id },
    include: { _count: { select: { registrations: true } } },
  });
  if (!event) return NextResponse.json({ error: "Event not found." }, { status: 404 });
  return NextResponse.json({ event });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await context.params;
  if (!session?.user?.id || !(await hasPermission(session.user.id, session.user.role, "events.manage"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid event update." }, { status: 400 });

  const current = await prisma.event.findUnique({ where: { id }, select: { startsAt: true, endsAt: true, capacity: true, title: true } });
  if (!current) return NextResponse.json({ error: "Event not found." }, { status: 404 });

  const startsAt = parsed.data.startsAt ?? current.startsAt;
  const endsAt = parsed.data.endsAt ?? current.endsAt;
  if (endsAt <= startsAt) return NextResponse.json({ error: "Event must end after it starts." }, { status: 400 });

  const updated = await prisma.event.update({ where: { id }, data: parsed.data });

  await prisma.auditLog.create({
    data: { actorId: session.user.id, action: "EVENT_UPDATED", entity: "Event", entityId: id, metadata: { title: updated.title } },
  });

  return NextResponse.json({ event: updated });
}
