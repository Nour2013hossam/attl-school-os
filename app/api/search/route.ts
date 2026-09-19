import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";

  if (query.length < 2) {
    return NextResponse.json({
      results: {
        projects: [],
        courses: [],
        competitions: [],
        events: [],
      },
    });
  }

  const [projects, courses, competitions, events] = await Promise.all([
    prisma.project.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 10,
      select: { id: true, title: true, slug: true },
    }),
    prisma.course.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 10,
      select: { id: true, title: true, level: true },
    }),
    prisma.competition.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 10,
      select: { id: true, title: true, deadlineAt: true },
    }),
    prisma.event.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 10,
      select: { id: true, title: true, startsAt: true },
    }),
  ]);

  return NextResponse.json({
    results: { projects, courses, competitions, events },
  });
}
