import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  bio: z.string().trim().max(2000).optional(),
  gradeLevel: z.string().trim().max(80).optional(),
  className: z.string().trim().max(80).optional(),
  avatarUrl: z.string().url().max(2000).optional().or(z.literal("")),
  interests: z.array(z.string().trim().min(1).max(80)).max(30).optional(),
  portfolioUrl: z.string().url().max(2000).optional().or(z.literal("")),
});

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { studentProfile: true, teacherProfile: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user });
}

export async function PATCH(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = profileSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid profile data." }, { status: 400 });
  }

  const { interests, portfolioUrl, ...userData } = parsed.data;

  const user = await prisma.user.update({
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
                  ...(portfolioUrl !== undefined
                    ? { portfolioUrl: portfolioUrl || null }
                    : {}),
                },
              },
            }
          : undefined,
    },
    include: { studentProfile: true },
  });

  return NextResponse.json({ user });
}
