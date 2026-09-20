import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ideaSchema } from "@/lib/validation";
import { hasPermission } from "@/lib/permissions";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || !(await hasPermission(session.user.id, session.user.role, "innovation.submit"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const ideas = await prisma.idea.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      author: { select: { id: true, name: true, avatarUrl: true } },
    },
  });

  return NextResponse.json({ ideas });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = ideaSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid idea data." }, { status: 400 });
  }

  if (!(await hasPermission(session.user.id, session.user.role, "innovation.submit"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const idea = await prisma.idea.create({
    data: {
      authorId: session.user.id,
      title: parsed.data.title,
      description: parsed.data.description,
    },
  });

  await prisma.auditLog.create({
    data: { actorId: session.user.id, action: "INNOVATION_IDEA_CREATED", entity: "Idea", entityId: idea.id },
  });

  return NextResponse.json({ idea }, { status: 201 });
}
