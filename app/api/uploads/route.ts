import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";

const MAX_FILE_SIZE = 15 * 1024 * 1024;

const readPermissions: Record<string, string> = {
  course: "learning.read",
  lesson: "learning.read",
  resource: "learning.read",
  project: "projects.read",
  event: "events.read",
  competition: "competitions.read",
};

const writePermissions: Record<string, string> = {
  course: "learning.manage",
  lesson: "learning.manage",
  resource: "learning.manage",
  project: "projects.participate",
  event: "events.manage",
  competition: "competitions.manage",
};

function validEntityType(value: string) {
  return ["course", "lesson", "resource", "project", "event", "competition"].includes(value);
}

function safeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._ -]/g, "_").slice(0, 180) || "file";
}

async function canAccess(userId: string, role: Parameters<typeof hasPermission>[1], entityType: string, entityId: string, write = false) {
  const permission = (write ? writePermissions : readPermissions)[entityType];
  if (!permission || !(await hasPermission(userId, role, permission))) return false;

  if (entityType !== "project") return true;

  const project = await prisma.project.findUnique({
    where: { id: entityId },
    select: { ownerId: true, members: { select: { userId: true } } },
  });

  return Boolean(project && (
    project.ownerId === userId ||
    project.members.some((member) => member.userId === userId)
  ) || role === "SUPER_ADMIN");
}

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const entityType = url.searchParams.get("entityType") ?? "";
  const entityId = url.searchParams.get("entityId") ?? "";
  if (!validEntityType(entityType) || !entityId) {
    return NextResponse.json({ error: "entityType and entityId are required." }, { status: 400 });
  }

  if (!(await canAccess(session.user.id, session.user.role, entityType, entityId))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const files = await prisma.fileAsset.findMany({
    where: { entityType, entityId },
    orderBy: { createdAt: "desc" },
    select: { id: true, fileName: true, mimeType: true, sizeBytes: true, createdAt: true, owner: { select: { id: true, name: true } } },
  });

  return NextResponse.json({ files });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData();
  const entityType = String(form.get("entityType") ?? "");
  const entityId = String(form.get("entityId") ?? "");
  const file = form.get("file");

  if (!validEntityType(entityType) || !entityId || !(file instanceof File)) {
    return NextResponse.json({ error: "A valid entity and file are required." }, { status: 400 });
  }

  if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Files must be between 1 byte and 15 MB." }, { status: 400 });
  }

  if (!(await canAccess(session.user.id, session.user.role, entityType, entityId, true))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const saved = await prisma.fileAsset.create({
    data: {
      ownerId: session.user.id,
      entityType,
      entityId,
      fileName: safeFileName(file.name),
      mimeType: file.type || "application/octet-stream",
      sizeBytes: file.size,
      data: bytes,
    },
    select: { id: true, fileName: true, mimeType: true, sizeBytes: true, createdAt: true },
  });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      action: "FILE_UPLOADED",
      entity: entityType,
      entityId,
      metadata: { fileId: saved.id, fileName: saved.fileName, sizeBytes: saved.sizeBytes },
    },
  });

  return NextResponse.json({ file: saved }, { status: 201 });
}
