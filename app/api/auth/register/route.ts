import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please enter a valid name, email and password." },
        { status: 400 }
      );
    }

    const email = parsed.data.email.trim().toLowerCase();
    const name = parsed.data.name.trim();

    // Rate-limit by both IP and email so one Vercel instance cannot block
    // every student when the proxy does not provide a stable client IP.
    const rate = rateLimit(
      `register:${ip}:${email}`,
      5,
      15 * 60 * 1000
    );

    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Too many registration attempts. Try again later." },
        { status: 429 }
      );
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);

    let user: { id: string; name: string; email: string };

    try {
      user = await prisma.user.create({
        data: {
          name,
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

      throw error;
    }

    // Audit logging must never make a successfully-created account appear to fail.
    try {
      await prisma.auditLog.create({
        data: {
          actorId: user.id,
          action: "ACCOUNT_CREATED",
          entity: "User",
          entityId: user.id,
          metadata: { source: "registration" },
          ip,
        },
      });
    } catch (error) {
      console.error("Registration audit log error", error);
    }

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Registration error", error);
    return NextResponse.json(
      { error: "Could not create the account. Please try again." },
      { status: 500 }
    );
  }
}
