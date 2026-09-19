"use client";

import Link from "next/link";
import { useState } from "react";

const projects = [
  {
    title: "My First Project",
    type: "Project",
    description: "Your first School OS project will appear here.",
    status: "In Progress",
    progress: 20,
    icon: "▣",
  },
  {
    title: "Learning Journey",
    type: "Learning",
    description: "A collection of your learning milestones and progress.",
    status: "Building",
    progress: 40,
    icon: "◇",
  },
];

const achievements = [
  {
    title: "First Step",
    category: "Milestone",
    xp: 25,
    icon: "✦",
  },
];

const skills = [
  {
    title: "Software Development",
    level: "Starting",
    progress: 20,
  },
  {
    title: "AI",
    level: "Exploring",
    progress: 10,
  },
];

export default function StudentPortfolioPage() {
  const [activeTab, setActiveTab] = useState("Overview");

  const tabs = ["Overview", "Projects", "Achievements", "Skills"];

  return (
    <div className="space-y-6">

      {/* Hero */}
      <section className="relative overflow-hidden rounded-[32px] bg-black p-6 text-white shadow-[0_25px_80px_rgba(0,0,0,0.12)] md:p-8">

        <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-blue-500/25 blur-[100px]" />
        <div className="absolute bottom-[-130px] left-[30%] h-72 w-72 rounded-full bg-cyan-400/10 blur-[100px]" />

        <div className="relative flex flex-col gap-7 md:flex-row md:items-end md:justify-between">

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-white/45">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              Student Portfolio
            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-[-0.06em] md:text-5xl">
              Your work. Your journey.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
              A living portfolio that brings together your projects,
              achievements, skills and learning journey.
            </p>
          </div>

          <Link
            href="/dashboard/projects/create"
            className="rounded-[16px] bg-white px-5 py-3 text-center text-[9px] font-semibold text-black transition hover:bg-white/90"
          >
            + Add project
          </Link>

        </div>
      </section>

      {/* Profile Snapshot */}
      <section className="grid gap-3 lg:grid-cols-[1.3fr_.7fr]">

        <div className="rounded-[28px] border border-white/80 bg-white/60 p-6 shadow-[0_15px_50px_rgba(20,30,50,0.05)] backdrop-blur-2xl md:p-7">

          <div className="flex items-center gap-4">

            <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-black text-lg font-semibold text-white shadow-lg">
              A
            </div>

            <div>
              <p className="text-[8px] uppercase tracking-[0.18em] text-black/30">
                Student
              </p>

              <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em]">
                Your School OS Profile
              </h2>

              <p className="mt-1 text-[9px] text-black/30">
                Building • Learning • Exploring
              </p>
            </div>

          </div>

          <div className="mt-6 grid gap-2 sm:grid-cols-3">

            <div className="rounded-[18px] bg-black/[0.025] p-4">
              <p className="text-[8px] uppercase tracking-[0.15em] text-black/25">
                Projects
              </p>
              <p className="mt-2 text-xl font-semibold">
                1
              </p>
            </div>

            <div className="rounded-[18px] bg-black/[0.025] p-4">
              <p className="text-[8px] uppercase tracking-[0.15em] text-black/25">
                Achievements
              </p>
              <p className="mt-2 text-xl font-semibold">
                1
              </p>
            </div>

            <div className="rounded-[18px] bg-black/[0.025] p-4">
              <p className="text-[8px] uppercase tracking-[0.15em] text-black/25">
                XP
              </p>
              <p className="mt-2 text-xl font-semibold">
                25
              </p>
            </div>

          </div>
        </div>

        <div className="rounded-[28px] bg-black p-6 text-white shadow-[0_18px_55px_rgba(0,0,0,0.12)]">

          <p className="text-[8px] uppercase tracking-[0.18em] text-white/30">
            Portfolio strength
          </p>

          <p className="mt-4 text-5xl font-semibold tracking-[-0.08em]">
            24%
          </p>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[24%] rounded-full bg-white" />
          </div>

          <p className="mt-3 text-[9px] leading-5 text-white/30">
            Add projects, skills and achievements to build your portfolio.
          </p>

        </div>

      </section>

      {/* Tabs */}
      <section className="overflow-x-auto rounded-[24px] border border-white/80 bg-white/60 p-2 backdrop-blur-2xl">

        <div className="flex min-w-max gap-1">

          {tabs.map((tab) => {
            const active = activeTab === tab;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={
                  active
                    ? "rounded-[16px] bg-black px-5 py-2.5 text-[9px] font-semibold text-white"
                    : "rounded-[16px] px-5 py-2.5 text-[9px] text-black/35 transition hover:bg-black/[0.04] hover:text-black"
                }
              >
                {tab}
              </button>
            );
          })}

        </div>
      </section>

      {/* Overview */}
      {activeTab === "Overview" && (
        <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">

          {/* Featured Work */}
          <section className="rounded-[30px] border border-white/80 bg-white/60 p-6 shadow-[0_15px_50px_rgba(20,30,50,0.05)] backdrop-blur-2xl md:p-8">

            <div className="flex items-end justify-between gap-4">

              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-black/30">
                  Featured work
                </p>

                <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em]">
                  Projects
                </h2>
              </div>

              <Link
                href="/dashboard/projects/all"
                className="text-[9px] font-semibold text-black/40 hover:text-black"
              >
                View all →
              </Link>

            </div>

            <div className="mt-6 space-y-3">

              {projects.map((project) => (
                <div
                  key={project.title}
                  className="rounded-[23px] bg-black/[0.025] p-5"
                >

                  <div className="flex items-start gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-white text-sm shadow-sm">
                      {project.icon}
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex items-start justify-between gap-3">

                        <div>
                          <p className="text-[8px] uppercase tracking-[0.15em] text-black/25">
                            {project.type}
                          </p>

                          <h3 className="mt-1 text-sm font-semibold">
                            {project.title}
                          </h3>
                        </div>

                        <span className="rounded-full bg-black/[0.04] px-2.5 py-1 text-[7px] text-black/35">
                          {project.status}
                        </span>

                      </div>

                      <p className="mt-2 text-[9px] leading-5 text-black/30">
                        {project.description}
                      </p>

                      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
                        <div
                          className="h-full rounded-full bg-black"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>

                    </div>
                  </div>
                </div>
              ))}

            </div>
          </section>

          {/* Right */}
          <div className="space-y-6">

            <section className="rounded-[30px] border border-white/80 bg-white/60 p-6 shadow-[0_15px_50px_rgba(20,30,50,0.05)] backdrop-blur-2xl">

              <p className="text-[9px] uppercase tracking-[0.2em] text-black/30">
                Recognition
              </p>

              <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em]">
                Achievements
              </h2>

              <div className="mt-5 space-y-2">

                {achievements.map((achievement) => (
                  <div
                    key={achievement.title}
                    className="flex items-center gap-3 rounded-[18px] bg-black/[0.025] p-3.5"
                  >

                    <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-black text-white">
                      {achievement.icon}
                    </div>

                    <div className="flex-1">
                      <p className="text-[10px] font-semibold">
                        {achievement.title}
                      </p>

                      <p className="mt-1 text-[8px] text-black/30">
                        {achievement.category}
                      </p>
                    </div>

                    <span className="text-[8px] font-semibold">
                      +{achievement.xp}
                    </span>

                  </div>
                ))}

              </div>
            </section>

            <section className="rounded-[30px] border border-white/80 bg-white/60 p-6 shadow-[0_15px_50px_rgba(20,30,50,0.05)] backdrop-blur-2xl">

              <p className="text-[9px] uppercase tracking-[0.2em] text-black/30">
                Development
              </p>

              <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em]">
                Skills
              </h2>

              <div className="mt-5 space-y-4">

                {skills.map((skill) => (
                  <div key={skill.title}>

                    <div className="flex items-center justify-between">

                      <div>
                        <p className="text-[10px] font-semibold">
                          {skill.title}
                        </p>

                        <p className="mt-1 text-[8px] text-black/25">
                          {skill.level}
                        </p>
                      </div>

                      <span className="text-[8px] font-semibold">
                        {skill.progress}%
                      </span>

                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
                      <div
                        className="h-full rounded-full bg-black"
                        style={{ width: `${skill.progress}%` }}
                      />
                    </div>

                  </div>
                ))}

              </div>
            </section>

          </div>
        </div>
      )}

      {/* Projects */}
      {activeTab === "Projects" && (
        <section className="rounded-[30px] border border-white/80 bg-white/60 p-6 backdrop-blur-2xl md:p-8">

          <div className="flex items-end justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-black/30">
                Portfolio work
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                Projects
              </h2>
            </div>

            <Link
              href="/dashboard/projects/create"
              className="rounded-[14px] bg-black px-4 py-2.5 text-[9px] font-semibold text-white"
            >
              + New project
            </Link>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {projects.map((project) => (
              <div
                key={project.title}
                className="rounded-[23px] bg-black/[0.025] p-5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-white shadow-sm">
                  {project.icon}
                </div>

                <h3 className="mt-5 text-sm font-semibold">
                  {project.title}
                </h3>

                <p className="mt-2 text-[9px] leading-5 text-black/30">
                  {project.description}
                </p>

                <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
                  <div
                    className="h-full rounded-full bg-black"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements */}
      {activeTab === "Achievements" && (
        <section className="rounded-[30px] border border-white/80 bg-white/60 p-6 backdrop-blur-2xl md:p-8">

          <p className="text-[9px] uppercase tracking-[0.2em] text-black/30">
            Recognition
          </p>

          <h2 className="mt-1 text-xl font-semibold">
            Achievement collection
          </h2>

          <div className="mt-6 grid gap-3 md:grid-cols-2">

            {achievements.map((achievement) => (
              <div
                key={achievement.title}
                className="rounded-[23px] border border-black/10 bg-white p-5"
              >
                <div className="flex items-center gap-4">

                  <div className="flex h-14 w-14 items-center justify-center rounded-[17px] bg-black text-white">
                    {achievement.icon}
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold">
                      {achievement.title}
                    </h3>

                    <p className="mt-1 text-[9px] text-black/30">
                      {achievement.category}
                    </p>

                    <p className="mt-2 text-[9px] font-semibold">
                      +{achievement.xp} XP
                    </p>
                  </div>

                </div>
              </div>
            ))}

          </div>
        </section>
      )}

      {/* Skills */}
      {activeTab === "Skills" && (
        <section className="rounded-[30px] border border-white/80 bg-white/60 p-6 backdrop-blur-2xl md:p-8">

          <p className="text-[9px] uppercase tracking-[0.2em] text-black/30">
            Development
          </p>

          <h2 className="mt-1 text-xl font-semibold">
            Skills in your portfolio
          </h2>

          <div className="mt-6 space-y-4">

            {skills.map((skill) => (
              <div
                key={skill.title}
                className="rounded-[22px] bg-black/[0.025] p-5"
              >

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold">
                      {skill.title}
                    </p>

                    <p className="mt-1 text-[8px] text-black/25">
                      {skill.level}
                    </p>
                  </div>

                  <span className="text-[9px] font-semibold">
                    {skill.progress}%
                  </span>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/[0.06]">
                  <div
                    className="h-full rounded-full bg-black"
                    style={{ width: `${skill.progress}%` }}
                  />
                </div>

              </div>
            ))}

          </div>
        </section>
      )}

      {/* Footer CTA */}
      <section className="rounded-[30px] bg-black p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.12)] md:p-8">

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/30">
              Keep building
            </p>

            <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em]">
              Your portfolio grows with you.
            </h2>

            <p className="mt-2 max-w-xl text-[10px] leading-5 text-white/35">
              Every project, skill and achievement can become part of your
              School OS story.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">

            <Link
              href="/dashboard/projects/create"
              className="rounded-[15px] bg-white px-4 py-2.5 text-[9px] font-semibold text-black"
            >
              Build something
            </Link>

            <Link
              href="/dashboard/skills/my-skills"
              className="rounded-[15px] border border-white/10 bg-white/5 px-4 py-2.5 text-[9px] font-semibold text-white/70"
            >
              Develop skills
            </Link>

          </div>

        </div>
      </section>

    </div>
  );
}
