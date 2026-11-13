import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const settingsSchema = z.object({
  language: z.enum(["en","ar"]),
  theme: z.enum(["light", "dark"]),
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  profileVisible: z.boolean(),
});

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const preferences = await prisma.userPreference.upsert({
    where: { userId: session.user.id },
    update: {},
    create: { userId: session.user.id },
  });
  const normalizedPreferences = preferences.theme === "system"
    ? await prisma.userPreference.update({ where: { userId: session.user.id }, data: { theme: "light" } })
    : preferences;

  return NextResponse.json({ preferences: normalizedPreferences });
}

export async function PATCH(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = settingsSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid settings." }, { status: 400 });
  }

  const preferences = await prisma.userPreference.upsert({
    where: { userId: session.user.id },
    update: parsed.data,
    create: { userId: session.user.id, ...parsed.data },
  });

  return NextResponse.json({ preferences });
}
