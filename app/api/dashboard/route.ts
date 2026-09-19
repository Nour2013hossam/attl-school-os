import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [user, projects, goals, achievements, upcomingAssignments, upcomingEvents, upcomingCompetitions] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, role: true, xp: true, level: true, gradeLevel: true, className: true },
    }),
    prisma.project.count({
      where: {
        OR: [
          { ownerId: session.user.id },
          { members: { some: { userId: session.user.id } } },
        ],
      },
    }),
    prisma.goal.findMany({
      where: { userId: session.user.id, completedAt: null },
      orderBy: { targetDate: "asc" },
      take: 5,
    }),
    prisma.userAchievement.count({ where: { userId: session.user.id } }),
    prisma.assignment.count({
      where: {
        dueAt: { gte: new Date() },
        subject: { enrollments: { some: { userId: session.user.id } } },
      },
    }),
    prisma.event.count({ where: { startsAt: { gte: new Date() } } }),
    prisma.competition.count({ where: { deadlineAt: { gte: new Date() } } }),
  ]);

  return NextResponse.json({
    user,
    stats: {
      projects,
      activeGoals: goals.length,
      achievements,
      upcomingAssignments,
      upcomingEvents,
      upcomingCompetitions,
    },
    goals,
  });
}
