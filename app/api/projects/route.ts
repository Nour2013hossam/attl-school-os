import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { projectSchema } from "@/lib/validation";
import { hasPermission } from "@/lib/permissions";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!(await hasPermission(session.user.id, session.user.role, "projects.read"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { ownerId: session.user.id },
        { visibility: { in: ["school", "public"] } },
        { members: { some: { userId: session.user.id } } },
      ],
    },
    orderBy: { updatedAt: "desc" },
    include: {
      owner: { select: { id: true, name: true } },
      _count: { select: { members: true, tasks: true } },
    },
  });

  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!(await hasPermission(session.user.id, session.user.role, "projects.create"))) {
    return NextResponse.json({ error: "You do not have permission to create projects." }, { status: 403 });
  }

  try {
    const parsed = projectSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid project data." }, { status: 400 });
    }

    const slugBase = parsed.data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const slug = `${slugBase || "project"}-${Date.now().toString(36)}`;

    const project = await prisma.project.create({
      data: {
        ownerId: session.user.id,
        title: parsed.data.title,
        description: parsed.data.description,
        visibility: parsed.data.visibility,
        slug,
        members: {
          create: {
            userId: session.user.id,
            role: "Owner",
          },
        },
      },
      include: {
        members: { select: { userId: true, role: true } },
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("Project creation error", error);
    return NextResponse.json(
      { error: "Could not create project." },
      { status: 500 }
    );
  }
}
