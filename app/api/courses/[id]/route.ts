import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const course = await prisma.course.findFirst({
    where: { id, published: true },
    include: {
      subject: { select: { code: true, name: true, description: true } },
      lessons: { orderBy: { position: "asc" } },
      resources: true,
    },
  });
  if (!course) return NextResponse.json({ error: "Course not found." }, { status: 404 });
  return NextResponse.json({ course });
}
