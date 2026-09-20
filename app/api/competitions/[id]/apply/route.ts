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
  if (!(await hasPermission(session.user.id, session.user.role, "competitions.apply"))) {
    return NextResponse.json({ error: "You do not have permission to apply." }, { status: 403 });
  }

  const competition = await prisma.competition.findUnique({
    where: { id },
    select: { id: true, deadlineAt: true },
  });

  if (!competition) {
    return NextResponse.json({ error: "Competition not found" }, { status: 404 });
  }

  if (competition.deadlineAt && competition.deadlineAt < new Date()) {
    return NextResponse.json({ error: "The application deadline has passed." }, { status: 409 });
  }

  const application = await prisma.competitionApplication.upsert({
    where: {
      competitionId_userId: {
        competitionId: id,
        userId: session.user.id,
      },
    },
    update: { status: "SUBMITTED" },
    create: {
      competitionId: id,
      userId: session.user.id,
      status: "SUBMITTED",
    },
  });

  return NextResponse.json({ application }, { status: 201 });
}
