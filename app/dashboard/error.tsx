"use client";

import Link from "next/link";

export default function DashboardError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-2xl rounded-[30px] border border-white/80 bg-white/65 p-8 text-center shadow-sm backdrop-blur-2xl">
      <p className="text-[9px] uppercase tracking-[.2em] text-blue-500">School OS</p>
      <h1 className="mt-3 text-2xl font-semibold">This workspace needs another try.</h1>
      <p className="mt-2 text-[11px] leading-5 text-black/40">A temporary page error occurred. Your account and permissions are unchanged.</p>
      <div className="mt-5 flex justify-center gap-2">
        <button onClick={() => reset()} className="rounded-[14px] bg-black px-5 py-3 text-[9px] font-semibold text-white">Retry</button>
        <Link href="/dashboard" className="rounded-[14px] bg-black/[.04] px-5 py-3 text-[9px] font-semibold text-black/55">Home</Link>
      </div>
    </div>
  );
}
