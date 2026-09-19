import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole, ApplicationStatus } from "@prisma/client";
import { z } from "zod";

const updateSchema = z.object({
  status: z.nativeEnum(ApplicationStatus).optional(),
  reviewerId: z.string().nullable().optional(),
  reviewerNotes: z.string().max(5000).nullable().optional(),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id } = await context.params;

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (
    ![UserRole.ATTL_MEMBER, UserRole.TRACK_LEAD, UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(
      session.user.role
    )
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = updateSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid application update." }, { status: 400 });
  }

  const application = await prisma.attlApplication.update({
    where: { id },
    data: parsed.data,
    include: {
      track: true,
      user: { select: { id: true, name: true, email: true } },
      reviewer: { select: { id: true, name: true, email: true } },
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      action: "ATTL_APPLICATION_UPDATED",
      entity: "AttlApplication",
      entityId: id,
      metadata: parsed.data,
    },
  });

  return NextResponse.json({ application });
}
