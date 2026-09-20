import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await hasPermission(session.user.id, session.user.role, "profile.read"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [notifications, projects, enrollments, achievements] = await Promise.all([
    prisma.notification.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" }, take: 30, select: { id: true, title: true, body: true, type: true, readAt: true, createdAt: true } }),
    prisma.project.findMany({ where: { OR: [{ ownerId: session.user.id }, { members: { some: { userId: session.user.id } } }] }, orderBy: { updatedAt: "desc" }, take: 20, select: { id: true, title: true, status: true, progress: true, updatedAt: true } }),
    prisma.courseEnrollment.findMany({ where: { userId: session.user.id }, orderBy: { updatedAt: "desc" }, take: 20, select: { id: true, progress: true, status: true, updatedAt: true, course: { select: { title: true } } } }),
    prisma.userAchievement.findMany({ where: { userId: session.user.id }, orderBy: { awardedAt: "desc" }, take: 20, select: { id: true, awardedAt: true, achievement: { select: { title: true, xpReward: true } } } }),
  ]);

  const activity = [
    ...notifications.map((n) => ({ id: "notification:"+n.id, type: "notification", title: n.title, description: n.body, status: n.readAt ? "Read" : "New", at: n.createdAt })),
    ...projects.map((p) => ({ id: "project:"+p.id, type: "project", title: "Project · " + p.title, description: p.status + " · " + p.progress + "%", status: "Updated", at: p.updatedAt })),
    ...enrollments.map((e) => ({ id: "course:"+e.id, type: "learning", title: "Course · " + e.course.title, description: e.progress + "% complete", status: e.status, at: e.updatedAt })),
    ...achievements.map((a) => ({ id: "achievement:"+a.id, type: "achievement", title: "Achievement · " + a.achievement.title, description: "+" + a.achievement.xpReward + " XP", status: "Earned", at: a.awardedAt })),
  ].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()).slice(0, 100);

  return NextResponse.json({ activity });
}
