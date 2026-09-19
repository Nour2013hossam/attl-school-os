"use client";

import Link from "next/link";

const stats = [
  {
    label: "Current Level",
    value: "01",
    detail: "4% to Level 02",
    href: "/dashboard/student/level",
  },
  {
    label: "XP",
    value: "0",
    detail: "100 XP to next level",
    href: "/dashboard/student/xp",
  },
  {
    label: "Projects",
    value: "0",
    detail: "Start your first project",
    href: "/dashboard/projects/my-projects",
  },
  {
    label: "Achievements",
    value: "0",
    detail: "Keep building",
    href: "/dashboard/student/achievements",
  },
];

const quickActions = [
  {
    title: "Build a Project",
    description: "Turn an idea into a real project.",
    href: "/dashboard/projects/create",
    icon: "＋",
  },
  {
    title: "Explore Competitions",
    description: "Find opportunities and challenges.",
    href: "/dashboard/competitions/explore",
    icon: "↗",
  },
  {
    title: "Join ATTL",
    description: "Apply to become an ATTL member.",
    href: "/dashboard/attl/applications",
    icon: "✦",
  },
  {
    title: "Develop Skills",
    description: "Track and grow your abilities.",
    href: "/dashboard/skills/skill-map",
    icon: "◈",
  },
];

const activities = [
  {
    title: "Your ATTL journey starts here",
    description: "Complete your profile to personalize your School OS.",
    href: "/dashboard/student/profile",
    time: "Now",
  },
  {
    title: "Explore your academic space",
    description: "View subjects, grades, schedule and upcoming exams.",
    href: "/dashboard/academics/overview",
    time: "Next",
  },
  {
    title: "Discover learning opportunities",
    description: "Explore courses, resources and learning roadmaps.",
    href: "/dashboard/learning/explore",
    time: "Next",
  },
];

export default function DashboardOverview() {
  return (
    <div className="space-y-6">

      {/* Hero */}
      <section className="relative overflow-hidden rounded-[32px] border border-white/80 bg-black p-6 text-white shadow-[0_30px_90px_rgba(20,30,50,0.14)] md:p-8 lg:p-10">

        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/30 blur-[90px]" />
        <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-cyan-400/10 blur-[100px]" />

        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">

          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[9px] uppercase tracking-[0.22em] text-white/50">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,.8)]" />
              ATTL School OS
            </div>

            <h1 className="max-w-3xl text-3xl font-semibold tracking-[-0.05em] md:text-5xl">
              Your school,
              <br />
              <span className="text-white/45">your workspace.</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-white/45">
              One place to manage academics, projects, skills, competitions,
              learning and your ATTL journey.
            </p>
          </div>

          <Link
            href="/dashboard/student/profile"
            className="group flex items-center gap-4 rounded-[22px] border border-white/10 bg-white/[0.07] p-3 transition-all duration-300 hover:bg-white/10"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-white text-sm font-semibold text-black">
              A
            </div>

            <div className="pr-3">
              <p className="text-[9px] uppercase tracking-[0.18em] text-white/35">
                Student
              </p>
              <p className="mt-1 text-sm font-semibold">
                Complete your profile
              </p>
              <p className="mt-1 text-[10px] text-white/35">
                Build your School OS identity
              </p>
            </div>

            <span className="text-white/30 transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>

        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group relative overflow-hidden rounded-[24px] border border-white/80 bg-white/65 p-5 shadow-[0_15px_45px_rgba(20,30,50,0.05)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/85 hover:shadow-[0_20px_55px_rgba(20,30,50,0.09)]"
          >
            <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-blue-400/10 blur-2xl transition-transform duration-500 group-hover:scale-150" />

            <div className="relative">
              <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-black/35">
                {stat.label}
              </p>

              <p className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
                {stat.value}
              </p>

              <p className="mt-2 text-[10px] leading-4 text-black/35">
                {stat.detail}
              </p>
            </div>
          </Link>
        ))}
      </section>

      {/* Quick Actions */}
      <section>
        <div className="mb-3 flex items-end justify-between px-1">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-black/30">
              Quick Actions
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em]">
              Start something
            </h2>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="group relative overflow-hidden rounded-[25px] border border-white/80 bg-white/60 p-5 shadow-[0_12px_35px_rgba(20,30,50,0.04)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/85 hover:shadow-[0_20px_50px_rgba(20,30,50,0.08)]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-black text-lg text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
                {action.icon}
              </div>

              <h3 className="mt-5 text-sm font-semibold">
                {action.title}
              </h3>

              <p className="mt-2 text-[11px] leading-5 text-black/40">
                {action.description}
              </p>

              <span className="mt-5 block text-[10px] font-medium text-black/30 transition-colors group-hover:text-blue-600">
                Open →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Main Grid */}
      <section className="grid gap-4 lg:grid-cols-[1.35fr_.65fr]">

        {/* Activity */}
        <div className="rounded-[28px] border border-white/80 bg-white/60 p-5 shadow-[0_15px_45px_rgba(20,30,50,0.05)] backdrop-blur-2xl md:p-6">

          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-black/30">
                Activity
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em]">
                Your next steps
              </h2>
            </div>

            <Link
              href="/dashboard/student/activity"
              className="rounded-full bg-black/[0.035] px-3 py-2 text-[9px] font-medium text-black/40 transition hover:bg-black hover:text-white"
            >
              View all
            </Link>
          </div>

          <div className="mt-6 divide-y divide-black/[0.05]">
            {activities.map((activity, index) => (
              <Link
                key={activity.title}
                href={activity.href}
                className="group flex gap-4 py-5 first:pt-0 last:pb-0"
              >
                <div className="relative flex w-8 shrink-0 justify-center">
                  <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-black text-[10px] font-semibold text-white">
                    {index + 1}
                  </div>

                  {index !== activities.length - 1 && (
                    <div className="absolute top-10 h-full w-px bg-black/[0.06]" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-semibold group-hover:text-blue-600">
                        {activity.title}
                      </h3>

                      <p className="mt-1 text-[11px] leading-5 text-black/40">
                        {activity.description}
                      </p>
                    </div>

                    <span className="shrink-0 text-[9px] text-black/25">
                      {activity.time}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="rounded-[28px] bg-black p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.12)]">

          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/30">
            Progress
          </p>

          <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em]">
            Build your momentum.
          </h2>

          <p className="mt-3 text-[11px] leading-5 text-white/35">
            Your School OS grows with everything you learn, build and
            accomplish.
          </p>

          <div className="mt-8">
            <div className="flex items-end justify-between">
              <span className="text-[10px] text-white/35">
                Level 01
              </span>

              <span className="text-[10px] text-white/35">
                0 / 100 XP
              </span>
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[4%] rounded-full bg-white" />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-2">
            <Link
              href="/dashboard/student/xp"
              className="rounded-[17px] border border-white/10 bg-white/[0.06] p-4 transition hover:bg-white/10"
            >
              <p className="text-[9px] text-white/30">XP</p>
              <p className="mt-2 text-lg font-semibold">0</p>
            </Link>

            <Link
              href="/dashboard/student/goals"
              className="rounded-[17px] border border-white/10 bg-white/[0.06] p-4 transition hover:bg-white/10"
            >
              <p className="text-[9px] text-white/30">Goals</p>
              <p className="mt-2 text-lg font-semibold">0</p>
            </Link>
          </div>

          <Link
            href="/dashboard/student/goals"
            className="mt-3 flex items-center justify-between rounded-[17px] bg-white px-4 py-3 text-[10px] font-semibold text-black transition hover:bg-white/90"
          >
            Set your first goal
            <span>→</span>
          </Link>

        </div>
      </section>

      {/* Bottom modules */}
      <section className="grid gap-4 md:grid-cols-3">

        <Link
          href="/dashboard/academics/overview"
          className="group rounded-[25px] border border-white/80 bg-white/60 p-5 shadow-[0_12px_35px_rgba(20,30,50,0.04)] backdrop-blur-2xl transition hover:-translate-y-1 hover:bg-white/85"
        >
          <p className="text-[9px] uppercase tracking-[0.18em] text-black/30">
            Academics
          </p>
          <h3 className="mt-2 text-sm font-semibold">
            Academic Overview
          </h3>
          <p className="mt-2 text-[10px] leading-5 text-black/35">
            Grades, subjects, attendance, exams and schedule.
          </p>
          <span className="mt-4 block text-[10px] text-black/30 group-hover:text-blue-600">
            Open academics →
          </span>
        </Link>

        <Link
          href="/dashboard/projects/all"
          className="group rounded-[25px] border border-white/80 bg-white/60 p-5 shadow-[0_12px_35px_rgba(20,30,50,0.04)] backdrop-blur-2xl transition hover:-translate-y-1 hover:bg-white/85"
        >
          <p className="text-[9px] uppercase tracking-[0.18em] text-black/30">
            Projects
          </p>
          <h3 className="mt-2 text-sm font-semibold">
            Project Workspace
          </h3>
          <p className="mt-2 text-[10px] leading-5 text-black/35">
            Build, manage and showcase your work.
          </p>
          <span className="mt-4 block text-[10px] text-black/30 group-hover:text-blue-600">
            Open projects →
          </span>
        </Link>

        <Link
          href="/dashboard/competitions/explore"
          className="group rounded-[25px] border border-white/80 bg-white/60 p-5 shadow-[0_12px_35px_rgba(20,30,50,0.04)] backdrop-blur-2xl transition hover:-translate-y-1 hover:bg-white/85"
        >
          <p className="text-[9px] uppercase tracking-[0.18em] text-black/30">
            Opportunities
          </p>
          <h3 className="mt-2 text-sm font-semibold">
            Competitions & Challenges
          </h3>
          <p className="mt-2 text-[10px] leading-5 text-black/35">
            Discover competitions, challenges and opportunities.
          </p>
          <span className="mt-4 block text-[10px] text-black/30 group-hover:text-blue-600">
            Explore →
          </span>
        </Link>

      </section>
    </div>
  );
}
