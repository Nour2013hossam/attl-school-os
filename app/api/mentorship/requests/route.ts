import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole, NotificationType } from "@prisma/client";
import { hasAnyPermission, hasPermission } from "@/lib/permissions";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!(await hasAnyPermission(session.user.id, session.user.role, ["mentorship.request", "mentorship.manage"]))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const requests = await prisma.mentorshipRequest.findMany({
    where: {
      OR: [{ menteeId: session.user.id }, { mentorId: session.user.id }],
    },
    orderBy: { createdAt: "desc" },
    include: {
      mentee: { select: { id: true, name: true, avatarUrl: true } },
      mentor: { select: { id: true, name: true, avatarUrl: true } },
    },
  });

  return NextResponse.json({ requests });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!(await hasPermission(session.user.id, session.user.role, "mentorship.request"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();

  if (typeof body.mentorId !== "string" || body.mentorId === session.user.id) {
    return NextResponse.json({ error: "A valid mentor is required." }, { status: 400 });
  }

  const mentor = await prisma.user.findFirst({
    where: {
      id: body.mentorId,
      isActive: true,
      role: { in: [UserRole.TEACHER, UserRole.ATTL_MEMBER, UserRole.TRACK_LEAD] },
    },
    select: { id: true, name: true },
  });

  if (!mentor) {
    return NextResponse.json({ error: "Mentor not found." }, { status: 404 });
  }

  const existing = await prisma.mentorshipRequest.findFirst({
    where: { menteeId: session.user.id, mentorId: mentor.id, status: "Pending" },
    select: { id: true },
  });

  if (existing) {
    return NextResponse.json({ error: "You already have a pending request with this mentor." }, { status: 409 });
  }

  const requestRow = await prisma.mentorshipRequest.create({
    data: {
      menteeId: session.user.id,
      mentorId: body.mentorId,
      message: typeof body.message === "string" ? body.message.trim() : null,
    },
  });

  await prisma.notification.create({
    data: {
      userId: mentor.id,
      title: "New mentorship request",
      body: "A student has requested mentorship from you.",
      type: NotificationType.MENTORSHIP,
    },
  });

  return NextResponse.json({ request: requestRow }, { status: 201 });
}
