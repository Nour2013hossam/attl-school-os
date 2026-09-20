import { prisma } from "@/lib/prisma";
import type { UserRole } from "@prisma/client";
import { PERMISSION_MATRIX } from "@/lib/roles";

function roleAllows(role: UserRole, key: string) {
  const permissions = PERMISSION_MATRIX[role] ?? [];
  return permissions.some((permission) => {
    if (permission === "*") return true;
    if (permission === key) return true;
    if (permission.endsWith(":*")) return key.startsWith(permission.slice(0, -1));
    return false;
  });
}

export async function hasPermission(userId: string, role: UserRole, key: string) {
  const override = await prisma.userPermission.findFirst({
    where: { userId, permission: { key } },
    select: { granted: true },
  });

  if (override) return override.granted;
  return roleAllows(role, key);
}

export async function getEffectivePermissions(userId: string, role: UserRole) {
  const overrides = await prisma.userPermission.findMany({
    where: { userId },
    select: { permission: { select: { key: true } }, granted: true },
  });

  const map: Record<string, boolean> = {};
  const keys = new Set(
    Object.values(PERMISSION_MATRIX).flatMap((items) => items).filter(
      (key) => key !== "*" && !key.endsWith(":*")
    )
  );
  for (const key of keys) map[key] = roleAllows(role, key);
  for (const item of overrides) map[item.permission.key] = item.granted;
  return map;
}
