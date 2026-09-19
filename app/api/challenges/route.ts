import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const challenges = await prisma.challenge.findMany({
    where: { status: { in: ["ACTIVE", "COMPLETED"] } },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { entries: true } },
    },
  });

  return NextResponse.json({ challenges });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (typeof body.title !== "string" || body.title.trim().length < 2) {
    return NextResponse.json({ error: "A challenge title is required." }, { status: 400 });
  }

  const challenge = await prisma.challenge.create({
    data: {
      creatorId: session.user.id,
      title: body.title.trim(),
      description: typeof body.description === "string" ? body.description.trim() : null,
      status: "DRAFT",
      xpReward: typeof body.xpReward === "number" ? Math.max(0, Math.floor(body.xpReward)) : 0,
    },
  });

  return NextResponse.json({ challenge }, { status: 201 });
}
