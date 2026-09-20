import { prisma } from "@/lib/prisma";
import type { UserRole } from "@prisma/client";
import { PERMISSION_MATRIX, PERMISSION_CATALOG } from "@/lib/roles";

function permissionMatches(granted: string, requested: string) {
  if (granted === "*" || granted === requested) return true;

  const grantedAliases = new Set([
    granted,
    granted.replace(/:/g, "."),
    granted.replace(/\./g, ":"),
  ]);
  const requestedAliases = new Set([
    requested,
    requested.replace(/:/g, "."),
    requested.replace(/\./g, ":"),
  ]);

  for (const grantedKey of grantedAliases) {
    for (const requestedKey of requestedAliases) {
      if (grantedKey === requestedKey) return true;

      if (grantedKey.endsWith(".*") && requestedKey.startsWith(grantedKey.slice(0, -1))) {
        return true;
      }

      if (grantedKey.endsWith(":*") && requestedKey.startsWith(grantedKey.slice(0, -1))) {
        return true;
      }
    }
  }

  return false;
}

function roleAllows(role: UserRole, key: string) {
  const permissions = PERMISSION_MATRIX[role] ?? [];
  return permissions.some((permission) => permissionMatches(permission, key));
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
  if (role === "SUPER_ADMIN") return true;

  if (
    role === "STUDENT" &&
    key !== "attl.apply" &&
    (key.startsWith("attl.") || key.startsWith("attl:"))
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { attlMembershipActive: true },
    });

    if (!user?.attlMembershipActive) return false;
  }

  const override = await prisma.userPermission.findFirst({
    where: { userId, permission: { key } },
    select: { granted: true },
  });

  if (override) return override.granted;

  if (roleAllows(role, key)) return true;

  const customPermissions = await getCustomRolePermissions(userId);
  return [...customPermissions].some((permission) => permissionMatches(permission, key));
}

export async function getEffectivePermissions(userId: string, role: UserRole) {
  const customPermissions = await getCustomRolePermissions(userId);
  const overrides = await prisma.userPermission.findMany({
    where: { userId },
    select: { permission: { select: { key: true } }, granted: true },
  });

  const map: Record<string, boolean> = {};
  for (const [key] of PERMISSION_CATALOG) {
    map[key] = roleAllows(role, key) || [...customPermissions].some((permission) => permissionMatches(permission, key));
  }

  for (const item of overrides) {
    map[item.permission.key] = item.granted;
  }

  return map;
}


export async function hasAnyPermission(userId: string, role: UserRole, keys: string[]) {
  if (role === "SUPER_ADMIN") return true;
  for (const key of keys) {
    if (await hasPermission(userId, role, key)) return true;
  }
  return false;
}
