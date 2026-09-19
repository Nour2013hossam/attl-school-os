import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const courses = await prisma.course.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: {
      subject: { select: { code: true, name: true } },
      _count: { select: { lessons: true, resources: true } },
    },
  });

  return NextResponse.json({ courses });
}
