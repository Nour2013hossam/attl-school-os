"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Activity = { id: string; action: string; entity: string; createdAt: string };
type Project = { id: string; title: string; status: string; progress: number; updatedAt: string };
type Goal = { id: string; title: string; progress: number; completedAt: string | null; updatedAt: string };

function prettyAction(action: string) {
  return action.replaceAll("_", " ").replace(/^./, (c) => c.toUpperCase());
}

export default function StudentActivityPage() {
  const [logs, setLogs] = useState<Activity[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetch("/api/activity", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        setLogs(d?.logs ?? []);
        setProjects(d?.projects ?? []);
        setGoals(d?.goals ?? []);
      });
  }, []);

  const filtered = useMemo(() => {
    if (filter === "Projects") return projects.length ? projects.map((p) => ({ id: p.id, action: "Project updated", entity: p.title, createdAt: p.updatedAt })) : [];
    if (filter === "Goals") return goals.length ? goals.map((g) => ({ id: g.id, action: "Goal updated", entity: g.title, createdAt: g.updatedAt })) : [];
    return logs;
  }, [filter, logs, projects, goals]);

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[32px] bg-black p-7 text-white md:p-9">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/25 blur-[90px]" />
        <div className="relative">
          <p className="text-[9px] uppercase tracking-[.22em] text-blue-300">Activity Center</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-.06em] md:text-5xl">Everything you do.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">A personal activity stream built from your School OS records.</p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ["Activity records", logs.length],
          ["Projects", projects.length],
          ["Goals", goals.length],
          ["Completed goals", goals.filter((g) => g.completedAt).length],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-[24px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl">
            <p className="text-[8px] uppercase tracking-[.16em] text-black/30">{label}</p>
            <p className="mt-3 text-3xl font-semibold">{value}</p>
          </div>
        ))}
      </section>

      <section className="overflow-x-auto rounded-[24px] border border-white/80 bg-white/60 p-2 backdrop-blur-2xl">
        <div className="flex min-w-max gap-1">
          {["All", "Projects", "Goals"].map((item) => (
            <button key={item} type="button" onClick={() => setFilter(item)} className={filter === item ? "rounded-[16px] bg-black px-4 py-2.5 text-[9px] font-semibold text-white" : "rounded-[16px] px-4 py-2.5 text-[9px] text-black/35 hover:bg-black/[.04]"}>{item}</button>
          ))}
        </div>
      </section>

      <section className="rounded-[30px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl md:p-8">
        <div className="flex items-end justify-between"><div><p className="text-[9px] uppercase tracking-[.2em] text-black/25">Live stream</p><h2 className="mt-1 text-xl font-semibold">Recent activity</h2></div><span className="text-[9px] text-black/30">{filtered.length} records</span></div>
        <div className="mt-6 divide-y divide-black/[.05]">
          {filtered.map((item) => (
            <div key={item.id} className="flex gap-4 py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-black text-white">✦</div>
              <div className="min-w-0 flex-1"><p className="text-[11px] font-semibold">{prettyAction(item.action)}</p><p className="mt-1 text-[9px] text-black/35">{item.entity}</p></div>
              <time className="text-[8px] text-black/25">{new Date(item.createdAt).toLocaleString()}</time>
            </div>
          ))}
          {filtered.length === 0 && <div className="p-10 text-center text-[10px] text-black/30">No activity records yet.</div>}
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <Link href="/dashboard/student/timeline" className="rounded-[24px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl"><h3 className="text-sm font-semibold">Timeline</h3><p className="mt-2 text-[9px] text-black/35">See your broader journey.</p></Link>
        <Link href="/dashboard/projects/my-projects" className="rounded-[24px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl"><h3 className="text-sm font-semibold">Projects</h3><p className="mt-2 text-[9px] text-black/35">Open your connected project work.</p></Link>
        <Link href="/dashboard/student/goals" className="rounded-[24px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl"><h3 className="text-sm font-semibold">Goals</h3><p className="mt-2 text-[9px] text-black/35">Keep your next steps moving.</p></Link>
      </section>
    </div>
  );
}
