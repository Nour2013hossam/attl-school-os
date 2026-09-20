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

  if (![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!(await hasPermission(session.user.id, session.user.role, "users.manage"))) return NextResponse.json({ error: "You do not have permission to manage users." }, { status: 403 });

  const rawBody = await request.json();

  if (id === session.user.id && rawBody.role === UserRole.STUDENT) {
    return NextResponse.json({ error: "You cannot remove your own admin role." }, { status: 400 });
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

  const updated = await prisma.user.update({
    where: { id },
    data: parsed.data,
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
