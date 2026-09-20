import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await hasPermission(session.user.id, session.user.role, "profile.read"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [logs, projects, certificates, achievements, goals] = await Promise.all([
    prisma.auditLog.findMany({ where: { actorId: session.user.id }, orderBy: { createdAt: "desc" }, take: 50, select: { id: true, action: true, entity: true, entityId: true, createdAt: true, metadata: true } }),
    prisma.project.findMany({ where: { ownerId: session.user.id }, orderBy: { createdAt: "desc" }, take: 20, select: { id: true, title: true, status: true, progress: true, createdAt: true, updatedAt: true } }),
    prisma.certificate.findMany({ where: { userId: session.user.id }, orderBy: { issuedAt: "desc" }, take: 20, select: { id: true, code: true, issuedAt: true, course: { select: { title: true } } } }),
    prisma.userAchievement.findMany({ where: { userId: session.user.id }, orderBy: { awardedAt: "desc" }, take: 20, select: { id: true, awardedAt: true, achievement: { select: { title: true, xpReward: true } } } }),
    prisma.goal.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" }, take: 20, select: { id: true, title: true, progress: true, completedAt: true, createdAt: true, updatedAt: true } }),
  ]);

  const events = [
    ...logs.map((item) => ({ id: "log:"+item.id, type: "activity", title: item.action.replaceAll("_", " "), description: item.entity, at: item.createdAt, metadata: item.metadata })),
    ...projects.map((item) => ({ id: "project:"+item.id, type: "project", title: "Project: " + item.title, description: item.status + " · " + item.progress + "%", at: item.updatedAt, metadata: null })),
    ...certificates.map((item) => ({ id: "certificate:"+item.id, type: "certificate", title: "Certificate: " + item.course.title, description: item.code, at: item.issuedAt, metadata: null })),
    ...achievements.map((item) => ({ id: "achievement:"+item.id, type: "achievement", title: "Achievement: " + item.achievement.title, description: "+" + item.achievement.xpReward + " XP", at: item.awardedAt, metadata: null })),
    ...goals.map((item) => ({ id: "goal:"+item.id, type: "goal", title: "Goal: " + item.title, description: item.completedAt ? "Completed" : item.progress + "% progress", at: item.updatedAt, metadata: null })),
  ].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()).slice(0, 100);

  return NextResponse.json({ events });
}
