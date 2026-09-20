import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SubmissionStatus } from "@prisma/client";
import { z } from "zod";

const schema = z.object({
  status: z.enum(["IN_PROGRESS", "SUBMITTED"]),
});

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id } = await context.params;

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission status." }, { status: 400 });
  }

  const assignment = await prisma.assignment.findUnique({
    where: { id },
    select: { id: true, dueAt: true, subjectId: true, title: true },
  });

  if (!assignment) {
    return NextResponse.json({ error: "Assignment not found." }, { status: 404 });
  }

  const enrolled = await prisma.enrollment.findFirst({
    where: {
      userId: session.user.id,
      subjectId: assignment.subjectId,
    },
    select: { id: true },
  });

  if (!enrolled) {
    return NextResponse.json({ error: "You are not enrolled in this subject." }, { status: 403 });
  }

  const submittedAt =
    parsed.data.status === "SUBMITTED" ? new Date() : null;
  const late =
    parsed.data.status === "SUBMITTED" && submittedAt! > assignment.dueAt;

  const status = late ? SubmissionStatus.LATE : (parsed.data.status as SubmissionStatus);

  const submission = await prisma.assignmentSubmission.upsert({
    where: {
      assignmentId_userId: {
        assignmentId: id,
        userId: session.user.id,
      },
    },
    update: {
      status,
      submittedAt,
    },
    create: {
      assignmentId: id,
      userId: session.user.id,
      status,
      submittedAt,
    },
  });

  return NextResponse.json({ submission });
}
