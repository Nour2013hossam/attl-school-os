"use client";

import Link from "next/link";

const milestones = [
  {
    date: "Today",
    category: "School OS",
    title: "Joined ATTL School OS",
    description:
      "Your digital student journey has started. This workspace will grow with everything you learn and build.",
    status: "current",
    icon: "✦",
  },
  {
    date: "Next",
    category: "Profile",
    title: "Complete your student identity",
    description:
      "Add your interests, skills and portfolio to make your profile more complete.",
    status: "upcoming",
    icon: "◎",
  },
  {
    date: "Next",
    category: "Learning",
    title: "Start your first learning path",
    description:
      "Explore courses, resources and roadmaps that match your interests.",
    status: "upcoming",
    icon: "◇",
  },
  {
    date: "Next",
    category: "Projects",
    title: "Build your first project",
    description:
      "Turn an idea into something real and start building your portfolio.",
    status: "upcoming",
    icon: "▣",
  },
  {
    date: "Next",
    category: "ATTL",
    title: "Explore ATTL opportunities",
    description:
      "Discover tracks, workshops, events and opportunities to contribute.",
    status: "upcoming",
    icon: "△",
  },
];

const categories = [
  "All",
  "School OS",
  "Profile",
  "Learning",
  "Projects",
  "ATTL",
];

export default function StudentTimelinePage() {
  return (
    <div className="space-y-6">

      {/* Hero */}
      <section className="relative overflow-hidden rounded-[32px] bg-black p-6 text-white shadow-[0_25px_80px_rgba(0,0,0,0.12)] md:p-8">

        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/25 blur-[90px]" />
        <div className="absolute bottom-[-100px] left-1/3 h-64 w-64 rounded-full bg-cyan-400/10 blur-[90px]" />

        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-white/45">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              Student Journey
            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-[-0.05em] md:text-4xl">
              Your timeline.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
              A chronological view of your progress, milestones, projects,
              achievements and important moments.
            </p>
          </div>

          <div className="rounded-[22px] border border-white/10 bg-white/[0.06] p-5">
            <p className="text-[9px] uppercase tracking-[0.18em] text-white/30">
              Journey progress
            </p>

            <p className="mt-2 text-3xl font-semibold tracking-[-0.05em]">
              1
            </p>

            <p className="mt-1 text-[10px] text-white/30">
              milestone completed
            </p>
          </div>

        </div>
      </section>

      {/* Filters */}
      <section className="overflow-x-auto rounded-[24px] border border-white/80 bg-white/60 p-2 shadow-[0_12px_35px_rgba(20,30,50,0.04)] backdrop-blur-2xl">
        <div className="flex min-w-max gap-1">
          {categories.map((category, index) => (
            <button
              key={category}
              type="button"
              className={
                index === 0
                  ? "rounded-[16px] bg-black px-4 py-2.5 text-[9px] font-semibold text-white"
                  : "rounded-[16px] px-4 py-2.5 text-[9px] font-medium text-black/35 transition hover:bg-black/[0.04] hover:text-black"
              }
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="rounded-[30px] border border-white/80 bg-white/60 p-5 shadow-[0_15px_50px_rgba(20,30,50,0.05)] backdrop-blur-2xl md:p-8">

        <div className="mb-8">
          <p className="text-[9px] uppercase tracking-[0.2em] text-black/30">
            Journey history
          </p>

          <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em]">
            Milestones
          </h2>
        </div>

        <div className="relative">

          {/* Vertical line */}
          <div className="absolute bottom-4 left-[19px] top-4 w-px bg-black/[0.07] md:left-[23px]" />

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.title}
                className="relative grid grid-cols-[40px_1fr] gap-4 md:grid-cols-[48px_1fr] md:gap-5"
              >

                {/* Node */}
                <div className="relative z-10">
                  <div
                    className={
                      milestone.status === "current"
                        ? "flex h-10 w-10 items-center justify-center rounded-full bg-black text-xs text-white shadow-lg ring-4 ring-white md:h-12 md:w-12"
                        : "flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-xs text-black/25 ring-4 ring-white md:h-12 md:w-12"
                    }
                  >
                    {milestone.icon}
                  </div>
                </div>

                {/* Content */}
                <div
                  className={
                    milestone.status === "current"
                      ? "rounded-[23px] border border-black/10 bg-white p-5 shadow-[0_12px_35px_rgba(20,30,50,0.06)]"
                      : "rounded-[23px] border border-black/[0.05] bg-black/[0.018] p-5"
                  }
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[8px] font-semibold uppercase tracking-[0.18em] text-black/30">
                          {milestone.category}
                        </span>

                        {milestone.status === "current" && (
                          <span className="rounded-full bg-blue-500/10 px-2 py-1 text-[8px] font-semibold text-blue-600">
                            Current
                          </span>
                        )}
                      </div>

                      <h3 className="mt-2 text-sm font-semibold">
                        {milestone.title}
                      </h3>

                      <p className="mt-2 max-w-2xl text-[10px] leading-5 text-black/40">
                        {milestone.description}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-black/[0.035] px-3 py-1.5 text-[8px] text-black/30">
                      {milestone.date}
                    </span>
                  </div>

                  {index === 0 && (
                    <Link
                      href="/dashboard/student/profile"
                      className="mt-5 inline-flex rounded-[14px] bg-black px-4 py-2.5 text-[9px] font-semibold text-white transition hover:-translate-y-0.5"
                    >
                      Continue your journey →
                    </Link>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey modules */}
      <section className="grid gap-3 md:grid-cols-3">

        <Link
          href="/dashboard/student/activity"
          className="group rounded-[25px] border border-white/80 bg-white/60 p-5 shadow-[0_12px_35px_rgba(20,30,50,0.04)] backdrop-blur-2xl transition hover:-translate-y-1 hover:bg-white/85"
        >
          <p className="text-[9px] uppercase tracking-[0.18em] text-black/30">
            Activity
          </p>

          <h3 className="mt-2 text-sm font-semibold">
            Recent activity
          </h3>

          <p className="mt-2 text-[10px] leading-5 text-black/35">
            See what has happened across your School OS.
          </p>

          <span className="mt-4 block text-[9px] text-black/30 group-hover:text-blue-600">
            Open activity →
          </span>
        </Link>

        <Link
          href="/dashboard/student/achievements"
          className="group rounded-[25px] border border-white/80 bg-white/60 p-5 shadow-[0_12px_35px_rgba(20,30,50,0.04)] backdrop-blur-2xl transition hover:-translate-y-1 hover:bg-white/85"
        >
          <p className="text-[9px] uppercase tracking-[0.18em] text-black/30">
            Achievements
          </p>

          <h3 className="mt-2 text-sm font-semibold">
            Your achievements
          </h3>

          <p className="mt-2 text-[10px] leading-5 text-black/35">
            Milestones and accomplishments will appear here.
          </p>

          <span className="mt-4 block text-[9px] text-black/30 group-hover:text-blue-600">
            View achievements →
          </span>
        </Link>

        <Link
          href="/dashboard/student/goals"
          className="group rounded-[25px] border border-white/80 bg-white/60 p-5 shadow-[0_12px_35px_rgba(20,30,50,0.04)] backdrop-blur-2xl transition hover:-translate-y-1 hover:bg-white/85"
        >
          <p className="text-[9px] uppercase tracking-[0.18em] text-black/30">
            Goals
          </p>

          <h3 className="mt-2 text-sm font-semibold">
            What&apos;s next?
          </h3>

          <p className="mt-2 text-[10px] leading-5 text-black/35">
            Set goals and turn your next steps into progress.
          </p>

          <span className="mt-4 block text-[9px] text-black/30 group-hover:text-blue-600">
            Manage goals →
          </span>
        </Link>

      </section>

    </div>
  );
}
