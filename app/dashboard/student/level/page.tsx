"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Data = {
  user: { xp: number; level: number } | null;
  stats: { projects: number; achievements: number; activeGoals: number };
};

export default function StudentLevelPage() {
  const [data, setData] = useState<Data | null>(null);
  useEffect(() => {
    fetch("/api/dashboard", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then(setData);
  }, []);

  const xp = data?.user?.xp ?? 0;
  const level = data?.user?.level ?? 1;
  const base = Math.max(0, (level - 1) * 100);
  const next = level * 100;
  const progress = Math.min(100, Math.round(((xp - base) / Math.max(1, next - base)) * 100));
  const remaining = Math.max(0, next - xp);

  const roadmap = [1,2,3,4,5].map((n) => ({
    level: n,
    xp: (n - 1) * 100,
    title: ["Getting Started", "Explorer", "Builder", "Achiever", "Leader"][n - 1],
    unlocked: level >= n,
  }));

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[32px] bg-black p-7 text-white md:p-9">
        <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-blue-500/25 blur-[100px]" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-[9px] uppercase tracking-[.22em] text-blue-300">Level System</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-.07em] md:text-5xl">Level {level}.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">Your level is derived from the XP stored on your School OS account.</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/dashboard/student/xp" className="rounded-[14px] bg-white px-4 py-2.5 text-[9px] font-semibold text-black">View XP</Link>
              <Link href="/dashboard/student/achievements" className="rounded-[14px] border border-white/10 bg-white/[.06] px-4 py-2.5 text-[9px] font-semibold text-white/75">Achievements</Link>
            </div>
          </div>
          <div className="flex h-52 w-52 items-center justify-center rounded-full border border-white/10 bg-white/[.04]">
            <div className="text-center"><p className="text-[8px] uppercase tracking-[.28em] text-white/30">Current level</p><p className="mt-2 text-6xl font-semibold">{level}</p><p className="mt-2 text-[10px] text-white/35">{xp} XP</p></div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[["Level", level],["Current XP", xp],["Next level", next],["Remaining", remaining + " XP"]].map(([label,value])=>
          <div key={String(label)} className="rounded-[23px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl"><p className="text-[8px] uppercase tracking-[.16em] text-black/30">{label}</p><p className="mt-3 text-3xl font-semibold">{value}</p></div>
        )}
      </section>

      <section className="rounded-[30px] border border-white/80 bg-white/60 p-6 backdrop-blur-2xl md:p-8">
        <div className="flex items-end justify-between"><div><p className="text-[9px] uppercase tracking-[.2em] text-black/25">Progression</p><h2 className="mt-1 text-xl font-semibold">Path to Level {level + 1}</h2></div><span className="text-[9px] text-black/30">{progress}%</span></div>
        <div className="mt-6 h-3 overflow-hidden rounded-full bg-black/[.06]"><div className="h-full rounded-full bg-black transition-all" style={{width:progress+"%"}}/></div>
        <div className="mt-3 flex justify-between text-[9px] text-black/30"><span>{base} XP</span><span>{remaining} XP remaining</span><span>{next} XP</span></div>
      </section>

      <section className="rounded-[30px] border border-white/80 bg-white/60 p-6 backdrop-blur-2xl md:p-8">
        <p className="text-[9px] uppercase tracking-[.2em] text-black/25">Roadmap</p>
        <h2 className="mt-1 text-xl font-semibold">Progress milestones</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {roadmap.map((item) => (
            <div key={item.level} className={item.unlocked ? "rounded-[22px] bg-black p-5 text-white" : "rounded-[22px] bg-black/[.025] p-5"}>
              <div className="flex items-center justify-between"><span className="text-[8px] uppercase tracking-[.16em] opacity-40">Level {item.level}</span><span className="text-lg">{item.unlocked ? "✓" : "○"}</span></div>
              <h3 className="mt-4 text-sm font-semibold">{item.title}</h3><p className="mt-2 text-[9px] opacity-50">{item.xp} XP threshold</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
