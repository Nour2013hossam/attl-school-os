import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

const allowedRoles: UserRole[] = [
  UserRole.ATTL_MEMBER,
  UserRole.TRACK_LEAD,
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN,
];

export async function GET() {
  const session = await auth();

  if (!session?.user?.id || !allowedRoles.includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [tracks, members, applications, projects, events] = await Promise.all([
    prisma.attlTrack.count({ where: { active: true } }),
    prisma.attlApplication.count({ where: { status: "ACCEPTED" } }),
    prisma.attlApplication.count({
      where: { status: { in: ["NEW", "UNDER_REVIEW", "SHORTLISTED", "INTERVIEW"] } },
    }),
    prisma.project.count({ where: { owner: { role: UserRole.ATTL_MEMBER } } }),
    prisma.event.count({
      where: { startsAt: { gte: new Date() } },
    }),
  ]);

  return NextResponse.json({
    stats: { tracks, members, activeApplications: applications, upcomingEvents: events, projects },
  });
}
