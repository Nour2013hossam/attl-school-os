import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { z } from "zod";
import { hasPermission } from "@/lib/permissions";

const updateSchema = z.object({
  role: z.nativeEnum(UserRole).optional(),
  isActive: z.boolean().optional(),
  gradeLevel: z.string().max(80).nullable().optional(),
  className: z.string().max(80).nullable().optional(),
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

  const rawBody = await request.json();
  const roleRequested = rawBody.role !== undefined;
  const userManagementRequested =
    rawBody.isActive !== undefined ||
    rawBody.gradeLevel !== undefined ||
    rawBody.className !== undefined;

  if (roleRequested && !(await hasPermission(session.user.id, session.user.role, "roles.assign"))) {
    return NextResponse.json({ error: "You do not have permission to assign roles." }, { status: 403 });
  }

  if (userManagementRequested && !(await hasPermission(session.user.id, session.user.role, "users.manage"))) {
    return NextResponse.json({ error: "You do not have permission to manage users." }, { status: 403 });
  }

  if (!roleRequested && !userManagementRequested) {
    return NextResponse.json({ error: "No manageable fields were provided." }, { status: 400 });
  }

  if (id === session.user.id && rawBody.role && rawBody.role !== UserRole.SUPER_ADMIN) {
    return NextResponse.json({ error: "The primary Super Admin account cannot lower its own role." }, { status: 400 });
  }
  if (id === session.user.id && rawBody.isActive === false) {
    return NextResponse.json({ error: "The primary Super Admin account cannot disable itself." }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(rawBody);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid user update." }, { status: 400 });
  }

  if (
    session.user.role !== UserRole.SUPER_ADMIN &&
    parsed.data.role === UserRole.SUPER_ADMIN
  ) {
    return NextResponse.json({ error: "Only a Super Admin can assign Super Admin." }, { status: 403 });
  }

  const membershipPatch =
    parsed.data.role === UserRole.ATTL_MEMBER || parsed.data.role === UserRole.TRACK_LEAD
      ? { attlMembershipActive: true, attlActivatedAt: new Date() }
      : parsed.data.role
        ? { attlMembershipActive: false }
        : {};

  const updated = await prisma.user.update({
    where: { id },
    data: { ...parsed.data, ...membershipPatch },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      gradeLevel: true,
      className: true,
      xp: true,
      level: true,
      attlMembershipActive: true,
      attlActivatedAt: true,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      action: "USER_UPDATED",
      entity: "User",
      entityId: id,
      metadata: parsed.data,
    },
  });

  return NextResponse.json({ user: updated });
}
