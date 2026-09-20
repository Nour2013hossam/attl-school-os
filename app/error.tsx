"use client";

import Link from "next/link";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="min-h-screen bg-[#eef3f8] px-5 py-16 text-black">
      <div className="mx-auto max-w-xl rounded-[32px] border border-white/90 bg-white/70 p-8 text-center shadow-[0_25px_90px_rgba(30,45,70,.1)] backdrop-blur-2xl md:p-10">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-[18px] bg-black text-white">!</div>
        <p className="mt-5 text-[9px] font-semibold uppercase tracking-[.22em] text-blue-500">ATTL School OS</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-.05em]">Something went wrong.</h1>
        <p className="mt-3 text-sm leading-6 text-black/42">The page hit an unexpected error. Try the action again or return to the dashboard.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => reset()} className="rounded-[14px] bg-black px-5 py-3 text-[9px] font-semibold text-white">Try again</button>
          <Link href="/dashboard" className="rounded-[14px] bg-black/[.04] px-5 py-3 text-[9px] font-semibold text-black/55">Dashboard</Link>
        </div>
      </div>
    </main>
  );
}
