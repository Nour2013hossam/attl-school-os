import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { hasPermission } from "@/lib/permissions";
import { z } from "zod";

const schema = z.object({
  prompt: z.string().trim().min(3).max(500).optional(),
  type: z.enum(["text", "textarea", "select", "multiselect"]).optional(),
  required: z.boolean().optional(),
  options: z.array(z.string().trim().min(1).max(120)).max(30).nullable().optional(),
  position: z.number().int().min(0).max(500).optional(),
  active: z.boolean().optional(),
});

async function allowed() {
  const session = await auth();
  if (!session?.user?.id) return null;
  if (!(await hasPermission(session.user.id, session.user.role, "attl.review"))) return null;
  return session.user;
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = await allowed();
  const { id } = await context.params;

  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid question update." }, { status: 400 });
  }

  const data = {
    ...parsed.data,
    options:
      parsed.data.options === null
        ? Prisma.JsonNull
        : parsed.data.options,
  };

  const question = await prisma.applicationQuestion.update({
    where: { id },
    data,
  });

  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      action: "ATTL_APPLICATION_QUESTION_UPDATED",
      entity: "ApplicationQuestion",
      entityId: id,
      metadata: parsed.data,
    },
  });

  return NextResponse.json({ question });
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = await allowed();
  const { id } = await context.params;

  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.applicationQuestion.update({
    where: { id },
    data: { active: false },
  });

  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      action: "ATTL_APPLICATION_QUESTION_ARCHIVED",
      entity: "ApplicationQuestion",
      entityId: id,
    },
  });

  return NextResponse.json({ ok: true });
}
