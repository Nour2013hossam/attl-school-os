import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await context.params;
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const challenge = await prisma.challenge.findUnique({ where: { id }, select: { id: true, status: true, title: true } });
  if (!challenge || challenge.status !== "ACTIVE") return NextResponse.json({ error: "Active challenge not found." }, { status: 404 });

  const entry = await prisma.challengeParticipation.upsert({
    where: { challengeId_userId: { challengeId: id, userId: session.user.id } },
    update: {},
    create: { challengeId: id, userId: session.user.id },
  });

  return NextResponse.json({ participation: entry }, { status: 201 });
}
