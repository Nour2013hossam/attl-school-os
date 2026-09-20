import { prisma } from "@/lib/prisma";
import type { UserRole } from "@prisma/client";
import { PERMISSION_MATRIX, PERMISSION_CATALOG } from "@/lib/roles";

function roleAllows(role: UserRole, key: string) {
  const permissions = PERMISSION_MATRIX[role] ?? [];
  return permissions.some((permission) => {
    if (permission === "*") return true;
    if (permission === key) return true;
    if (permission.endsWith(":*")) return key.startsWith(permission.slice(0, -1));
    return false;
  });
}

async function getCustomRolePermissions(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      customRole: {
        select: {
          active: true,
          permissions: { select: { permission: { select: { key: true } } } },
        },
      },
    },
  });

  if (!user?.customRole?.active) return new Set<string>();
  return new Set(user.customRole.permissions.map((item) => item.permission.key));
}

export async function hasPermission(userId: string, role: UserRole, key: string) {
  const override = await prisma.userPermission.findFirst({
    where: { userId, permission: { key } },
    select: { granted: true },
  });

  if (override) return override.granted;

  if (roleAllows(role, key)) return true;

  const customPermissions = await getCustomRolePermissions(userId);
  return customPermissions.has(key);
}

export async function getEffectivePermissions(userId: string, role: UserRole) {
  const customPermissions = await getCustomRolePermissions(userId);
  const overrides = await prisma.userPermission.findMany({
    where: { userId },
    select: { permission: { select: { key: true } }, granted: true },
  });

  const map: Record<string, boolean> = {};
  for (const [key] of PERMISSION_CATALOG) {
    map[key] = roleAllows(role, key) || customPermissions.has(key);
  }

  for (const item of overrides) {
    map[item.permission.key] = item.granted;
  }

  return map;
}
