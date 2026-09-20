import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { hasPermission } from "@/lib/permissions";

const profileSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  bio: z.string().trim().max(2000).optional(),
  gradeLevel: z.string().trim().max(80).optional(),
  className: z.string().trim().max(80).optional(),
  avatarUrl: z.string().url().max(2000).optional().or(z.literal("")),
  interests: z.array(z.string().trim().min(1).max(80)).max(30).optional(),
  portfolioUrl: z.string().url().max(2000).optional().or(z.literal("")),
  links: z.array(
    z.object({
      platform: z.string().trim().min(1).max(40),
      url: z.string().url().max(2000),
      label: z.string().trim().max(80).optional(),
    })
  ).max(12).optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await hasPermission(session.user.id, session.user.role, "profile.read"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { studentProfile: true, teacherProfile: true, profileLinks: true },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      action: "PROFILE_UPDATED",
      entity: "User",
      entityId: session.user.id,
      metadata: { fields: Object.keys(parsed.data) },
    },
  });

  return NextResponse.json({ user });
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await hasPermission(session.user.id, session.user.role, "profile.write"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = profileSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid profile data." }, { status: 400 });

  const { interests, portfolioUrl, links, ...userData } = parsed.data;
  delete userData.gradeLevel;
  delete userData.className;

  const user = await prisma.$transaction(async (tx) => {
    const updated = await tx.user.update({
      where: { id: session.user.id },
      data: {
        ...userData,
        avatarUrl: userData.avatarUrl || null,
        studentProfile:
          session.user.role === "STUDENT"
            ? {
                upsert: {
                  create: {
                    interests: interests ?? [],
                    portfolioUrl: portfolioUrl || null,
                  },
                  update: {
                    ...(interests ? { interests } : {}),
                    ...(portfolioUrl !== undefined ? { portfolioUrl: portfolioUrl || null } : {}),
                  },
                },
              }
            : undefined,
      },
      include: { studentProfile: true, teacherProfile: true, profileLinks: true },
    });

    if (links !== undefined) {
      await tx.profileLink.deleteMany({ where: { userId: session.user.id } });
      if (links.length) {
        await tx.profileLink.createMany({
          data: links.map((link) => ({
            userId: session.user.id,
            platform: link.platform,
            url: link.url,
            label: link.label || null,
          })),
        });
      }
    }

    return tx.user.findUniqueOrThrow({
      where: { id: session.user.id },
      include: { studentProfile: true, teacherProfile: true, profileLinks: true },
    });
  });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      action: "PROFILE_UPDATED",
      entity: "User",
      entityId: session.user.id,
      metadata: { fields: Object.keys(parsed.data), profileLinksUpdated: links !== undefined },
    },
  });

  return NextResponse.json({ user });
}
