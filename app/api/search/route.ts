import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!(await hasPermission(session.user.id, session.user.role, "profile.read"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const limit = rateLimit("search:" + session.user.id, 60, 60 * 1000);
  if (!limit.allowed) return NextResponse.json({ error: "Too many searches. Try again in a minute." }, { status: 429 });

  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";

  if (query.length < 2) {
    return NextResponse.json({ results: { projects: [], courses: [], competitions: [], events: [] } });
  }

  const [projects, courses, competitions, events] = await Promise.all([
    prisma.project.findMany({
      where: {
        OR: [
          { ownerId: session.user.id },
          { members: { some: { userId: session.user.id } } },
          {
            visibility: { in: ["school", "public"] },
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          },
        ],
      },
      take: 10,
      select: { id: true, title: true, slug: true },
    }),
    prisma.course.findMany({
      where: {
        published: true,
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
          { deadlineAt: null },
          { deadlineAt: { gte: new Date() } },
        ],
        AND: [
          {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          },
        ],
      },
      take: 10,
      select: { id: true, title: true, deadlineAt: true },
    }),
    prisma.event.findMany({
      where: {
        endsAt: { gte: new Date() },
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 10,
      select: { id: true, title: true, startsAt: true },
    }),
  ]);

  return NextResponse.json({ results: { projects, courses, competitions, events } });
}
