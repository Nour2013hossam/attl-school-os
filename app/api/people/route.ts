import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await hasPermission(session.user.id, session.user.role, "community.read"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const limit = rateLimit("people:"+session.user.id, 60, 60*1000);
  if (!limit.allowed) return NextResponse.json({ error: "Too many requests." }, { status: 429 });

  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  const users = await prisma.user.findMany({
    where: {
      isActive: true,
      id: { not: session.user.id },
      AND: [
        {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
          ],
        },
        {
          OR: [
            { preferences: { is: { profileVisible: true } } },
            { preferences: { is: null } },
          ],
        },
      ],
    },
    orderBy: { name: "asc" },
    take: 20,
    select: { id: true, name: true, email: true, role: true, avatarUrl: true, gradeLevel: true, className: true },
  });

  return NextResponse.json({ users });
}
