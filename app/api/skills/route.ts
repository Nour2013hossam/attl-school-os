import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!(await hasPermission(session.user.id, session.user.role, "skills.read"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const skills = await prisma.userSkill.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      skill: {
        select: { id: true, name: true, category: true, description: true },
      },
    },
  });

  return NextResponse.json({ skills });
}
