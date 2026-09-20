import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { goalSchema } from "@/lib/validation";
import { hasPermission } from "@/lib/permissions";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!(await hasPermission(session.user.id, session.user.role, "profile.read"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const goals = await prisma.goal.findMany({
    where: { userId: session.user.id },
    orderBy: [{ completedAt: "asc" }, { targetDate: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ goals });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!(await hasPermission(session.user.id, session.user.role, "goals.manage"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = goalSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid goal data." }, { status: 400 });
  }

  const goal = await prisma.goal.create({
    data: {
      userId: session.user.id,
      title: parsed.data.title,
      description: parsed.data.description,
      targetDate: parsed.data.targetDate ? new Date(parsed.data.targetDate) : undefined,
    },
  });

  return NextResponse.json({ goal }, { status: 201 });
}
