import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== UserRole.TEACHER) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const items = await prisma.scheduleItem.findMany({
    where: { teacherId: session.user.id, active: true },
    orderBy: [{ dayOfWeek: "asc" }, { startMinute: "asc" }],
    include: { subject: { select: { id: true, code: true, name: true, type: true } } },
  });

  return NextResponse.json({ classes: items });
}
