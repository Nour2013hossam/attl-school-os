import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function membership(userId: string, threadId: string) {
  return prisma.threadParticipant.findUnique({
    where: { threadId_userId: { threadId, userId } },
    select: { id: true },
  });
}

export async function GET(
  request: Request,
  context: { params: Promise<{ threadId: string }> }
) {
  const session = await auth();
  const { threadId } = await context.params;

  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await membership(session.user.id, threadId))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const thread = await prisma.messageThread.findUnique({
    where: { id: threadId },
    include: {
      participants: { include: { user: { select: { id: true, name: true, avatarUrl: true } } } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!thread) return NextResponse.json({ error: "Thread not found" }, { status: 404 });

  return NextResponse.json({ thread });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ threadId: string }> }
) {
  const session = await auth();
  const { threadId } = await context.params;

  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await membership(session.user.id, threadId))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  if (typeof body.body !== "string" || !body.body.trim()) {
    return NextResponse.json({ error: "Message cannot be empty." }, { status: 400 });
  }

  const message = await prisma.message.create({
    data: { threadId, senderId: session.user.id, body: body.body.trim().slice(0, 5000) },
  });

  await prisma.messageThread.update({
    where: { id: threadId },
    data: { updatedAt: new Date() },
  });

  return NextResponse.json({ message }, { status: 201 });
}
