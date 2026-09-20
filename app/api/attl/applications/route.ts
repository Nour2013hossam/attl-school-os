import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { hasPermission } from "@/lib/permissions";
import { z } from "zod";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const canReview = await hasPermission(session.user.id, session.user.role, "attl.review");

  const applications = await prisma.attlApplication.findMany({
    where: canReview ? undefined : { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      track: true,
      user: { select: { id: true, name: true, email: true, role: true, attlMembershipActive: true } },
      reviewer: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json({ applications });
}

const answerSchema = z.record(z.string(), z.union([z.string(), z.array(z.string())]));

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const trackId = typeof body.trackId === "string" ? body.trackId : "";
  const parsedAnswers = answerSchema.safeParse(body.answers ?? {});
  const answers = parsedAnswers.success ? parsedAnswers.data : null;

  if (!(await hasPermission(session.user.id, session.user.role, "attl.apply"))) {
    return NextResponse.json({ error: "You do not have permission to apply to ATTL." }, { status: 403 });
  }

  if (!trackId) {
    return NextResponse.json({ error: "Track is required." }, { status: 400 });
  }

  if (!answers) {
    return NextResponse.json({ error: "Application answers are invalid." }, { status: 400 });
  }

  if (session.user.role === UserRole.ATTL_MEMBER || session.user.role === UserRole.TRACK_LEAD) {
    return NextResponse.json({ error: "Your account is already an active ATTL member." }, { status: 400 });
  }

  const [questions, existing] = await Promise.all([
    prisma.applicationQuestion.findMany({ where: { active: true }, orderBy: { position: "asc" } }),
    prisma.attlApplication.findUnique({ where: { userId: session.user.id }, select: { id: true, status: true } }),
  ]);

  for (const question of questions) {
    if (!question.required) continue;
    const answer = answers[question.id];
    const empty = Array.isArray(answer) ? answer.length === 0 : !String(answer ?? "").trim();
    if (empty) {
      return NextResponse.json({ error: "Please answer: " + question.prompt }, { status: 400 });
    }
  }

  if (existing && (existing.status === "INTERVIEW" || existing.status === "ACCEPTED")) {
    return NextResponse.json({ error: "Your application is already in the interview/decision stage." }, { status: 409 });
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

  await prisma.auditLog.create({
    data: { actorId: session.user.id, action: "ATTL_APPLICATION_SUBMITTED", entity: "AttlApplication", entityId: application.id },
  });

  return NextResponse.json({ application }, { status: 201 });
}
