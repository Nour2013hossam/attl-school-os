"use client";

import Link from "next/link";

const xpSources = [
  {
    title: "Achievement unlocked",
    detail: "First Step",
    xp: "+25 XP",
    time: "Today",
    icon: "✦",
  },
  {
    title: "Profile activity",
    detail: "Student identity started",
    xp: "+0 XP",
    time: "Today",
    icon: "◎",
  },
  {
    title: "School OS activity",
    detail: "Joined the platform",
    xp: "+0 XP",
    time: "Today",
    icon: "◈",
  },
];

const milestones = [
  { level: "Level 01", xp: 25, target: 100, label: "Getting Started" },
  { level: "Level 02", xp: 100, target: 250, label: "Explorer" },
  { level: "Level 03", xp: 250, target: 500, label: "Builder" },
  { level: "Level 04", xp: 500, target: 1000, label: "Achiever" },
];

export default function StudentXPPage() {
  const currentXP = 25;
  const nextLevel = 100;
  const progress = (currentXP / nextLevel) * 100;
  const remaining = nextLevel - currentXP;

  return (
    <div className="space-y-6">

      {/* Hero */}
      <section className="relative overflow-hidden rounded-[32px] bg-black p-6 text-white shadow-[0_25px_80px_rgba(0,0,0,0.12)] md:p-8">

        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/25 blur-[100px]" />
        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-cyan-400/10 blur-[100px]" />

        <div className="relative grid gap-8 lg:grid-cols-[1fr_340px] lg:items-center">

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-white/45">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              XP Progression
            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-[-0.05em] md:text-5xl">
              Build your level.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
              Your School OS activity turns into XP. Learn, build,
              participate and keep progressing.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              <Link
                href="/dashboard/student/achievements"
                className="rounded-[15px] bg-white px-4 py-2.5 text-[9px] font-semibold text-black transition hover:bg-white/90"
              >
                View achievements
              </Link>

              <Link
                href="/dashboard/student/level"
                className="rounded-[15px] border border-white/10 bg-white/5 px-4 py-2.5 text-[9px] font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                Level details
              </Link>
            </div>
          </div>

          {/* Level Orb */}
          <div className="relative flex justify-center">

            <div className="relative flex h-56 w-56 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] shadow-[inset_0_0_60px_rgba(255,255,255,0.03)]">

              <div className="absolute inset-5 rounded-full border border-white/10" />

              <div className="absolute inset-10 rounded-full bg-blue-500/10 blur-2xl" />

              <div className="relative text-center">
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/30">
                  Current
                </p>

                <p className="mt-2 text-6xl font-semibold tracking-[-0.08em]">
                  01
                </p>

                <p className="mt-1 text-[10px] text-white/35">
                  {currentXP} XP
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Main XP Stats */}
      <section className="grid gap-3 md:grid-cols-3">

        <div className="rounded-[24px] border border-white/80 bg-white/60 p-5 shadow-[0_12px_35px_rgba(20,30,50,0.04)] backdrop-blur-2xl">

          <p className="text-[9px] uppercase tracking-[0.17em] text-black/30">
            Current XP
          </p>

          <p className="mt-4 text-4xl font-semibold tracking-[-0.06em]">
            {currentXP}
          </p>

          <p className="mt-2 text-[9px] text-black/30">
            Total earned
          </p>

        </div>

        <div className="rounded-[24px] border border-white/80 bg-white/60 p-5 shadow-[0_12px_35px_rgba(20,30,50,0.04)] backdrop-blur-2xl">

          <p className="text-[9px] uppercase tracking-[0.17em] text-black/30">
            Next level
          </p>

          <p className="mt-4 text-4xl font-semibold tracking-[-0.06em]">
            {nextLevel}
          </p>

          <p className="mt-2 text-[9px] text-black/30">
            {remaining} XP remaining
          </p>

        </div>

        <div className="rounded-[24px] bg-black p-5 text-white shadow-[0_18px_50px_rgba(0,0,0,0.12)]">

          <p className="text-[9px] uppercase tracking-[0.17em] text-white/30">
            Completion
          </p>

          <p className="mt-4 text-4xl font-semibold tracking-[-0.06em]">
            {progress}%
          </p>

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-white transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>

        </div>

      </section>

      {/* Progress Card */}
      <section className="rounded-[30px] border border-white/80 bg-white/60 p-6 shadow-[0_15px_50px_rgba(20,30,50,0.05)] backdrop-blur-2xl md:p-8">

        <div className="flex items-end justify-between gap-4">

          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-black/30">
              Current journey
            </p>

            <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em]">
              Level 01 → Level 02
            </h2>
          </div>

          <span className="text-[10px] font-semibold text-black/40">
            {currentXP} / {nextLevel} XP
          </span>

        </div>

        <div className="mt-7 h-3 overflow-hidden rounded-full bg-black/[0.06]">

          <div
            className="relative h-full rounded-full bg-black transition-all duration-1000"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,.8)]" />
          </div>

        </div>

        <div className="mt-4 flex items-center justify-between text-[9px] text-black/30">
          <span>Level 01</span>
          <span>{remaining} XP to Level 02</span>
          <span>100 XP</span>
        </div>

      </section>

      {/* XP Sources + Milestones */}
      <section className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">

        {/* Activity */}
        <div className="rounded-[30px] border border-white/80 bg-white/60 p-6 shadow-[0_15px_50px_rgba(20,30,50,0.05)] backdrop-blur-2xl">

          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-black/30">
              XP history
            </p>

            <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em]">
              Where your XP comes from
            </h2>
          </div>

          <div className="mt-6 space-y-2">

            {xpSources.map((source) => (
              <div
                key={source.title}
                className="flex items-center gap-4 rounded-[20px] bg-black/[0.025] p-4 transition hover:bg-black/[0.045]"
              >

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-white text-sm shadow-sm">
                  {source.icon}
                </div>

                <div className="min-w-0 flex-1">

                  <p className="text-[10px] font-semibold">
                    {source.title}
                  </p>

                  <p className="mt-1 truncate text-[9px] text-black/30">
                    {source.detail}
                  </p>

                </div>

                <div className="text-right">
                  <p className="text-[10px] font-semibold">
                    {source.xp}
                  </p>

                  <p className="mt-1 text-[8px] text-black/25">
                    {source.time}
                  </p>
                </div>

              </div>
            ))}

          </div>

        </div>

        {/* Milestones */}
        <div className="rounded-[30px] border border-white/80 bg-white/60 p-6 shadow-[0_15px_50px_rgba(20,30,50,0.05)] backdrop-blur-2xl">

          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-black/30">
              Milestones
            </p>

            <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em]">
              Level roadmap
            </h2>
          </div>

          <div className="mt-6 space-y-2">

            {milestones.map((milestone, index) => {
              const reached = currentXP >= milestone.xp;

              return (
                <div
                  key={milestone.level}
                  className="relative flex items-center gap-3 rounded-[19px] bg-black/[0.025] p-3.5"
                >

                  <div
                    className={
                      reached
                        ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-black text-[9px] font-semibold text-white"
                        : "flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-black/[0.05] text-[9px] font-semibold text-black/25"
                    }
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-[10px] font-semibold">
                      {milestone.level}
                    </p>

                    <p className="mt-1 text-[8px] text-black/30">
                      {milestone.label}
                    </p>

                  </div>

                  <div className="text-right">
                    <p className="text-[9px] font-semibold">
                      {milestone.xp} XP
                    </p>

                    <p className="mt-1 text-[8px] text-black/25">
                      {reached ? "Reached" : "Locked"}
                    </p>
                  </div>

                </div>
              );
            })}

          </div>

        </div>

      </section>

      {/* How to earn */}
      <section className="rounded-[30px] bg-black p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.12)] md:p-8">

        <div className="grid gap-7 md:grid-cols-[1fr_auto] md:items-center">

          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/30">
              Keep progressing
            </p>

            <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em]">
              XP is earned by doing.
            </h2>

            <p className="mt-2 max-w-xl text-[10px] leading-5 text-white/35">
              Complete achievements, build projects, learn new skills,
              participate in competitions and contribute to ATTL.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/dashboard/projects/create"
              className="rounded-[15px] bg-white px-4 py-2.5 text-[9px] font-semibold text-black"
            >
              Start a project
            </Link>

            <Link
              href="/dashboard/learning/explore"
              className="rounded-[15px] border border-white/10 bg-white/5 px-4 py-2.5 text-[9px] font-semibold text-white/70"
            >
              Explore learning
            </Link>
          </div>

        </div>

      </section>

    </div>
  );
}
