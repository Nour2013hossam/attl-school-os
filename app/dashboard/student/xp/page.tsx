"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Data = {
  user: { xp: number; level: number } | null;
  stats: { projects: number; achievements: number; activeGoals: number };
};

export default function StudentXPPage() {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    fetch("/api/dashboard", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then(setData);
  }, []);

  const xp = data?.user?.xp ?? 0;
  const level = data?.user?.level ?? 1;
  const nextLevel = Math.max(100, level * 100);
  const levelBase = Math.max(0, (level - 1) * 100);
  const intoLevel = Math.max(0, xp - levelBase);
  const progress = Math.min(100, Math.round((intoLevel / (nextLevel - levelBase)) * 100));
  const remaining = Math.max(0, nextLevel - xp);

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[32px] bg-black p-6 text-white md:p-8">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/25 blur-[100px]" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-[9px] uppercase tracking-[.22em] text-blue-300">XP Progression</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-.07em] md:text-5xl">Build your level.</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">Your level and XP are read directly from your account.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/dashboard/student/achievements" className="rounded-[14px] bg-white px-4 py-2.5 text-[9px] font-semibold text-black">Achievements</Link>
              <Link href="/dashboard/projects/create" className="rounded-[14px] border border-white/10 bg-white/[.06] px-4 py-2.5 text-[9px] font-semibold text-white/75">Build project</Link>
            </div>
          </div>
          <div className="flex h-52 w-52 items-center justify-center rounded-full border border-white/10 bg-white/[.04] shadow-inner">
            <div className="text-center">
              <p className="text-[8px] uppercase tracking-[.28em] text-white/30">Level</p>
              <p className="mt-2 text-6xl font-semibold tracking-[-.09em]">{level}</p>
              <p className="mt-2 text-[10px] text-white/35">{xp} XP</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        {[
          ["Current XP", xp],
          ["Next level", nextLevel],
          ["Remaining", remaining + " XP"],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-[24px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl">
            <p className="text-[8px] uppercase tracking-[.16em] text-black/30">{label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-[-.06em]">{value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-[30px] border border-white/80 bg-white/60 p-6 backdrop-blur-2xl md:p-8">
        <div className="flex items-end justify-between gap-3">
          <div><p className="text-[9px] uppercase tracking-[.2em] text-black/25">Current journey</p><h2 className="mt-1 text-xl font-semibold">Level {level} → Level {level + 1}</h2></div>
          <span className="text-[9px] text-black/30">{intoLevel} / {nextLevel - levelBase} XP</span>
        </div>
        <div className="mt-7 h-3 overflow-hidden rounded-full bg-black/[.06]"><div className="h-full rounded-full bg-black transition-all" style={{ width: progress + "%" }} /></div>
        <div className="mt-3 flex justify-between text-[9px] text-black/30"><span>0</span><span>{progress}%</span><span>{nextLevel - levelBase} XP</span></div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        {[
          ["Projects", data?.stats.projects ?? "—", "/dashboard/projects/my-projects"],
          ["Achievements", data?.stats.achievements ?? "—", "/dashboard/student/achievements"],
          ["Goals", data?.stats.activeGoals ?? "—", "/dashboard/student/goals"],
        ].map(([label, value, href]) => (
          <Link key={String(label)} href={href as string} className="rounded-[24px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl transition hover:-translate-y-1 hover:bg-white">
            <p className="text-[8px] uppercase tracking-[.16em] text-black/30">{label}</p>
            <p className="mt-3 text-3xl font-semibold">{value}</p>
            <p className="mt-2 text-[9px] text-black/30">Open →</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
