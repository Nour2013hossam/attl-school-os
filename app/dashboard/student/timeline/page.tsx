"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Log = { id: string; action: string; entity: string; createdAt: string };
type Goal = { id: string; title: string; progress: number; completedAt: string | null; updatedAt: string };

function label(action: string) {
  return action.replaceAll("_", " ").replace(/^./, (c) => c.toUpperCase());
}

export default function StudentTimelinePage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetch("/api/activity", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then((d) => {
      setLogs(d?.logs ?? []);
      setGoals(d?.goals ?? []);
    });
  }, []);

  const items = useMemo(() => {
    const base = logs.map((log) => ({ id: log.id, title: label(log.action), description: log.entity, date: log.createdAt, kind: "Activity" }));
    const goalItems = goals.map((goal) => ({ id: "goal-"+goal.id, title: goal.title, description: goal.progress >= 100 ? "Goal completed" : goal.progress + "% complete", date: goal.updatedAt, kind: "Goals" }));
    const all = filter === "Goals" ? goalItems : filter === "Activity" ? base : [...base, ...goalItems];
    return all.sort((a,b) => +new Date(b.date) - +new Date(a.date)).slice(0, 40);
  }, [filter, logs, goals]);

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[32px] bg-black p-7 text-white md:p-9">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/25 blur-[90px]" />
        <div className="relative">
          <p className="text-[9px] uppercase tracking-[.22em] text-blue-300">Student Journey</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-.06em] md:text-5xl">Your timeline.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">A live chronological record of activity and goals across your School OS account.</p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ["Activity", logs.length],
          ["Goals", goals.length],
          ["Completed goals", goals.filter((g) => g.completedAt).length],
          ["Records shown", items.length],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-[24px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl">
            <p className="text-[8px] uppercase tracking-[.16em] text-black/30">{label}</p>
            <p className="mt-3 text-3xl font-semibold">{value}</p>
          </div>
        ))}
      </section>

      <section className="overflow-x-auto rounded-[24px] border border-white/80 bg-white/60 p-2 backdrop-blur-2xl">
        <div className="flex min-w-max gap-1">
          {["All", "Activity", "Goals"].map((item) => (
            <button key={item} type="button" onClick={() => setFilter(item)} className={filter === item ? "rounded-[16px] bg-black px-4 py-2.5 text-[9px] font-semibold text-white" : "rounded-[16px] px-4 py-2.5 text-[9px] text-black/35 hover:bg-black/[.04]"}>{item}</button>
          ))}
        </div>
      </section>

      <section className="rounded-[30px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl md:p-8">
        <div className="mb-7"><p className="text-[9px] uppercase tracking-[.2em] text-black/25">Journey history</p><h2 className="mt-1 text-xl font-semibold">Recent milestones</h2></div>
        <div className="space-y-3">
          {items.map((item) => (
            <article key={item.id} className="flex gap-4 rounded-[20px] bg-black/[.025] p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-black text-white">✦</div>
              <div className="min-w-0 flex-1"><div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"><p className="text-[10px] font-semibold">{item.title}</p><time className="text-[8px] text-black/25">{new Date(item.date).toLocaleString()}</time></div><p className="mt-1 text-[9px] text-black/35">{item.kind} · {item.description}</p></div>
            </article>
          ))}
          {items.length === 0 && <div className="p-10 text-center text-[10px] text-black/30">No journey records yet.</div>}
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <Link href="/dashboard/student/activity" className="rounded-[24px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl"><h3 className="text-sm font-semibold">Activity center</h3><p className="mt-2 text-[9px] text-black/35">Inspect your account activity.</p></Link>
        <Link href="/dashboard/student/goals" className="rounded-[24px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl"><h3 className="text-sm font-semibold">Goals</h3><p className="mt-2 text-[9px] text-black/35">Turn milestones into measurable progress.</p></Link>
        <Link href="/dashboard/student/portfolio" className="rounded-[24px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl"><h3 className="text-sm font-semibold">Portfolio</h3><p className="mt-2 text-[9px] text-black/35">See how your work is connected.</p></Link>
      </section>
    </div>
  );
}
