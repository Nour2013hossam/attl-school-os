import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";

const managePermissions: Record<string, string> = {
  course: "learning.manage",
  lesson: "learning.manage",
  resource: "learning.manage",
  project: "projects.participate",
  event: "events.manage",
  competition: "competitions.manage",
};

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const file = await prisma.fileAsset.findUnique({
    where: { id },
    select: { id: true, fileName: true, mimeType: true, data: true },
  });
  if (!file) return NextResponse.json({ error: "File not found." }, { status: 404 });

  return new Response(file.data, {
    headers: {
      "Content-Type": file.mimeType || "application/octet-stream",
      "Content-Disposition": `inline; filename="${file.fileName.replace(/"/g, "")}"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await context.params;
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const file = await prisma.fileAsset.findUnique({
    where: { id },
    select: { id: true, ownerId: true, entityType: true, entityId: true, fileName: true },
  });
  if (!file) return NextResponse.json({ error: "File not found." }, { status: 404 });

  const permission = managePermissions[file.entityType];
  const owner = file.ownerId === session.user.id;
  const permitted = permission ? await hasPermission(session.user.id, session.user.role, permission) : false;
  if (!owner && !permitted) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.fileAsset.delete({ where: { id } });
  await prisma.auditLog.create({
    data: { actorId: session.user.id, action: "FILE_DELETED", entity: file.entityType, entityId: file.entityId, metadata: { fileId: file.id, fileName: file.fileName } },
  });

  return NextResponse.json({ ok: true });
}