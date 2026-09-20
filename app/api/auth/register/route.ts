import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limit = rateLimit("register:"+ip, 5, 15 * 60 * 1000);
  if (!limit.allowed) return NextResponse.json({ error: "Too many registration attempts. Try again later." }, { status: 429 });
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please enter a valid name, email and password." },
        { status: 400 }
      );
    }

    const email = parsed.data.email.toLowerCase();

    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);

    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email,
        passwordHash,
        role: "STUDENT",
        studentProfile: {
          create: {},
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: "ACCOUNT_CREATED",
        entity: "User",
        entityId: user.id,
        metadata: { source: "registration" },
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Registration error", error);
    return NextResponse.json(
      { error: "Could not create the account." },
      { status: 500 }
    );
  }
}
