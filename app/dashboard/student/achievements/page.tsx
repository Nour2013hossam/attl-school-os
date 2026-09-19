"use client";

import Link from "next/link";
import { useState } from "react";

const filters = [
  "All",
  "Unlocked",
  "In Progress",
  "Locked",
];

const achievements = [
  {
    title: "First Step",
    description: "Enter your ATTL School OS journey.",
    category: "Milestones",
    xp: 25,
    progress: 100,
    status: "Unlocked",
    icon: "✦",
  },
  {
    title: "Identity Builder",
    description: "Complete your student identity.",
    category: "Profile",
    xp: 50,
    progress: 20,
    status: "In Progress",
    icon: "◎",
  },
  {
    title: "Curious Mind",
    description: "Add your first interests to your profile.",
    category: "Development",
    xp: 40,
    progress: 0,
    status: "Locked",
    icon: "◇",
  },
  {
    title: "First Project",
    description: "Create your first project workspace.",
    category: "Projects",
    xp: 100,
    progress: 0,
    status: "Locked",
    icon: "▣",
  },
  {
    title: "Builder",
    description: "Complete your first project milestone.",
    category: "Projects",
    xp: 150,
    progress: 0,
    status: "Locked",
    icon: "◈",
  },
  {
    title: "Competition Ready",
    description: "Apply to your first competition.",
    category: "Competitions",
    xp: 100,
    progress: 0,
    status: "Locked",
    icon: "△",
  },
  {
    title: "ATTL Explorer",
    description: "Explore ATTL tracks and opportunities.",
    category: "ATTL",
    xp: 50,
    progress: 0,
    status: "Locked",
    icon: "✧",
  },
  {
    title: "Team Player",
    description: "Join an ATTL team or project.",
    category: "Community",
    xp: 100,
    progress: 0,
    status: "Locked",
    icon: "◉",
  },
];

const categories = [
  { label: "Milestones", count: 1 },
  { label: "Profile", count: 1 },
  { label: "Development", count: 1 },
  { label: "Projects", count: 2 },
  { label: "Competitions", count: 1 },
  { label: "ATTL", count: 1 },
  { label: "Community", count: 1 },
];

export default function StudentAchievementsPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? achievements
      : achievements.filter(
          (achievement) => achievement.status === activeFilter
        );

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
              Achievement System
            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-[-0.05em] md:text-4xl">
              Earn your story.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
              Every project, milestone and opportunity can become part of
              your School OS journey.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-[20px] border border-white/10 bg-white/[0.06] p-4">
              <p className="text-[8px] uppercase tracking-[0.15em] text-white/30">
                Unlocked
              </p>

              <p className="mt-2 text-2xl font-semibold">
                1
              </p>
            </div>

            <div className="rounded-[20px] border border-white/10 bg-white/[0.06] p-4">
              <p className="text-[8px] uppercase tracking-[0.15em] text-white/30">
                Total XP
              </p>

              <p className="mt-2 text-2xl font-semibold">
                25
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Progress */}
      <section className="grid gap-3 md:grid-cols-3">

        <div className="rounded-[24px] border border-white/80 bg-white/60 p-5 shadow-[0_12px_35px_rgba(20,30,50,0.04)] backdrop-blur-2xl">
          <p className="text-[9px] uppercase tracking-[0.17em] text-black/30">
            Achievement progress
          </p>

          <div className="mt-4 flex items-end justify-between">
            <span className="text-3xl font-semibold tracking-[-0.05em]">
              1/8
            </span>

            <span className="text-[9px] text-black/30">
              12.5%
            </span>
          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
            <div className="h-full w-[12.5%] rounded-full bg-black" />
          </div>
        </div>

        <div className="rounded-[24px] border border-white/80 bg-white/60 p-5 shadow-[0_12px_35px_rgba(20,30,50,0.04)] backdrop-blur-2xl">
          <p className="text-[9px] uppercase tracking-[0.17em] text-black/30">
            XP earned
          </p>

          <p className="mt-4 text-3xl font-semibold tracking-[-0.05em]">
            25
          </p>

          <p className="mt-2 text-[9px] text-black/30">
            From achievements
          </p>
        </div>

        <Link
          href="/dashboard/student/xp"
          className="group rounded-[24px] bg-black p-5 text-white shadow-[0_18px_50px_rgba(0,0,0,0.12)] transition hover:-translate-y-1"
        >
          <p className="text-[9px] uppercase tracking-[0.17em] text-white/30">
            Level
          </p>

          <p className="mt-4 text-3xl font-semibold tracking-[-0.05em]">
            01
          </p>

          <p className="mt-2 text-[9px] text-white/35">
            View XP progression →
          </p>
        </Link>

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

      {/* Achievements */}
      <section className="rounded-[30px] border border-white/80 bg-white/60 p-5 shadow-[0_15px_50px_rgba(20,30,50,0.05)] backdrop-blur-2xl md:p-8">

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-black/30">
              Collection
            </p>

            <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em]">
              Achievements
            </h2>
          </div>

          <span className="rounded-full bg-black/[0.035] px-3 py-1.5 text-[8px] text-black/35">
            {filtered.length} shown
          </span>
        </div>

        <div className="mt-7 grid gap-3 md:grid-cols-2">

          {filtered.map((achievement) => {
            const unlocked = achievement.status === "Unlocked";
            const progress = achievement.progress;

            return (
              <div
                key={achievement.title}
                className={
                  unlocked
                    ? "group relative overflow-hidden rounded-[25px] border border-black/10 bg-white p-5 shadow-[0_12px_35px_rgba(20,30,50,0.06)]"
                    : "group relative overflow-hidden rounded-[25px] border border-black/[0.05] bg-black/[0.018] p-5"
                }
              >

                {unlocked && (
                  <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-400/10 blur-[50px]" />
                )}

                <div className="relative flex items-start gap-4">

                  <div
                    className={
                      unlocked
                        ? "flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-black text-xl text-white shadow-lg"
                        : "flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-black/[0.05] text-xl text-black/25"
                    }
                  >
                    {achievement.icon}
                  </div>

                  <div className="min-w-0 flex-1">

                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[8px] font-semibold uppercase tracking-[0.17em] text-black/30">
                          {achievement.category}
                        </span>

                        <h3 className="mt-1 text-sm font-semibold">
                          {achievement.title}
                        </h3>
                      </div>

                      <span
                        className={
                          unlocked
                            ? "rounded-full bg-blue-500/10 px-2.5 py-1 text-[8px] font-semibold text-blue-600"
                            : "rounded-full bg-black/[0.04] px-2.5 py-1 text-[8px] text-black/30"
                        }
                      >
                        {achievement.status}
                      </span>
                    </div>

                    <p className="mt-2 text-[10px] leading-5 text-black/40">
                      {achievement.description}
                    </p>

                    <div className="mt-5">
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] text-black/30">
                          Progress
                        </span>

                        <span className="text-[8px] font-semibold text-black/45">
                          {progress}%
                        </span>
                      </div>

                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
                        <div
                          className="h-full rounded-full bg-black transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-[9px] font-medium text-black/35">
                        +{achievement.xp} XP
                      </span>

                      {unlocked && (
                        <span className="text-[9px] font-semibold text-blue-600">
                          Earned
                        </span>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            );
          })}

        </div>

        {filtered.length === 0 && (
          <div className="mt-6 rounded-[23px] bg-black/[0.025] p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
              ◌
            </div>

            <h3 className="mt-4 text-sm font-semibold">
              No achievements here yet
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-[10px] leading-5 text-black/35">
              Keep learning, building and participating. New achievements
              will unlock as your journey grows.
            </p>
          </div>
        )}

      </section>

      {/* Categories */}
      <section className="rounded-[30px] border border-white/80 bg-white/60 p-6 shadow-[0_15px_50px_rgba(20,30,50,0.05)] backdrop-blur-2xl">

        <div>
          <p className="text-[9px] uppercase tracking-[0.2em] text-black/30">
            Categories
          </p>

          <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em]">
            Achievement map
          </h2>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <div
              key={category.label}
              className="rounded-[18px] bg-black/[0.025] p-4"
            >
              <p className="text-[10px] font-semibold">
                {category.label}
              </p>

              <p className="mt-1 text-[9px] text-black/30">
                {category.count} achievement
                {category.count !== 1 ? "s" : ""}
              </p>
            </div>
          ))}
        </div>

      </section>

      {/* CTA */}
      <section className="rounded-[28px] bg-black p-6 text-white md:p-8">

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/30">
              Keep going
            </p>

            <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em]">
              Your next achievement is waiting.
            </h2>

            <p className="mt-2 text-[10px] leading-5 text-white/35">
              Build something, learn something or take your next step.
            </p>
          </div>

          <Link
            href="/dashboard/student/goals"
            className="rounded-[16px] bg-white px-5 py-3 text-center text-[10px] font-semibold text-black transition hover:bg-white/90"
          >
            View my goals →
          </Link>

        </div>
      </section>

    </div>
  );
}
