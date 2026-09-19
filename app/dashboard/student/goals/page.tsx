"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const filters = ["All", "Active", "Completed", "Overdue"];

const goals = [
  {
    title: "Complete my student profile",
    category: "Personal",
    priority: "High",
    progress: 65,
    deadline: "Sep 22",
    xp: 50,
    status: "Active",
    icon: "◎",
  },
  {
    title: "Start my first project",
    category: "Projects",
    priority: "High",
    progress: 20,
    deadline: "Sep 30",
    xp: 100,
    status: "Active",
    icon: "▣",
  },
  {
    title: "Complete a learning course",
    category: "Learning",
    priority: "Medium",
    progress: 40,
    deadline: "Oct 05",
    xp: 75,
    status: "Active",
    icon: "◇",
  },
  {
    title: "Join an ATTL activity",
    category: "ATTL",
    priority: "Medium",
    progress: 100,
    deadline: "Sep 10",
    xp: 50,
    status: "Completed",
    icon: "✦",
  },
  {
    title: "Build two new skills",
    category: "Skills",
    priority: "Medium",
    progress: 0,
    deadline: "Oct 15",
    xp: 100,
    status: "Active",
    icon: "◈",
  },
  {
    title: "Apply to a competition",
    category: "Competitions",
    priority: "High",
    progress: 0,
    deadline: "Sep 12",
    xp: 100,
    status: "Overdue",
    icon: "△",
  },
];

const milestones = [
  {
    title: "Profile Foundation",
    description: "Complete the essential parts of your profile.",
    progress: 65,
  },
  {
    title: "First Builder",
    description: "Create and progress your first project.",
    progress: 20,
  },
  {
    title: "Learning Streak",
    description: "Complete your first learning milestone.",
    progress: 40,
  },
];

export default function StudentGoalsPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredGoals = useMemo(() => {
    if (activeFilter === "All") return goals;

    return goals.filter((goal) => goal.status === activeFilter);
  }, [activeFilter]);

  const activeCount = goals.filter((goal) => goal.status === "Active").length;
  const completedCount = goals.filter(
    (goal) => goal.status === "Completed"
  ).length;
  const overdueCount = goals.filter(
    (goal) => goal.status === "Overdue"
  ).length;

  const totalProgress = Math.round(
    goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length
  );

  return (
    <div className="space-y-6">

      {/* Hero */}
      <section className="relative overflow-hidden rounded-[32px] bg-black p-6 text-white shadow-[0_25px_80px_rgba(0,0,0,0.12)] md:p-8">

        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/25 blur-[100px]" />
        <div className="absolute bottom-[-130px] left-[30%] h-72 w-72 rounded-full bg-cyan-400/10 blur-[100px]" />

        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-white/45">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              Personal Goals
            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-[-0.06em] md:text-5xl">
              Build toward something.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
              Turn your ideas into measurable goals and keep your progress
              visible across the School OS.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-[15px] bg-white px-4 py-2.5 text-[9px] font-semibold text-black transition hover:bg-white/90"
              >
                + Create goal
              </button>

              <Link
                href="/dashboard/student/xp"
                className="rounded-[15px] border border-white/10 bg-white/5 px-4 py-2.5 text-[9px] font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                View XP
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">

            <div className="rounded-[21px] border border-white/10 bg-white/[0.06] p-5">
              <p className="text-[8px] uppercase tracking-[0.18em] text-white/30">
                Overall progress
              </p>

              <p className="mt-3 text-3xl font-semibold tracking-[-0.06em]">
                {totalProgress}%
              </p>
            </div>

            <div className="rounded-[21px] border border-white/10 bg-white/[0.06] p-5">
              <p className="text-[8px] uppercase tracking-[0.18em] text-white/30">
                Active goals
              </p>

              <p className="mt-3 text-3xl font-semibold tracking-[-0.06em]">
                {activeCount}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-[23px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl">
          <p className="text-[8px] uppercase tracking-[0.18em] text-black/30">
            Active
          </p>

          <p className="mt-4 text-3xl font-semibold tracking-[-0.06em]">
            {activeCount}
          </p>

          <p className="mt-1 text-[8px] text-black/25">
            Goals in progress
          </p>
        </div>

        <div className="rounded-[23px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl">
          <p className="text-[8px] uppercase tracking-[0.18em] text-black/30">
            Completed
          </p>

          <p className="mt-4 text-3xl font-semibold tracking-[-0.06em]">
            {completedCount}
          </p>

          <p className="mt-1 text-[8px] text-black/25">
            Finished goals
          </p>
        </div>

        <div className="rounded-[23px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl">
          <p className="text-[8px] uppercase tracking-[0.18em] text-black/30">
            Overdue
          </p>

          <p className="mt-4 text-3xl font-semibold tracking-[-0.06em]">
            {overdueCount}
          </p>

          <p className="mt-1 text-[8px] text-black/25">
            Need attention
          </p>
        </div>

        <div className="rounded-[23px] bg-black p-5 text-white">
          <p className="text-[8px] uppercase tracking-[0.18em] text-white/30">
            XP available
          </p>

          <p className="mt-4 text-3xl font-semibold tracking-[-0.06em]">
            475
          </p>

          <p className="mt-1 text-[8px] text-white/30">
            From current goals
          </p>
        </div>

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
                    ? "rounded-[16px] bg-black px-4 py-2.5 text-[9px] font-semibold text-white"
                    : "rounded-[16px] px-4 py-2.5 text-[9px] text-black/35 transition hover:bg-black/[0.04] hover:text-black"
                }
              >
                {filter}
              </button>
            );
          })}
        </div>

      </section>

      {/* Goal List */}
      <section className="rounded-[30px] border border-white/80 bg-white/60 p-5 shadow-[0_15px_50px_rgba(20,30,50,0.05)] backdrop-blur-2xl md:p-8">

        <div className="flex items-start justify-between gap-4">

          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-black/30">
              Goal board
            </p>

            <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em]">
              Your goals
            </h2>
          </div>

          <span className="rounded-full bg-black/[0.035] px-3 py-1.5 text-[8px] text-black/35">
            {filteredGoals.length} shown
          </span>

        </div>

        <div className="mt-7 grid gap-3 lg:grid-cols-2">

          {filteredGoals.map((goal) => {

            const isCompleted = goal.status === "Completed";
            const isOverdue = goal.status === "Overdue";

            return (
              <div
                key={goal.title}
                className={
                  isCompleted
                    ? "rounded-[25px] border border-black/10 bg-white p-5"
                    : isOverdue
                      ? "rounded-[25px] border border-red-500/10 bg-red-500/[0.025] p-5"
                      : "rounded-[25px] border border-black/[0.05] bg-black/[0.018] p-5"
                }
              >

                <div className="flex items-start gap-4">

                  <div
                    className={
                      isCompleted
                        ? "flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-black text-white"
                        : "flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-white text-black shadow-sm"
                    }
                  >
                    {goal.icon}
                  </div>

                  <div className="min-w-0 flex-1">

                    <div className="flex items-start justify-between gap-3">

                      <div>
                        <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-black/30">
                          {goal.category}
                        </p>

                        <h3 className="mt-1 text-sm font-semibold">
                          {goal.title}
                        </h3>
                      </div>

                      <span
                        className={
                          isCompleted
                            ? "rounded-full bg-blue-500/10 px-2.5 py-1 text-[8px] font-semibold text-blue-600"
                            : isOverdue
                              ? "rounded-full bg-red-500/10 px-2.5 py-1 text-[8px] font-semibold text-red-500"
                              : "rounded-full bg-black/[0.04] px-2.5 py-1 text-[8px] text-black/35"
                        }
                      >
                        {goal.status}
                      </span>

                    </div>

                    <div className="mt-5 flex items-center justify-between">

                      <span className="text-[8px] text-black/30">
                        Progress
                      </span>

                      <span className="text-[9px] font-semibold">
                        {goal.progress}%
                      </span>

                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
                      <div
                        className="h-full rounded-full bg-black transition-all duration-700"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">

                      <div className="flex items-center gap-3">
                        <span className="text-[8px] text-black/30">
                          Due {goal.deadline}
                        </span>

                        <span className="h-1 w-1 rounded-full bg-black/15" />

                        <span className="text-[8px] font-medium text-black/40">
                          {goal.priority} priority
                        </span>
                      </div>

                      <span className="text-[9px] font-semibold">
                        +{goal.xp} XP
                      </span>

                    </div>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

        {filteredGoals.length === 0 && (
          <div className="mt-6 rounded-[23px] bg-black/[0.025] p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
              ◌
            </div>

            <h3 className="mt-4 text-sm font-semibold">
              No goals in this view
            </h3>

            <p className="mt-2 text-[10px] text-black/35">
              Create a goal or switch to another filter.
            </p>
          </div>
        )}

      </section>

      {/* Milestones */}
      <section className="rounded-[30px] border border-white/80 bg-white/60 p-6 shadow-[0_15px_50px_rgba(20,30,50,0.05)] backdrop-blur-2xl md:p-8">

        <div>
          <p className="text-[9px] uppercase tracking-[0.2em] text-black/30">
            Milestones
          </p>

          <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em]">
            Bigger objectives
          </h2>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">

          {milestones.map((milestone) => (
            <div
              key={milestone.title}
              className="rounded-[23px] bg-black/[0.025] p-5"
            >

              <div className="flex items-center justify-between gap-3">

                <p className="text-[10px] font-semibold">
                  {milestone.title}
                </p>

                <span className="text-[9px] font-semibold">
                  {milestone.progress}%
                </span>

              </div>

              <p className="mt-2 text-[9px] leading-5 text-black/30">
                {milestone.description}
              </p>

              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
                <div
                  className="h-full rounded-full bg-black transition-all duration-700"
                  style={{ width: `${milestone.progress}%` }}
                />
              </div>

            </div>
          ))}

        </div>

      </section>

      {/* CTA */}
      <section className="rounded-[30px] bg-black p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.12)] md:p-8">

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/30">
              Next step
            </p>

            <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em]">
              Turn a goal into a project.
            </h2>

            <p className="mt-2 max-w-xl text-[10px] leading-5 text-white/35">
              Your goals become more powerful when they connect to real
              projects and measurable milestones.
            </p>
          </div>

          <Link
            href="/dashboard/projects/create"
            className="rounded-[16px] bg-white px-5 py-3 text-center text-[9px] font-semibold text-black transition hover:bg-white/90"
          >
            Create project →
          </Link>

        </div>

      </section>

    </div>
  );
}
