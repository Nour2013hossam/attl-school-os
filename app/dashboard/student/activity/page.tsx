"use client";

import Link from "next/link";
import { useState } from "react";

const filters = [
  "All activity",
  "Academic",
  "Learning",
  "Projects",
  "Competitions",
  "ATTL",
  "Achievements",
];

const activities = [
  {
    category: "School OS",
    title: "Joined ATTL School OS",
    description: "Your student workspace was created.",
    time: "Today",
    icon: "✦",
    tone: "dark",
    href: "/dashboard",
  },
  {
    category: "Profile",
    title: "Student profile created",
    description: "Your initial student profile is ready to personalize.",
    time: "Today",
    icon: "◎",
    tone: "blue",
    href: "/dashboard/student/profile",
  },
  {
    category: "Academic",
    title: "Academic workspace ready",
    description: "Subjects, grades, schedule and academic tools are available.",
    time: "Today",
    icon: "▤",
    tone: "light",
    href: "/dashboard/academics/overview",
  },
  {
    category: "Learning",
    title: "Learning workspace opened",
    description: "Explore courses, resources and learning roadmaps.",
    time: "Today",
    icon: "◇",
    tone: "light",
    href: "/dashboard/learning/explore",
  },
  {
    category: "Projects",
    title: "Project workspace ready",
    description: "You can now create and manage your projects.",
    time: "Today",
    icon: "▣",
    tone: "light",
    href: "/dashboard/projects/all",
  },
  {
    category: "Competitions",
    title: "Competition hub available",
    description: "Discover competitions and opportunities.",
    time: "Today",
    icon: "△",
    tone: "light",
    href: "/dashboard/competitions/explore",
  },
  {
    category: "ATTL",
    title: "ATTL opportunities available",
    description: "Explore tracks, applications, events and workshops.",
    time: "Today",
    icon: "✧",
    tone: "light",
    href: "/dashboard/attl/overview",
  },
];

const summary = [
  { label: "Today", value: "7" },
  { label: "This week", value: "7" },
  { label: "XP earned", value: "0" },
  { label: "Achievements", value: "0" },
];

export default function StudentActivityPage() {
  const [activeFilter, setActiveFilter] = useState("All activity");

  const filteredActivities =
    activeFilter === "All activity"
      ? activities
      : activities.filter((activity) => activity.category === activeFilter);

  return (
    <div className="space-y-6">

      {/* Hero */}
      <section className="relative overflow-hidden rounded-[32px] bg-black p-6 text-white shadow-[0_25px_80px_rgba(0,0,0,0.12)] md:p-8">

        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/25 blur-[90px]" />
        <div className="absolute bottom-[-100px] left-1/3 h-64 w-64 rounded-full bg-cyan-400/10 blur-[90px]" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-white/45">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            Activity Center
          </div>

          <div className="mt-5 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

            <div>
              <h1 className="text-3xl font-semibold tracking-[-0.05em] md:text-4xl">
                Everything you do.
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
                A unified activity stream for your academic, learning,
                project and ATTL journey.
              </p>
            </div>

            <Link
              href="/dashboard/student/timeline"
              className="rounded-[16px] border border-white/10 bg-white/[0.06] px-5 py-3 text-center text-[10px] font-semibold text-white transition hover:bg-white/10"
            >
              Open Timeline →
            </Link>

          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {summary.map((item) => (
          <div
            key={item.label}
            className="rounded-[23px] border border-white/80 bg-white/60 p-5 shadow-[0_12px_35px_rgba(20,30,50,0.04)] backdrop-blur-2xl"
          >
            <p className="text-[9px] uppercase tracking-[0.17em] text-black/30">
              {item.label}
            </p>

            <p className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
              {item.value}
            </p>
          </div>
        ))}
      </section>

      {/* Filters */}
      <section className="overflow-x-auto rounded-[24px] border border-white/80 bg-white/60 p-2 shadow-[0_12px_35px_rgba(20,30,50,0.04)] backdrop-blur-2xl">

        <div className="flex min-w-max gap-1">
          {filters.map((filter) => {
            const active = activeFilter === filter;

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={
                  active
                    ? "rounded-[16px] bg-black px-4 py-2.5 text-[9px] font-semibold text-white shadow-sm"
                    : "rounded-[16px] px-4 py-2.5 text-[9px] font-medium text-black/35 transition hover:bg-black/[0.04] hover:text-black"
                }
              >
                {filter}
              </button>
            );
          })}
        </div>

      </section>

      {/* Activity stream */}
      <section className="rounded-[30px] border border-white/80 bg-white/60 p-5 shadow-[0_15px_50px_rgba(20,30,50,0.05)] backdrop-blur-2xl md:p-8">

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-black/30">
              Live stream
            </p>

            <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em]">
              Recent activity
            </h2>
          </div>

          <span className="rounded-full bg-blue-500/10 px-3 py-1.5 text-[8px] font-semibold text-blue-600">
            {filteredActivities.length} activities
          </span>
        </div>

        <div className="mt-7 divide-y divide-black/[0.05]">
          {filteredActivities.map((activity, index) => (
            <Link
              key={`${activity.category}-${activity.title}`}
              href={activity.href}
              className="group flex gap-4 py-5 first:pt-0 last:pb-0"
            >

              <div className="relative shrink-0">
                <div
                  className={
                    activity.tone === "dark"
                      ? "flex h-11 w-11 items-center justify-center rounded-[15px] bg-black text-sm text-white shadow-lg"
                      : activity.tone === "blue"
                        ? "flex h-11 w-11 items-center justify-center rounded-[15px] bg-blue-500/10 text-sm text-blue-600"
                        : "flex h-11 w-11 items-center justify-center rounded-[15px] bg-black/[0.04] text-sm text-black/45"
                  }
                >
                  {activity.icon}
                </div>

                {index !== filteredActivities.length - 1 && (
                  <div className="absolute left-1/2 top-12 h-[calc(100%+1rem)] w-px -translate-x-1/2 bg-black/[0.06]" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[8px] font-semibold uppercase tracking-[0.18em] text-black/30">
                        {activity.category}
                      </span>

                      <span className="h-1 w-1 rounded-full bg-black/15" />

                      <span className="text-[8px] text-black/25">
                        {activity.time}
                      </span>
                    </div>

                    <h3 className="mt-2 text-sm font-semibold transition-colors group-hover:text-blue-600">
                      {activity.title}
                    </h3>

                    <p className="mt-1 max-w-2xl text-[10px] leading-5 text-black/40">
                      {activity.description}
                    </p>
                  </div>

                  <span className="hidden text-black/20 transition-transform group-hover:translate-x-1 sm:block">
                    →
                  </span>
                </div>
              </div>

            </Link>
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="mt-6 rounded-[22px] bg-black/[0.025] p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
              ◌
            </div>

            <h3 className="mt-4 text-sm font-semibold">
              Nothing here yet
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-[10px] leading-5 text-black/35">
              Activity in this category will appear here as you use the
              School OS.
            </p>
          </div>
        )}

      </section>

      {/* Activity sources */}
      <section className="grid gap-3 md:grid-cols-3">

        <Link
          href="/dashboard/academics/overview"
          className="group rounded-[25px] border border-white/80 bg-white/60 p-5 shadow-[0_12px_35px_rgba(20,30,50,0.04)] backdrop-blur-2xl transition hover:-translate-y-1 hover:bg-white/85"
        >
          <span className="text-lg">▤</span>

          <h3 className="mt-4 text-sm font-semibold">
            Academic activity
          </h3>

          <p className="mt-2 text-[10px] leading-5 text-black/35">
            Grades, attendance, assignments and exams.
          </p>

          <span className="mt-4 block text-[9px] text-black/30 group-hover:text-blue-600">
            Open academics →
          </span>
        </Link>

        <Link
          href="/dashboard/projects/my-projects"
          className="group rounded-[25px] border border-white/80 bg-white/60 p-5 shadow-[0_12px_35px_rgba(20,30,50,0.04)] backdrop-blur-2xl transition hover:-translate-y-1 hover:bg-white/85"
        >
          <span className="text-lg">▣</span>

          <h3 className="mt-4 text-sm font-semibold">
            Project activity
          </h3>

          <p className="mt-2 text-[10px] leading-5 text-black/35">
            Projects, tasks, milestones and submissions.
          </p>

          <span className="mt-4 block text-[9px] text-black/30 group-hover:text-blue-600">
            Open projects →
          </span>
        </Link>

        <Link
          href="/dashboard/attl/overview"
          className="group rounded-[25px] border border-white/80 bg-white/60 p-5 shadow-[0_12px_35px_rgba(20,30,50,0.04)] backdrop-blur-2xl transition hover:-translate-y-1 hover:bg-white/85"
        >
          <span className="text-lg">✦</span>

          <h3 className="mt-4 text-sm font-semibold">
            ATTL activity
          </h3>

          <p className="mt-2 text-[10px] leading-5 text-black/35">
            Applications, workshops, events and team activity.
          </p>

          <span className="mt-4 block text-[9px] text-black/30 group-hover:text-blue-600">
            Open ATTL →
          </span>
        </Link>

      </section>

    </div>
  );
}
