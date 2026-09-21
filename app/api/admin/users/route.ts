import { NextResponse } from "next/server";
import { Prisma, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasAnyPermission, hasPermission } from "@/lib/permissions";
import { rateLimit } from "@/lib/rate-limit";

const createUserSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(128),
  role: z.nativeEnum(UserRole).default(UserRole.STUDENT),
  gradeLevel: z.string().trim().max(80).optional(),
  className: z.string().trim().max(80).optional(),
});

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (
    !(await hasAnyPermission(
      session.user.id,
      session.user.role,
      ["users.read", "xp.manage"]
    ))
  ) {
    return NextResponse.json(
      { error: "You do not have permission to view users." },
      { status: 403 }
    );
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      schoolId: true,
      gradeLevel: true,
      className: true,
      xp: true,
      level: true,
      isActive: true,
      attlMembershipActive: true,
      customRole: { select: { id: true, name: true } },
      createdAt: true,
    },
  });

  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (
    !(await hasPermission(
      session.user.id,
      session.user.role,
      "users.manage"
    ))
  ) {
    return NextResponse.json(
      { error: "You do not have permission to create users." },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = createUserSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Enter a valid name, email and password." },
      { status: 400 }
    );
  }

  const email = parsed.data.email.toLowerCase();
  const requestedRole = parsed.data.role;

  if (
    requestedRole === UserRole.SUPER_ADMIN &&
    session.user.role !== UserRole.SUPER_ADMIN
  ) {
    return NextResponse.json(
      { error: "Only a Super Admin can create a Super Admin account." },
      { status: 403 }
    );
  }

  if (
    [UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(requestedRole) &&
    session.user.role !== UserRole.SUPER_ADMIN
  ) {
    return NextResponse.json(
      { error: "Only a Super Admin can create admin accounts." },
      { status: 403 }
    );
  }

  const rate = rateLimit(
    `admin-register:${session.user.id}`,
    20,
    15 * 60 * 1000
  );

  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many account creation attempts. Try again later." },
      { status: 429 }
    );
  }

  try {
    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    const shouldCreateStudentProfile = [
      UserRole.STUDENT,
      UserRole.ATTL_MEMBER,
      UserRole.TRACK_LEAD,
    ].includes(requestedRole);
    const shouldCreateTeacherProfile = requestedRole === UserRole.TEACHER;

    const user = await prisma.user.create({
      data: {
        name: parsed.data.name.trim(),
        email,
        passwordHash,
        role: requestedRole,
        gradeLevel: parsed.data.gradeLevel?.trim() || null,
        className: parsed.data.className?.trim() || null,
        attlMembershipActive: [UserRole.ATTL_MEMBER, UserRole.TRACK_LEAD].includes(
          requestedRole
        ),
        attlActivatedAt: [UserRole.ATTL_MEMBER, UserRole.TRACK_LEAD].includes(
          requestedRole
        )
          ? new Date()
          : null,
        ...(shouldCreateStudentProfile
          ? { studentProfile: { create: {} } }
          : {}),
        ...(shouldCreateTeacherProfile
          ? { teacherProfile: { create: {} } }
          : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        gradeLevel: true,
        className: true,
        attlMembershipActive: true,
        createdAt: true,
      },
    });

    try {
      await prisma.auditLog.create({
        data: {
          actorId: session.user.id,
          action: "ACCOUNT_CREATED_BY_ADMIN",
          entity: "User",
          entityId: user.id,
          metadata: { role: requestedRole, email },
        },
      });
    } catch (error) {
      console.error("Admin account audit log error", error);
    }

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
      console.error("Admin account database initialization error", error);
      return NextResponse.json(
        { error: "The database is temporarily unavailable.", code: "DATABASE_UNAVAILABLE" },
        { status: 503 }
      );
    }

    console.error("Admin account creation error", error);
    return NextResponse.json(
      { error: "Could not create the account. Please try again." },
      { status: 500 }
    );
  }
}
