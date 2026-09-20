"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type DashboardData = {
  user: { name: string; role: string; xp: number; level: number; gradeLevel: string | null; className: string | null; avatarUrl: string | null } | null;
  stats: {
    projects: number;
    activeGoals: number;
    achievements: number;
    upcomingAssignments: number;
    upcomingEvents: number;
    upcomingCompetitions: number;
  };
  goals: Array<{ id: string; title: string; progress: number; targetDate: string | null }>;
};

export default function DashboardOverview() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("/api/dashboard", { cache: "no-store" }).then(async (r) => r.ok ? r.json() : null).then(setData);
  }, []);

  const user = data?.user;
  const name = user?.name ?? "ATTL Student";
  const initial = name.trim().charAt(0).toUpperCase() || "A";

  const statCards = [
    ["Level", String(user?.level ?? "—"), "/dashboard/student/level"],
    ["XP", String(user?.xp ?? "—"), "/dashboard/student/xp"],
    ["Projects", String(data?.stats.projects ?? "—"), "/dashboard/projects/my-projects"],
    ["Achievements", String(data?.stats.achievements ?? "—"), "/dashboard/student/achievements"],
  ];

  const quickActions = [
    ["Build a Project", "Create a real project workspace.", "/dashboard/projects/create", "＋"],
    ["Explore Learning", "Find courses and resources.", "/dashboard/learning/explore", "◇"],
    ["Join ATTL", "Apply to become an ATTL member.", "/dashboard/attl/applications", "✦"],
    ["Find Competitions", "Discover competitions and challenges.", "/dashboard/competitions/explore", "★"],
  ];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[32px] bg-black p-6 text-white shadow-[0_30px_90px_rgba(20,30,50,0.14)] md:p-8 lg:p-10">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/30 blur-[90px]" />
        <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-cyan-400/10 blur-[100px]" />

        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[9px] uppercase tracking-[0.22em] text-white/50">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              ATTL School OS
            </div>
            <h1 className="max-w-3xl text-3xl font-semibold tracking-[-0.05em] md:text-5xl">
              Welcome back,
              <br />
              <span className="text-white/45">{name}.</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/45">
              Your academics, projects, skills, learning, competitions and ATTL work in one connected workspace.
            </p>
          </div>

          <Link href="/dashboard/student/profile" className="group flex items-center gap-4 rounded-[22px] border border-white/10 bg-white/[0.07] p-3 transition hover:bg-white/10">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-[18px] bg-white text-sm font-semibold text-black">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                initial
              )}
            </div>
            <div className="pr-3">
              <p className="text-[9px] uppercase tracking-[.18em] text-white/35">{user?.role ?? "STUDENT"}</p>
              <p className="mt-1 text-sm font-semibold">{user?.gradeLevel ?? "Grade not set"} · {user?.className ?? "Class not set"}</p>
              <p className="mt-1 text-[10px] text-white/35">Open profile →</p>
            </div>
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {statCards.map(([label, value, href]) => (
          <Link key={label} href={href} className="rounded-[24px] border border-white/80 bg-white/65 p-5 backdrop-blur-2xl transition hover:-translate-y-1 hover:bg-white">
            <p className="text-[9px] uppercase tracking-[.16em] text-black/30">{label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-[-.05em]">{value}</p>
            <p className="mt-2 text-[9px] text-black/30">Open →</p>
          </Link>
        ))}
      </section>

      <section>
        <div className="mb-3 px-1">
          <p className="text-[9px] font-semibold uppercase tracking-[.2em] text-black/30">Quick Actions</p>
          <h2 className="mt-1 text-xl font-semibold tracking-[-.04em]">Start something</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map(([title, description, href, icon]) => (
            <Link key={title} href={href} className="group rounded-[25px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl transition hover:-translate-y-1 hover:bg-white">
              <div className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-black text-lg text-white">{icon}</div>
              <h3 className="mt-5 text-sm font-semibold">{title}</h3>
              <p className="mt-2 text-[11px] leading-5 text-black/40">{description}</p>
              <span className="mt-5 block text-[10px] text-black/30 group-hover:text-blue-600">Open →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.25fr_.75fr]">
        <div className="rounded-[28px] border border-white/80 bg-white/60 p-6 backdrop-blur-2xl">
          <p className="text-[9px] uppercase tracking-[.2em] text-black/30">Next actions</p>
          <h2 className="mt-1 text-xl font-semibold tracking-[-.04em]">Keep your momentum</h2>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            {[
              ["Assignments", String(data?.stats.upcomingAssignments ?? "—"), "/dashboard/academics/assignments"],
              ["Events", String(data?.stats.upcomingEvents ?? "—"), "/dashboard/events/upcoming"],
              ["Competitions", String(data?.stats.upcomingCompetitions ?? "—"), "/dashboard/competitions/upcoming"],
              ["Active goals", String(data?.stats.activeGoals ?? "—"), "/dashboard/student/goals"],
            ].map(([label, value, href]) => (
              <Link key={label} href={href} className="rounded-[18px] bg-black/[.025] p-4 transition hover:bg-white">
                <p className="text-[8px] uppercase tracking-[.15em] text-black/25">{label}</p>
                <p className="mt-2 text-lg font-semibold">{value}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] bg-black p-6 text-white">
          <p className="text-[9px] uppercase tracking-[.2em] text-white/30">Goals</p>
          <h2 className="mt-1 text-xl font-semibold">Your current goals</h2>
          <div className="mt-5 space-y-2">
            {(data?.goals ?? []).slice(0, 4).map((goal) => (
              <Link key={goal.id} href="/dashboard/student/goals" className="block rounded-[17px] border border-white/10 bg-white/[.06] p-3">
                <p className="text-[10px] font-semibold">{goal.title}</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-white" style={{ width: `${goal.progress}%` }} />
                </div>
              </Link>
            ))}
            {(!data?.goals || data.goals.length === 0) && <p className="rounded-[17px] bg-white/[.06] p-4 text-[10px] text-white/35">Create your first goal from the Goals workspace.</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
