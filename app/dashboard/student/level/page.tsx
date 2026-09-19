"use client";

import Link from "next/link";

const unlocks = [
  {
    level: "Level 01",
    title: "Getting Started",
    description: "Your School OS journey begins.",
    status: "Unlocked",
    icon: "✦",
  },
  {
    level: "Level 02",
    title: "Explorer",
    description: "Unlock deeper learning and discovery features.",
    status: "Locked",
    icon: "◇",
  },
  {
    level: "Level 03",
    title: "Builder",
    description: "Unlock advanced project progression.",
    status: "Locked",
    icon: "▣",
  },
  {
    level: "Level 04",
    title: "Achiever",
    description: "Unlock advanced challenges and recognition.",
    status: "Locked",
    icon: "◈",
  },
];

const requirements = [
  { label: "Complete your profile", progress: 20, target: "80%" },
  { label: "Earn achievements", progress: 12, target: "3 achievements" },
  { label: "Start a project", progress: 0, target: "1 project" },
  { label: "Develop your skills", progress: 0, target: "2 skills" },
];

export default function StudentLevelPage() {
  const currentXP = 25;
  const currentLevel = 1;
  const nextLevelXP = 100;
  const progress = (currentXP / nextLevelXP) * 100;

  return (
    <div className="space-y-6">

      {/* Hero */}
      <section className="relative overflow-hidden rounded-[32px] bg-black p-6 text-white shadow-[0_25px_80px_rgba(0,0,0,0.12)] md:p-8">

        <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-blue-500/25 blur-[100px]" />
        <div className="absolute bottom-[-140px] left-[30%] h-80 w-80 rounded-full bg-cyan-400/10 blur-[100px]" />

        <div className="relative grid gap-8 lg:grid-cols-[1fr_300px] lg:items-center">

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-white/45">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              Level System
            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-[-0.06em] md:text-5xl">
              Level 01.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
              Your level represents your overall progression across the
              School OS.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              <Link
                href="/dashboard/student/xp"
                className="rounded-[15px] bg-white px-4 py-2.5 text-[9px] font-semibold text-black transition hover:bg-white/90"
              >
                View XP
              </Link>

              <Link
                href="/dashboard/student/achievements"
                className="rounded-[15px] border border-white/10 bg-white/5 px-4 py-2.5 text-[9px] font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                Achievements
              </Link>
            </div>
          </div>

          <div className="flex justify-center">

            <div className="relative flex h-56 w-56 items-center justify-center rounded-full border border-white/10 bg-white/[0.035]">

              <div className="absolute inset-4 rounded-full border border-white/[0.07]" />
              <div className="absolute inset-10 rounded-full bg-blue-500/10 blur-2xl" />

              <div className="relative text-center">
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/30">
                  Current level
                </p>

                <p className="mt-2 text-7xl font-semibold tracking-[-0.09em]">
                  01
                </p>

                <p className="mt-1 text-[10px] text-white/35">
                  Getting Started
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-3 md:grid-cols-4">

        <div className="rounded-[23px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl">
          <p className="text-[8px] uppercase tracking-[0.18em] text-black/30">
            Level
          </p>
          <p className="mt-4 text-3xl font-semibold tracking-[-0.06em]">
            01
          </p>
        </div>

        <div className="rounded-[23px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl">
          <p className="text-[8px] uppercase tracking-[0.18em] text-black/30">
            Current XP
          </p>
          <p className="mt-4 text-3xl font-semibold tracking-[-0.06em]">
            25
          </p>
        </div>

        <div className="rounded-[23px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl">
          <p className="text-[8px] uppercase tracking-[0.18em] text-black/30">
            Next Level
          </p>
          <p className="mt-4 text-3xl font-semibold tracking-[-0.06em]">
            100
          </p>
        </div>

        <div className="rounded-[23px] bg-black p-5 text-white">
          <p className="text-[8px] uppercase tracking-[0.18em] text-white/30">
            Progress
          </p>
          <p className="mt-4 text-3xl font-semibold tracking-[-0.06em]">
            {progress}%
          </p>
        </div>

      </section>

      {/* Level Progress */}
      <section className="rounded-[30px] border border-white/80 bg-white/60 p-6 shadow-[0_15px_50px_rgba(20,30,50,0.05)] backdrop-blur-2xl md:p-8">

        <div className="flex items-end justify-between gap-4">

          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-black/30">
              Progression
            </p>

            <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em]">
              Your path to Level 02
            </h2>
          </div>

          <span className="text-[10px] font-semibold text-black/40">
            25 / 100 XP
          </span>

        </div>

        <div className="mt-7 h-3 overflow-hidden rounded-full bg-black/[0.06]">

          <div
            className="relative h-full rounded-full bg-black transition-all duration-1000"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,.9)]" />
          </div>

        </div>

        <div className="mt-4 flex justify-between text-[9px] text-black/30">
          <span>Level 01</span>
          <span>75 XP remaining</span>
          <span>Level 02</span>
        </div>

      </section>

      {/* Requirements */}
      <section className="rounded-[30px] border border-white/80 bg-white/60 p-6 shadow-[0_15px_50px_rgba(20,30,50,0.05)] backdrop-blur-2xl md:p-8">

        <div>
          <p className="text-[9px] uppercase tracking-[0.2em] text-black/30">
            Requirements
          </p>

          <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em]">
            Build toward your next level
          </h2>
        </div>

        <div className="mt-7 grid gap-3 md:grid-cols-2">

          {requirements.map((item) => (
            <div
              key={item.label}
              className="rounded-[22px] bg-black/[0.025] p-5"
            >

              <div className="flex items-center justify-between gap-4">
                <p className="text-[10px] font-semibold">
                  {item.label}
                </p>

                <span className="text-[8px] text-black/30">
                  {item.target}
                </span>
              </div>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
                <div
                  className="h-full rounded-full bg-black transition-all duration-700"
                  style={{ width: `${item.progress}%` }}
                />
              </div>

              <p className="mt-2 text-[8px] text-black/25">
                {item.progress}% complete
              </p>

            </div>
          ))}

        </div>

      </section>

      {/* Unlock Roadmap */}
      <section className="rounded-[30px] border border-white/80 bg-white/60 p-6 shadow-[0_15px_50px_rgba(20,30,50,0.05)] backdrop-blur-2xl md:p-8">

        <div>
          <p className="text-[9px] uppercase tracking-[0.2em] text-black/30">
            Roadmap
          </p>

          <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em]">
            What you unlock
          </h2>
        </div>

        <div className="mt-7 grid gap-3 md:grid-cols-2">

          {unlocks.map((unlock) => {
            const unlocked = unlock.status === "Unlocked";

            return (
              <div
                key={unlock.level}
                className={
                  unlocked
                    ? "rounded-[24px] border border-black/10 bg-white p-5 shadow-[0_10px_30px_rgba(20,30,50,0.05)]"
                    : "rounded-[24px] bg-black/[0.025] p-5"
                }
              >

                <div className="flex items-start gap-4">

                  <div
                    className={
                      unlocked
                        ? "flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-black text-white"
                        : "flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-black/[0.05] text-black/25"
                    }
                  >
                    {unlock.icon}
                  </div>

                  <div className="min-w-0 flex-1">

                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[8px] font-semibold uppercase tracking-[0.17em] text-black/30">
                        {unlock.level}
                      </p>

                      <span
                        className={
                          unlocked
                            ? "rounded-full bg-blue-500/10 px-2 py-1 text-[7px] font-semibold text-blue-600"
                            : "rounded-full bg-black/[0.04] px-2 py-1 text-[7px] text-black/25"
                        }
                      >
                        {unlock.status}
                      </span>
                    </div>

                    <h3 className="mt-2 text-sm font-semibold">
                      {unlock.title}
                    </h3>

                    <p className="mt-1 text-[9px] leading-5 text-black/35">
                      {unlock.description}
                    </p>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </section>

      {/* Next Action */}
      <section className="rounded-[30px] bg-black p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.12)] md:p-8">

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/30">
              Next milestone
            </p>

            <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em]">
              Earn your next 75 XP.
            </h2>

            <p className="mt-2 max-w-xl text-[10px] leading-5 text-white/35">
              Explore projects, learning, skills and competitions to keep
              progressing through the School OS.
            </p>
          </div>

          <Link
            href="/dashboard/projects/all"
            className="rounded-[16px] bg-white px-5 py-3 text-center text-[9px] font-semibold text-black transition hover:bg-white/90"
          >
            Explore projects →
          </Link>

        </div>

      </section>

    </div>
  );
}
