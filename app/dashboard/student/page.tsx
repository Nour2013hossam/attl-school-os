"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Dashboard = {
  user: {
    name: string;
    role: string;
    xp: number;
    level: number;
    gradeLevel: string | null;
    className: string | null;
    avatarUrl: string | null;
  } | null;
  stats: {
    projects: number;
    activeGoals: number;
    achievements: number;
    upcomingAssignments: number;
    upcomingEvents: number;
    upcomingCompetitions: number;
  };
};

export default function StudentProfilePage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const user = data?.user;
  const name = user?.name ?? "ATTL Student";
  const initial = name.trim().charAt(0).toUpperCase() || "A";
  const xp = user?.xp ?? 0;
  const level = user?.level ?? 1;
  const xpIntoLevel = xp % 100;
  const progress = Math.min(100, xpIntoLevel);

  return (
    <section className="space-y-5">
      <div className="relative overflow-hidden rounded-[34px] bg-black p-7 text-white shadow-[0_30px_90px_rgba(0,0,0,.16)] md:p-10">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/20 blur-[100px]" />
        <div className="absolute -left-20 bottom-[-120px] h-80 w-80 rounded-full bg-cyan-400/10 blur-[100px]" />
        <div className="relative flex flex-col gap-8 md:flex-row md:items-end">
          <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-[32px] border border-white/10 bg-white/[.08] text-4xl font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,.2)] backdrop-blur-xl">
            {user?.avatarUrl ? <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" /> : initial}
          </div>
          <div className="flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/[.07] px-3 py-1.5 text-[9px] uppercase tracking-[.18em] text-white/45">
                {user?.role ?? "STUDENT"}
              </span>
              <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-[9px] text-blue-300">
                Level {level}
              </span>
            </div>
            <h1 className="text-4xl font-semibold tracking-[-.05em] md:text-5xl">
              {loading ? "Loading profile…" : name}
            </h1>
            <p className="mt-3 max-w-xl text-sm text-white/40">
              Your identity, progress, skills, projects and achievements inside ATTL School OS.
            </p>
          </div>
          <Link href="/dashboard/settings/account" className="rounded-2xl bg-white px-5 py-3 text-xs font-semibold text-black transition hover:-translate-y-0.5">
            Edit profile
          </Link>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.5fr]">
        <div className="rounded-[30px] border border-white/80 bg-white/65 p-6 shadow-[0_15px_50px_rgba(0,0,0,.05)] backdrop-blur-2xl">
          <p className="text-[9px] uppercase tracking-[.2em] text-black/30">Identity</p>
          <div className="mt-6 space-y-4">
            {[
              ["Name", name],
              ["Role", user?.role ?? "STUDENT"],
              ["Grade", user?.gradeLevel ?? "Not set"],
              ["Class", user?.className ?? "Not set"],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-[9px] text-black/30">{label}</p>
                <p className="mt-1 text-sm font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[30px] border border-white/80 bg-white/65 p-6 shadow-[0_15px_50px_rgba(0,0,0,.05)] backdrop-blur-2xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-[.2em] text-black/30">Progress</p>
              <h2 className="mt-2 text-xl font-semibold">Experience</h2>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold">{xp} XP</p>
              <p className="text-[9px] text-black/30">Level {level}</p>
            </div>
          </div>
          <div className="mt-7 h-3 overflow-hidden rounded-full bg-black/5">
            <div className="h-full rounded-full bg-black transition-all" style={{ width: progress + "%" }} />
          </div>
          <div className="mt-3 flex justify-between text-[9px] text-black/30">
            <span>{xpIntoLevel} XP</span>
            <span>100 XP</span>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {[
              ["Projects", data?.stats.projects ?? "—", "/dashboard/projects/my-projects"],
              ["Achievements", data?.stats.achievements ?? "—", "/dashboard/student/achievements"],
              ["Active goals", data?.stats.activeGoals ?? "—", "/dashboard/student/goals"],
            ].map(([label, value, href]) => (
              <Link key={label} href={href} className="rounded-2xl bg-black/[.035] p-4 transition hover:bg-white">
                <p className="text-[9px] text-black/30">{label}</p>
                <p className="mt-2 text-xl font-semibold">{value}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {[
          ["Academic pulse", data?.stats.upcomingAssignments ?? "—", "upcoming assignments", "/dashboard/academics/assignments"],
          ["School life", data?.stats.upcomingEvents ?? "—", "upcoming events", "/dashboard/events/upcoming"],
          ["Opportunities", data?.stats.upcomingCompetitions ?? "—", "competitions", "/dashboard/competitions/upcoming"],
          ["Portfolio", data?.stats.projects ?? "—", "projects connected", "/dashboard/student/portfolio"],
        ].map(([title, value, text, href]) => (
          <Link key={title} href={href} className="rounded-[24px] border border-white/80 bg-white/65 p-5 backdrop-blur-2xl transition hover:-translate-y-1 hover:bg-white">
            <p className="text-[8px] uppercase tracking-[.16em] text-black/30">{title}</p>
            <p className="mt-3 text-3xl font-semibold tracking-[-.06em]">{value}</p>
            <p className="mt-2 text-[9px] text-black/30">{text} →</p>
          </Link>
        ))}
      </div>

      <div className="rounded-[30px] bg-black p-7 text-white md:p-8">
        <p className="text-[9px] uppercase tracking-[.2em] text-white/30">Your story</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-.05em]">Keep building the profile behind the work.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
          Add interests, develop skills, ship projects and collect achievements. The School OS keeps those pieces connected.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/dashboard/student/identity" className="rounded-[14px] bg-white px-4 py-2.5 text-[9px] font-semibold text-black">Identity</Link>
          <Link href="/dashboard/skills/my-skills" className="rounded-[14px] border border-white/10 bg-white/[.06] px-4 py-2.5 text-[9px] font-semibold text-white/75">Skills</Link>
          <Link href="/dashboard/student/portfolio" className="rounded-[14px] border border-white/10 bg-white/[.06] px-4 py-2.5 text-[9px] font-semibold text-white/75">Portfolio</Link>
        </div>
      </div>
    </section>
  );
}
