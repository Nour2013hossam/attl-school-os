import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id } = await context.params;
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await prisma.notification.updateMany({
    where: { id, userId: session.user.id, readAt: null },
    data: { readAt: new Date() },
  });

  if (!result.count) return NextResponse.json({ error: "Notification not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
