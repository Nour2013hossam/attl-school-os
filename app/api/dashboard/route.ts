import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [user, projects, goals, achievements, upcomingAssignments, upcomingEvents, upcomingCompetitions, recentProjects, nextEvents, nextCompetitions, attlMembers, featuredCourses, activeChallenges, attlTracks, attlApplication] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, role: true, xp: true, level: true, gradeLevel: true, className: true, avatarUrl: true, attlMembershipActive: true, attlActivatedAt: true },
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
    prisma.project.findMany({
      where: { visibility: { in: ["school", "public"] } },
      orderBy: { updatedAt: "desc" },
      take: 6,
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        progress: true,
        visibility: true,
        owner: { select: { name: true, avatarUrl: true } },
        _count: { select: { members: true, tasks: true } },
      },
    }),
    prisma.event.findMany({
      where: { startsAt: { gte: new Date() } },
      orderBy: { startsAt: "asc" },
      take: 6,
      select: { id: true, title: true, description: true, startsAt: true, endsAt: true, location: true, capacity: true, _count: { select: { registrations: true } } },
    }),
    prisma.competition.findMany({
      where: { OR: [{ deadlineAt: { gte: new Date() } }, { deadlineAt: null }] },
      orderBy: [{ deadlineAt: "asc" }, { startsAt: "asc" }],
      take: 6,
      select: { id: true, title: true, description: true, organizer: true, startsAt: true, deadlineAt: true, location: true },
    }),
    prisma.user.findMany({
      where: { isActive: true, attlMembershipActive: true, role: { in: ["ATTL_MEMBER", "TRACK_LEAD"] } },
      orderBy: { name: "asc" },
      take: 8,
      select: { id: true, name: true, role: true, avatarUrl: true, gradeLevel: true },
    }),
    prisma.course.findMany({
      where: { published: true },
      orderBy: { updatedAt: "desc" },
      take: 4,
      select: {
        id: true,
        title: true,
        description: true,
        level: true,
        _count: { select: { lessons: true, resources: true, enrollments: true } },
      },
    }),
    prisma.challenge.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      take: 4,
      select: {
        id: true,
        title: true,
        description: true,
        xpReward: true,
        endsAt: true,
        _count: { select: { entries: true } },
      },
    }),
    prisma.attlTrack.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
      take: 6,
      select: { id: true, name: true, description: true },
    }),
    prisma.attlApplication.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        status: true,
        interviewAt: true,
        interviewResult: true,
        reviewerNotes: true,
        track: { select: { name: true } },
      },
    }),
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
    recentProjects,
    nextEvents,
    nextCompetitions,
    attlMembers,
    featuredCourses,
    activeChallenges,
    attlTracks,
    attlApplication,
  });
}
