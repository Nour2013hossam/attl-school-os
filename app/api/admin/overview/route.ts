import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id || ![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const now = new Date();

  const [
    students,
    teachers,
    attlMembers,
    pendingReviews,
    activeProjects,
    upcomingEvents,
    upcomingCompetitions,
    activeUsers,
  ] = await Promise.all([
    prisma.user.count({ where: { role: UserRole.STUDENT } }),
    prisma.user.count({ where: { role: UserRole.TEACHER } }),
    prisma.user.count({ where: { role: { in: [UserRole.ATTL_MEMBER, UserRole.TRACK_LEAD] } } }),
    prisma.attlApplication.count({
      where: { status: { in: ["NEW", "UNDER_REVIEW", "SHORTLISTED", "INTERVIEW"] } },
    }),
    prisma.project.count({
      where: { status: { in: ["PLANNING", "ACTIVE"] } },
    }),
    prisma.event.count({
      where: { startsAt: { gte: now } },
    }),
    prisma.competition.count({
      where: { deadlineAt: { gte: now } },
    }),
    prisma.user.count({ where: { isActive: true } }),
  ]);

  return NextResponse.json({
    stats: {
      students,
      teachers,
      attlMembers,
      pendingReviews,
      activeProjects,
      upcomingEvents,
      upcomingCompetitions,
      activeUsers,
    },
  });
}
