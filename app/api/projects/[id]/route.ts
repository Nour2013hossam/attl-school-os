import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { projectSchema } from "@/lib/validation";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id } = await context.params;

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, name: true, avatarUrl: true } },
      members: {
        include: { user: { select: { id: true, name: true, avatarUrl: true } } },
      },
      tasks: true,
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const isMember = project.ownerId === session.user.id || project.members.some(
    (member) => member.userId === session.user.id
  );

  if (!isMember && !["school", "public"].includes(project.visibility)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ project });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const { id } = await context.params;

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const project = await prisma.project.findUnique({
    where: { id },
    select: { ownerId: true },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const canEdit =
    project.ownerId === session.user.id ||
    [UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(session.user.role);

  if (!canEdit) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = projectSchema.partial().safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid project update." }, { status: 400 });
  }

  const updated = await prisma.project.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json({ project: updated });
}
