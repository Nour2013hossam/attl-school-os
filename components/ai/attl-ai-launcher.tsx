"use client";

import Link from "next/link";
import { usePreferences } from "@/components/providers/preferences-provider";

export default function AttlAiLauncher() {
  const { language } = usePreferences();
  const ar = language === "ar";

  return (
    <div className="fixed bottom-24 right-4 z-[60] sm:bottom-5 sm:right-5 lg:bottom-7 lg:right-[290px]" dir="ltr">
      <div className="group relative">
        <div className="pointer-events-none absolute -inset-2 rounded-[23px] bg-blue-400/10 blur-xl opacity-70 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="relative flex items-center gap-2 rounded-[21px] border border-white/80 bg-white/55 p-1.5 shadow-[0_18px_60px_rgba(20,40,80,.16),inset_0_1px_0_rgba(255,255,255,.95)] backdrop-blur-[28px] backdrop-saturate-150 dark:border-white/15 dark:bg-black/35">
          <Link
            href="/dashboard/ai"
            aria-label={ar ? "فتح ATTL AI" : "Open ATTL AI"}
            className="interactive-glass flex h-12 w-12 items-center justify-center rounded-[17px] border border-white/70 bg-white/70 shadow-[0_8px_30px_rgba(20,30,50,.10)] transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15"
          >
            <span className="relative flex h-8 w-8 items-center justify-center rounded-[11px] bg-black text-white shadow-lg">
              <svg viewBox="0 0 32 32" aria-hidden="true" className="h-[18px] w-[18px]">
                <rect x="7" y="9" width="18" height="15" rx="6" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <path d="M11 15h.01M21 15h.01M12 19h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M16 5v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="16" cy="4" r="1.5" fill="currentColor" />
              </svg>
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,.9)]" />
            </span>
          </Link>

          <Link
            href="/dashboard/ai"
            className="hidden pr-2 sm:block"
            aria-label={ar ? "ATTL AI" : "ATTL AI"}
          >
            <p className="text-[8px] font-semibold uppercase tracking-[.18em] text-black/35 dark:text-white/35">ATTL AI</p>
            <p className="mt-0.5 text-[9px] font-medium text-black/55 dark:text-white/60">
              {ar ? "مساعدك الذكي" : "Smart assistant"}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
