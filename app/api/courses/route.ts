import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { z } from "zod";

const courseSchema = z.object({
  title: z.string().trim().min(2).max(180),
  description: z.string().trim().max(5000).nullable().optional(),
  level: z.string().trim().max(60).nullable().optional(),
  subjectId: z.string().nullable().optional(),
  published: z.boolean().optional(),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const manage = url.searchParams.get("manage") === "1";
  const session = await auth();

  if (manage) {
    if (!session?.user?.id || !(await hasPermission(session.user.id, session.user.role, "learning.manage"))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const courses = await prisma.course.findMany({
    where: manage ? {} : { published: true },
    orderBy: { createdAt: "desc" },
    include: {
      subject: { select: { code: true, name: true } },
      lessons: { orderBy: { position: "asc" }, select: { id: true, title: true, duration: true, position: true } },
      resources: { select: { id: true, title: true, type: true, url: true } },
      _count: { select: { lessons: true, resources: true, enrollments: true } },
    },
  });

  return NextResponse.json({ courses });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || !(await hasPermission(session.user.id, session.user.role, "learning.manage"))) {
    return NextResponse.json({ error: "You do not have permission to manage courses." }, { status: 403 });
  }

  const parsed = courseSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid course data." }, { status: 400 });

  const course = await prisma.course.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      level: parsed.data.level ?? null,
      subjectId: parsed.data.subjectId || null,
      published: parsed.data.published ?? false,
    },
  });

  await prisma.auditLog.create({
    data: { actorId: session.user.id, action: "COURSE_CREATED", entity: "Course", entityId: course.id, metadata: { title: course.title } },
  });

  return NextResponse.json({ course }, { status: 201 });
}
