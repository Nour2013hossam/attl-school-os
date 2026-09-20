import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { z } from "zod";

const schema = z.object({
  userId: z.string().min(1),
  xp: z.number().int().min(0).max(1_000_000_000),
});

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await hasPermission(session.user.id, session.user.role, "xp.manage"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid XP update." }, { status: 400 });

  const target = await prisma.user.findUnique({
    where: { id: parsed.data.userId },
    select: { id: true, name: true, xp: true, level: true },
  });
  if (!target) return NextResponse.json({ error: "User not found." }, { status: 404 });

  const level = Math.floor(parsed.data.xp / 100) + 1;
  const updated = await prisma.user.update({
    where: { id: target.id },
    data: { xp: parsed.data.xp, level },
    select: { id: true, name: true, email: true, xp: true, level: true },
  });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      action: "USER_XP_UPDATED",
      entity: "User",
      entityId: target.id,
      metadata: { previousXp: target.xp, xp: updated.xp, previousLevel: target.level, level: updated.level },
    },
  });

  return NextResponse.json({ user: updated });
}
