import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const courses = await prisma.course.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: {
      subject: { select: { code: true, name: true } },
      lessons: { orderBy: { position: "asc" }, select: { id: true, title: true, duration: true, position: true } },
      resources: { select: { id: true, title: true, type: true, url: true } },
      _count: { select: { lessons: true, resources: true } },
    },
  });

  const session = await auth();
  const recent = session?.user?.id
    ? await prisma.user.findUnique({ where: { id: session.user.id }, select: { id: true } })
    : null;

  return NextResponse.json({ courses, authenticated: Boolean(recent) });
}
