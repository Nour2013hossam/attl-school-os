import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  const body = await request.json();

  if (typeof body.mentorId !== "string" || body.mentorId === session.user.id) {
    return NextResponse.json({ error: "A valid mentor is required." }, { status: 400 });
  }

  const requestRow = await prisma.mentorshipRequest.create({
    data: {
      menteeId: session.user.id,
      mentorId: body.mentorId,
      message: typeof body.message === "string" ? body.message.trim() : null,
    },
  });

  return NextResponse.json({ request: requestRow }, { status: 201 });
}
