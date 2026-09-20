import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

const roleLabel: Record<string, string> = {
  STUDENT: "Student",
  ATTL_MEMBER: "ATTL Member",
  TRACK_LEAD: "Track Lead",
  TEACHER: "Teacher",
  ADMIN: "Admin",
  SUPER_ADMIN: "Super Admin",
};

const roleScope: Record<string, string> = {
  STUDENT: "Learning & school life",
  ATTL_MEMBER: "ATTL & projects",
  TRACK_LEAD: "ATTL leadership",
  TEACHER: "Teaching & academics",
  ADMIN: "School administration",
  SUPER_ADMIN: "Full school control",
};

export async function GET(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limit = rateLimit("public-members:" + ip, 30, 60 * 1000);
  if (!limit.allowed) return NextResponse.json({ error: "Too many requests." }, { status: 429 });

  const members = await prisma.user.findMany({
    where: {
      isActive: true,
      OR: [
        { preferences: { is: null } },
        { preferences: { is: { profileVisible: true } } },
      ],
    },
    orderBy: [{ role: "asc" }, { name: "asc" }],
    take: 200,
    select: {
      id: true,
      name: true,
      role: true,
      avatarUrl: true,
      bio: true,
      xp: true,
      level: true,
      studentProfile: { select: { portfolioUrl: true } },
      teacherProfile: { select: { department: true, title: true, bio: true } },
      profileLinks: { select: { id: true, platform: true, url: true, label: true }, orderBy: { createdAt: "asc" } },
    },
  });

  return NextResponse.json({
    members: members.map((member) => ({
      id: member.id,
      name: member.name,
      role: roleLabel[member.role] ?? member.role,
      scope: roleScope[member.role] ?? "School community",
      avatarUrl: member.avatarUrl,
      bio: member.bio || member.teacherProfile?.bio || null,
      xp: member.xp,
      level: member.level,
      portfolioUrl: member.studentProfile?.portfolioUrl ?? null,
      links: member.profileLinks,
    })),
  });
}
