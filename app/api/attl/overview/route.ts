import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";


export async function GET() {
  const session = await auth();

  if (!session?.user?.id || !(await hasPermission(session.user.id, session.user.role, "attl.read"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [tracks, members, applications, projects, events] = await Promise.all([
    prisma.attlTrack.count({ where: { active: true } }),
    prisma.user.count({ where: { isActive: true, attlMembershipActive: true, role: { in: [UserRole.ATTL_MEMBER, UserRole.TRACK_LEAD] } } }),
    prisma.attlApplication.count({
      where: { status: { in: ["NEW", "UNDER_REVIEW", "SHORTLISTED", "INTERVIEW"] } },
    }),
    prisma.project.count({ where: { owner: { role: { in: [UserRole.ATTL_MEMBER, UserRole.TRACK_LEAD] }, attlMembershipActive: true } } }),
    prisma.event.count({
      where: { startsAt: { gte: new Date() } },
    }),
  ]);

  return NextResponse.json({
    stats: { tracks, members, activeApplications: applications, upcomingEvents: events, projects },
  });
}
