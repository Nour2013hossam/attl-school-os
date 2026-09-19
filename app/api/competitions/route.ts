import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const competitions = await prisma.competition.findMany({
    orderBy: { deadlineAt: "asc" },
    take: 100,
  });

  return NextResponse.json({ competitions });
}
