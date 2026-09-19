import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await prisma.scheduleItem.findMany({
    where: { active: true },
    orderBy: [{ dayOfWeek: "asc" }, { startMinute: "asc" }],
    include: {
      subject: {
        select: { id: true, code: true, name: true, type: true },
      },
      teacher: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return NextResponse.json({ items });
}
