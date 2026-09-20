import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole, ApplicationStatus, NotificationType } from "@prisma/client";
import { z } from "zod";

const updateSchema = z.object({
  status: z.nativeEnum(ApplicationStatus).optional(),
  reviewerId: z.string().nullable().optional(),
  reviewerNotes: z.string().max(5000).nullable().optional(),
});

const reviewerRoles = [
  UserRole.ATTL_MEMBER,
  UserRole.TRACK_LEAD,
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN,
];

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id } = await context.params;

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!reviewerRoles.includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = updateSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid application update." }, { status: 400 });
  }

  const existing = await prisma.attlApplication.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
      status: true,
      track: { select: { name: true } },
      user: { select: { id: true, name: true, email: true, role: true } },
    },
  });

  if (!existing) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }

  const application = await prisma.$transaction(async (tx) => {
    const updated = await tx.attlApplication.update({
      where: { id },
      data: parsed.data,
      include: {
        track: true,
        user: { select: { id: true, name: true, email: true, role: true } },
        reviewer: { select: { id: true, name: true, email: true } },
      },
    });

    if (parsed.data.status === ApplicationStatus.ACCEPTED) {
      await tx.user.update({
        where: { id: existing.userId },
        data: { role: UserRole.ATTL_MEMBER },
      });

      if (existing.status !== ApplicationStatus.ACCEPTED) {
        await tx.notification.create({
          data: {
            userId: existing.userId,
            title: "ATTL application accepted",
            body: `Your application for the ${existing.track.name} track was approved. Your account is now an ATTL Member.`,
            type: NotificationType.ATTL,
          },
        });
      }
    } else if (
      parsed.data.status &&
      parsed.data.status !== existing.status &&
      parsed.data.status !== ApplicationStatus.ACCEPTED
    ) {
      await tx.notification.create({
        data: {
          userId: existing.userId,
          title: "ATTL application updated",
          body: `Your ATTL application status is now ${parsed.data.status.replaceAll("_", " ")}.`,
          type: NotificationType.ATTL,
        },
      });
    }

    await tx.auditLog.create({
      data: {
        actorId: session.user.id,
        action:
          parsed.data.status === ApplicationStatus.ACCEPTED
            ? "ATTL_APPLICATION_APPROVED"
            : "ATTL_APPLICATION_UPDATED",
        entity: "AttlApplication",
        entityId: id,
        metadata: {
          ...parsed.data,
          previousStatus: existing.status,
          applicantUserId: existing.userId,
          promotedTo: parsed.data.status === ApplicationStatus.ACCEPTED ? UserRole.ATTL_MEMBER : null,
        },
      },
    });

    return updated;
  });

  return NextResponse.json({
    application,
    accepted: parsed.data.status === ApplicationStatus.ACCEPTED,
  });
}
