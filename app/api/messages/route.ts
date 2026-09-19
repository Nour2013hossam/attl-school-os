import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const threads = await prisma.messageThread.findMany({
    where: { participants: { some: { userId: session.user.id } } },
    orderBy: { updatedAt: "desc" },
    include: {
      participants: { include: { user: { select: { id: true, name: true, avatarUrl: true } } } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  return NextResponse.json({ threads });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  if (typeof body.userId !== "string" || typeof body.message !== "string" || !body.message.trim()) {
    return NextResponse.json({ error: "Recipient and message are required." }, { status: 400 });
  }

  const thread = await prisma.messageThread.create({
    data: {
      title: typeof body.title === "string" ? body.title.trim().slice(0, 160) : null,
      participants: {
        create: [{ userId: session.user.id }, { userId: body.userId }],
      },
      messages: {
        create: { senderId: session.user.id, body: body.message.trim().slice(0, 5000) },
      },
    },
    include: {
      participants: { include: { user: { select: { id: true, name: true, avatarUrl: true } } } },
      messages: true,
    },
  });

  return NextResponse.json({ thread }, { status: 201 });
}
