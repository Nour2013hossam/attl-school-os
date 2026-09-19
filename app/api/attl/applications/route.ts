import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const canReview = [UserRole.ATTL_MEMBER, UserRole.TRACK_LEAD, UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(
    session.user.role
  );

  const applications = await prisma.attlApplication.findMany({
    where: canReview ? undefined : { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      track: true,
      user: { select: { id: true, name: true, email: true } },
      reviewer: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json({ applications });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const trackId = typeof body.trackId === "string" ? body.trackId : "";
  const answers = body.answers ?? {};

  if (!trackId) {
    return NextResponse.json({ error: "Track is required." }, { status: 400 });
  }

  const application = await prisma.attlApplication.upsert({
    where: { userId: session.user.id },
    update: {
      trackId,
      answers,
      status: "NEW",
    },
    create: {
      userId: session.user.id,
      trackId,
      answers,
      status: "NEW",
    },
    include: { track: true },
  });

  return NextResponse.json({ application }, { status: 201 });
}
