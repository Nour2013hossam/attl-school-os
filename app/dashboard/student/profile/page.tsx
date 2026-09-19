"use client";

import Link from "next/link";

const profileStats = [
  { label: "Level", value: "01", href: "/dashboard/student/level" },
  { label: "XP", value: "0", href: "/dashboard/student/xp" },
  { label: "Projects", value: "0", href: "/dashboard/projects/my-projects" },
  { label: "Achievements", value: "0", href: "/dashboard/student/achievements" },
];

const profileSections = [
  {
    title: "Identity",
    description: "Your school identity, basic information and profile details.",
    href: "/dashboard/student/identity",
    icon: "◎",
  },
  {
    title: "Interests",
    description: "Areas you care about and want to explore.",
    href: "/dashboard/student/interests",
    icon: "✦",
  },
  {
    title: "Skills",
    description: "Technical and soft skills you're developing.",
    href: "/dashboard/skills/my-skills",
    icon: "◇",
  },
  {
    title: "Portfolio",
    description: "Showcase your projects, achievements and work.",
    href: "/dashboard/student/portfolio",
    icon: "▣",
  },
];

export default function StudentProfilePage() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <section className="relative overflow-hidden rounded-[32px] border border-white/80 bg-white/65 p-6 shadow-[0_25px_70px_rgba(20,30,50,0.07)] backdrop-blur-2xl md:p-8">

        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-400/15 blur-[90px]" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-5">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[28px] bg-black text-2xl font-semibold text-white shadow-xl">
              A
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-[-0.05em]">
                  Student Profile
                </h1>

                <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.15em] text-blue-600">
                  Level 01
                </span>
              </div>

              <p className="mt-2 text-sm text-black/40">
                Your personal space inside ATTL School OS.
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-black/[0.035] px-3 py-1.5 text-[9px] text-black/40">
                  Student
                </span>

                <span className="rounded-full bg-black/[0.035] px-3 py-1.5 text-[9px] text-black/40">
                  ATTL School OS
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/dashboard/settings/account"
            className="rounded-[16px] bg-black px-5 py-3 text-center text-[10px] font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Edit Profile
          </Link>

        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {profileStats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-[23px] border border-white/80 bg-white/60 p-5 shadow-[0_12px_35px_rgba(20,30,50,0.04)] backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:bg-white/85"
          >
            <p className="text-[9px] uppercase tracking-[0.18em] text-black/30">
              {stat.label}
            </p>

            <p className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
              {stat.value}
            </p>

            <p className="mt-2 text-[9px] text-black/30 group-hover:text-blue-600">
              Open →
            </p>
          </Link>
        ))}
      </section>

      {/* Profile completion */}
      <section className="grid gap-4 lg:grid-cols-[1fr_320px]">

        <div className="rounded-[28px] border border-white/80 bg-white/60 p-6 shadow-[0_15px_45px_rgba(20,30,50,0.05)] backdrop-blur-2xl">

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-black/30">
                Profile
              </p>

              <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em]">
                Complete your identity
              </h2>

              <p className="mt-2 max-w-lg text-[11px] leading-5 text-black/40">
                A complete profile helps your School OS personalize your
                academic, learning and development experience.
              </p>
            </div>

            <span className="text-2xl font-semibold tracking-[-0.05em]">
              20%
            </span>
          </div>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-black/[0.06]">
            <div className="h-full w-[20%] rounded-full bg-black" />
          </div>

          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            {[
              ["Basic identity", true],
              ["Interests", false],
              ["Skills", false],
              ["Portfolio", false],
            ].map(([label, complete]) => (
              <div
                key={String(label)}
                className="flex items-center justify-between rounded-[17px] bg-black/[0.025] px-4 py-3"
              >
                <span className="text-[10px] font-medium">
                  {String(label)}
                </span>

                <span
                  className={
                    complete
                      ? "text-[10px] font-semibold text-blue-600"
                      : "text-[10px] text-black/25"
                  }
                >
                  {complete ? "Complete" : "Not started"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* XP card */}
        <div className="relative overflow-hidden rounded-[28px] bg-black p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.12)]">

          <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-blue-500/25 blur-[50px]" />

          <div className="relative">
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/30">
              Progress
            </p>

            <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em]">
              Level 01
            </h2>

            <p className="mt-2 text-[10px] leading-5 text-white/35">
              Keep learning and building to earn XP.
            </p>

            <div className="mt-7">
              <div className="flex justify-between text-[9px] text-white/30">
                <span>0 XP</span>
                <span>100 XP</span>
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[4%] rounded-full bg-white" />
              </div>
            </div>

            <Link
              href="/dashboard/student/xp"
              className="mt-7 flex items-center justify-between rounded-[16px] bg-white px-4 py-3 text-[10px] font-semibold text-black transition hover:bg-white/90"
            >
              View XP
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Profile modules */}
      <section>
        <div className="mb-4 px-1">
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-black/30">
            Profile Workspace
          </p>

          <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em]">
            Explore your profile
          </h2>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {profileSections.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className="group relative overflow-hidden rounded-[25px] border border-white/80 bg-white/60 p-5 shadow-[0_12px_35px_rgba(20,30,50,0.04)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/85"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-black text-white shadow-lg">
                  {section.icon}
                </div>

                <span className="text-black/20 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-blue-600">
                  →
                </span>
              </div>

              <h3 className="mt-5 text-sm font-semibold">
                {section.title}
              </h3>

              <p className="mt-2 max-w-md text-[10px] leading-5 text-black/40">
                {section.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Timeline preview */}
      <section className="rounded-[28px] border border-white/80 bg-white/60 p-6 shadow-[0_15px_45px_rgba(20,30,50,0.05)] backdrop-blur-2xl">

        <div className="flex items-center justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-black/30">
              Journey
            </p>

            <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em]">
              Your School OS journey
            </h2>
          </div>

          <Link
            href="/dashboard/student/timeline"
            className="rounded-full bg-black/[0.035] px-3 py-2 text-[9px] text-black/40 transition hover:bg-black hover:text-white"
          >
            View timeline
          </Link>
        </div>

        <div className="mt-6 flex items-center gap-3 overflow-x-auto pb-2">
          {[
            ["01", "Joined School OS"],
            ["02", "Complete profile"],
            ["03", "Build a project"],
            ["04", "Join ATTL"],
          ].map(([number, title], index) => (
            <div
              key={number}
              className="flex min-w-[180px] items-center gap-3 rounded-[18px] bg-black/[0.025] p-3"
            >
              <div
                className={
                  index === 0
                    ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-[9px] font-semibold text-white"
                    : "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/10 text-[9px] font-semibold text-black/30"
                }
              >
                {number}
              </div>

              <span className="text-[10px] font-medium text-black/55">
                {title}
              </span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
