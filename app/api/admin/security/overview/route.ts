import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await hasPermission(session.user.id, session.user.role, "security.manage"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [activeUsers, disabledUsers, permissionOverrides, customRoles, recentAudit, fileCount] =
    await Promise.all([
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { isActive: false } }),
      prisma.userPermission.count(),
      prisma.customRole.count({ where: { active: true } }),
      prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { actor: { select: { id: true, name: true, email: true, role: true } } },
      }),
      prisma.fileAsset.count(),
    ]);

  return NextResponse.json({
    summary: {
      activeUsers,
      disabledUsers,
      permissionOverrides,
      customRoles,
      fileCount,
    },
    recentAudit,
    controls: {
      auth: "Auth.js credentials",
      passwordHashing: "bcrypt",
      authorization: "Server-side permission checks",
      rateLimiting: "Login, registration and password changes",
      headers: "Security headers enabled",
    },
  });
}
