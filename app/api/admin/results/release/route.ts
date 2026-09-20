import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { hasPermission } from "@/lib/permissions";

const releaseSchema = z.object({
  term: z.string().trim().min(1).max(80),
  releaseAt: z.string().datetime(),
  locked: z.boolean().default(true),
});

async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  if (!(await hasPermission(session.user.id, session.user.role, "results.release"))) return null;

  return session.user;
}

export async function GET() {
  const user = await requireAdmin();

  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const releases = await prisma.resultRelease.findMany({
    orderBy: { releaseAt: "desc" },
  });

  return NextResponse.json({ releases });
}

export async function POST(request: Request) {
  const user = await requireAdmin();

  if (!user) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!(await hasPermission(user.id, user.role, "results.release"))) return NextResponse.json({ error: "You do not have permission to manage result releases." }, { status: 403 });

  const parsed = releaseSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid release schedule." }, { status: 400 });
  }

  const release = await prisma.resultRelease.upsert({
    where: { term: parsed.data.term },
    update: {
      releaseAt: new Date(parsed.data.releaseAt),
      locked: parsed.data.locked,
    },
    create: {
      term: parsed.data.term,
      releaseAt: new Date(parsed.data.releaseAt),
      locked: parsed.data.locked,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      action: "RESULT_RELEASE_UPDATED",
      entity: "ResultRelease",
      entityId: release.id,
      metadata: {
        term: release.term,
        releaseAt: release.releaseAt,
        locked: release.locked,
      },
    },
  });

  return NextResponse.json({ release });
}
