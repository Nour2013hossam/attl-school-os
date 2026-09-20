import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { hasPermission } from "@/lib/permissions";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2).max(160),
  tagline: z.string().trim().max(300).nullable(),
  academicYear: z.string().trim().max(40),
  supportEmail: z.string().email().max(160).nullable(),
});

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;
  if (!(await hasPermission(session.user.id, session.user.role, "system.manage"))) return null;
  return session.user;
}

export async function GET() {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const settings = await prisma.appSetting.findMany({
    where: { key: { startsWith: "school." } },
  });

  const values: Record<string, unknown> = {};
  for (const item of settings) values[item.key.slice("school.".length)] = item.value;

  return NextResponse.json({
    school: {
      name: typeof values.name === "string" ? values.name : "Al Thagr School",
      tagline: typeof values.tagline === "string" || values.tagline === null ? values.tagline : "ATTL School OS",
      academicYear: typeof values.academicYear === "string" ? values.academicYear : "2026–2027",
      supportEmail: typeof values.supportEmail === "string" || values.supportEmail === null ? values.supportEmail : null,
    },
  });
}

export async function PATCH(request: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid school settings." }, { status: 400 });

  await prisma.$transaction(
    Object.entries(parsed.data).map(([key, value]) =>
      prisma.appSetting.upsert({
        where: { key: "school." + key },
        update: { value: value === null ? Prisma.JsonNull : value },
        create: { key: "school." + key, value: value === null ? Prisma.JsonNull : value },
      }),
    ),
  );

  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      action: "SCHOOL_SETTINGS_UPDATED",
      entity: "AppSetting",
      entityId: "school",
      metadata: parsed.data,
    },
  });

  return NextResponse.json({ ok: true, school: parsed.data });
}
