import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ideaSchema } from "@/lib/validation";

export async function GET() {
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

  const idea = await prisma.idea.create({
    data: {
      authorId: session.user.id,
      title: parsed.data.title,
      description: parsed.data.description,
    },
  });

  return NextResponse.json({ idea }, { status: 201 });
}
