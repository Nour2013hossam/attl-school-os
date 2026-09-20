import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id } = await context.params;

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!(await hasPermission(session.user.id, session.user.role, "events.register"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  if (!(await hasPermission(session.user.id, session.user.role, "events.register"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const event = await prisma.event.findUnique({
    where: { id },
    select: {
      id: true,
      capacity: true,
      _count: { select: { registrations: true } },
    },
  });

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  if (event.capacity !== null && event._count.registrations >= event.capacity) {
    return NextResponse.json({ error: "This event is full." }, { status: 409 });
  }

  const registration = await prisma.eventRegistration.upsert({
    where: {
      eventId_userId: {
        eventId: id,
        userId: session.user.id,
      },
    },
    update: {},
    create: {
      eventId: id,
      userId: session.user.id,
    },
  });

  return NextResponse.json({ registration }, { status: 201 });
}
