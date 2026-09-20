import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { applyXp, normalizeXp } from "@/lib/xp";
import { z } from "zod";

const schema = z.object({
  mode: z.enum(["delta", "set"]),
  amount: z.number().int().min(-1000000).max(1000000),
  reason: z.string().trim().max(300).optional(),
});

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await context.params;
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await hasPermission(session.user.id, session.user.role, "xp.manage"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid XP adjustment." }, { status: 400 });

  const target = await prisma.user.findUnique({ where: { id }, select: { id: true, name: true, email: true, xp: true, level: true } });
  if (!target) return NextResponse.json({ error: "User not found." }, { status: 404 });

  const next = parsed.data.mode === "set"
    ? { xp: normalizeXp(parsed.data.amount), level: Math.max(1, Math.floor(normalizeXp(parsed.data.amount) / 500) + 1) }
    : applyXp(target.xp, parsed.data.amount);

  const updated = await prisma.user.update({
    where: { id },
    data: next,
    select: { id: true, name: true, email: true, xp: true, level: true },
  });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      action: parsed.data.mode === "set" ? "XP_SET" : "XP_ADJUSTED",
      entity: "User",
      entityId: id,
      metadata: { beforeXp: target.xp, afterXp: updated.xp, beforeLevel: target.level, afterLevel: updated.level, delta: updated.xp - target.xp, reason: parsed.data.reason ?? null },
    },
  });

  return NextResponse.json({ user: updated, adjustment: { beforeXp: target.xp, afterXp: updated.xp, delta: updated.xp - target.xp } });
}
