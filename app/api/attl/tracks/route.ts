import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const tracks = await prisma.attlTrack.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ tracks });
}
