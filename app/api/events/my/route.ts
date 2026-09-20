import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const registrations = await prisma.eventRegistration.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { event: true },
  });

  return NextResponse.json({ registrations });
}
