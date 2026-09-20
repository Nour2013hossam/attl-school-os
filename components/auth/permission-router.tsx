"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePreferences } from "@/components/providers/preferences-provider";
import { permissionForRoute } from "@/lib/permission-routes";

export function PermissionRouter({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { can, permissionsReady } = usePreferences();
  const permission = permissionForRoute(pathname);

  useEffect(() => {
    if (!permissionsReady || !permission) return;
    if (!can(permission)) router.replace("/dashboard");
  }, [can, permission, permissionsReady, router]);

  if (permissionsReady && permission && !can(permission)) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="rounded-[24px] border border-black/5 bg-white/70 px-6 py-5 text-center shadow-sm backdrop-blur-2xl">
          <p className="text-sm font-semibold">Access restricted</p>
          <p className="mt-2 text-[10px] text-black/35">This workspace is not available for your current permissions.</p>
        </div>
      </div>
    );
  }

  return children;
}
