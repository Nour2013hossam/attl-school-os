"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="mt-4 w-full rounded-[13px] border border-white/10 bg-white/[0.06] px-3 py-2 text-[9px] font-medium text-white/50 transition hover:bg-white/10 hover:text-white"
    >
      Sign out
    </button>
  );
}
