import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { z } from "zod";
import { hasPermission } from "@/lib/permissions";

const questionSchema = z.object({
  prompt: z.string().trim().min(3).max(500),
  type: z.enum(["text", "textarea", "select", "multiselect"]).default("text"),
  required: z.boolean().default(true),
  options: z.array(z.string().trim().min(1).max(120)).max(30).optional(),
  position: z.number().int().min(0).max(500).optional(),
  active: z.boolean().default(true),
});

const reviewerRoles: UserRole[] = [
  UserRole.ATTL_MEMBER,
  UserRole.TRACK_LEAD,
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN,
];

export async function GET() {
  const questions = await prisma.applicationQuestion.findMany({
    where: { active: true },
    orderBy: { position: "asc" },
  });

  return NextResponse.json({ questions });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id || !reviewerRoles.includes(session.user.role) || !(await hasPermission(session.user.id, session.user.role, "attl.review"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = questionSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid question." }, { status: 400 });
  }

  const question = await prisma.applicationQuestion.create({
    data: {
      ...parsed.data,
      options: parsed.data.options ?? undefined,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      action: "ATTL_APPLICATION_QUESTION_CREATED",
      entity: "ApplicationQuestion",
      entityId: question.id,
    },
  });

  return NextResponse.json({ question }, { status: 201 });
}
