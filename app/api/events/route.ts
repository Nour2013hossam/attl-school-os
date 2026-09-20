import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const events = await prisma.event.findMany({
    where: { endsAt: { gte: new Date() } },
    orderBy: { startsAt: "asc" },
    take: 100,
    include: { _count: { select: { registrations: true } } },
  });

  return NextResponse.json({ events });
}
