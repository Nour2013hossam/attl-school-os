"use client";

import Link from "next/link";
import { useState } from "react";

const subjects = [
  {
    name: "Mathematics",
    code: "MATH",
    teacher: "Assigned teacher",
    type: "Core",
    progress: 0,
    status: "Not started",
  },
  {
    name: "Physics",
    code: "PHY",
    teacher: "Assigned teacher",
    type: "Core",
    progress: 0,
    status: "Not started",
  },
  {
    name: "Chemistry",
    code: "CHEM",
    teacher: "Assigned teacher",
    type: "Core",
    progress: 0,
    status: "Not started",
  },
  {
    name: "English",
    code: "ENG",
    teacher: "Assigned teacher",
    type: "Language",
    progress: 0,
    status: "Not started",
  },
];

export default function SubjectsPage() {
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All"
      ? subjects
      : subjects.filter((subject) => subject.type === filter);

  return (
    <div className="space-y-6">

      {/* Hero */}
      <section className="relative overflow-hidden rounded-[32px] bg-black p-6 text-white shadow-[0_25px_80px_rgba(0,0,0,.12)] md:p-8">

        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/25 blur-[110px]" />
        <div className="absolute bottom-[-130px] left-[30%] h-72 w-72 rounded-full bg-cyan-400/10 blur-[110px]" />

        <div className="relative">

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[8px] uppercase tracking-[.22em] text-white/40">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            Academic Subjects
          </div>

          <h1 className="mt-5 text-3xl font-semibold tracking-[-.06em] md:text-5xl">
            Your subjects.
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
            Explore your registered subjects, teachers, progress and
            learning resources from one place.
          </p>

        </div>
      </section>

      {/* Summary */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">

        {[
          ["Subjects", subjects.length.toString(), "Registered"],
          ["Core", "3", "Core subjects"],
          ["Language", "1", "Language subject"],
          ["Progress", "0%", "Overall"],
        ].map(([label, value, detail]) => (

          <div
            key={label}
            className="rounded-[25px] border border-white/80 bg-white/60 p-5 shadow-[0_15px_45px_rgba(20,30,50,.05)] backdrop-blur-2xl"
          >

            <p className="text-[8px] uppercase tracking-[.18em] text-black/25">
              {label}
            </p>

            <p className="mt-3 text-2xl font-semibold tracking-[-.05em]">
              {value}
            </p>

            <p className="mt-1 text-[8px] text-black/25">
              {detail}
            </p>

          </div>

        ))}

      </section>

      {/* Controls */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div className="inline-flex w-fit rounded-[18px] border border-white/80 bg-white/60 p-1.5 backdrop-blur-xl">

          {["All", "Core", "Language"].map((item) => {

            const active = filter === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={
                  active
                    ? "rounded-[13px] bg-black px-5 py-2.5 text-[9px] font-semibold text-white"
                    : "rounded-[13px] px-5 py-2.5 text-[9px] text-black/35 transition hover:text-black"
                }
              >
                {item}
              </button>
            );
          })}

        </div>

        <Link
          href="/dashboard/academics/schedule"
          className="text-[9px] font-semibold text-black/35 hover:text-black"
        >
          View schedule →
        </Link>

      </section>

      {/* Subject Grid */}
      <section className="grid gap-4 md:grid-cols-2">

        {filtered.map((subject) => (

          <article
            key={subject.code}
            className="group relative overflow-hidden rounded-[30px] border border-white/80 bg-white/60 p-6 shadow-[0_15px_50px_rgba(20,30,50,.05)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_22px_60px_rgba(20,30,50,.08)]"
          >

            <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-blue-400/5 blur-[50px]" />

            <div className="relative">

              <div className="flex items-start justify-between gap-4">

                <div className="flex items-center gap-4">

                  <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-black text-[10px] font-semibold text-white shadow-lg">
                    {subject.code}
                  </div>

                  <div>
                    <p className="text-[8px] uppercase tracking-[.15em] text-black/25">
                      {subject.type}
                    </p>

                    <h2 className="mt-1 text-base font-semibold tracking-[-.03em]">
                      {subject.name}
                    </h2>
                  </div>

                </div>

                <span className="rounded-full bg-black/[.04] px-3 py-1.5 text-[7px] text-black/30">
                  {subject.status}
                </span>

              </div>

              {/* Teacher */}
              <div className="mt-6 flex items-center gap-3 rounded-[18px] bg-black/[.025] p-3.5">

                <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-white text-[9px] shadow-sm">
                  T
                </div>

                <div>
                  <p className="text-[8px] uppercase tracking-[.14em] text-black/25">
                    Teacher
                  </p>

                  <p className="mt-1 text-[9px] font-semibold">
                    {subject.teacher}
                  </p>
                </div>

              </div>

              {/* Progress */}
              <div className="mt-6">

                <div className="flex items-center justify-between">

                  <p className="text-[8px] uppercase tracking-[.14em] text-black/25">
                    Learning progress
                  </p>

                  <span className="text-[9px] font-semibold">
                    {subject.progress}%
                  </span>

                </div>

                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/[.06]">
                  <div
                    className="h-full rounded-full bg-black transition-all duration-500"
                    style={{ width: `${subject.progress}%` }}
                  />
                </div>

              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-2">

                <Link
                  href="/dashboard/learning/courses"
                  className="flex-1 rounded-[14px] bg-black px-4 py-3 text-center text-[8px] font-semibold text-white transition hover:bg-black/90"
                >
                  Learning
                </Link>

                <Link
                  href="/dashboard/academics/assignments"
                  className="flex-1 rounded-[14px] bg-black/[.04] px-4 py-3 text-center text-[8px] font-semibold text-black/50 transition hover:bg-black/[.07] hover:text-black"
                >
                  Assignments
                </Link>

              </div>

            </div>

          </article>

        ))}

      </section>

      {/* Empty future state */}
      <section className="rounded-[30px] bg-black p-6 text-white md:p-8">

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <p className="text-[8px] uppercase tracking-[.2em] text-white/30">
              Future School OS
            </p>

            <h2 className="mt-2 text-xl font-semibold tracking-[-.04em]">
              One subject, one complete workspace.
            </h2>

            <p className="mt-3 max-w-2xl text-[9px] leading-6 text-white/35">
              Each subject will eventually connect grades, lessons,
              assignments, exams, resources, attendance and learning
              progress into one unified experience.
            </p>

          </div>

          <Link
            href="/dashboard/learning/explore"
            className="rounded-[15px] bg-white px-5 py-3 text-center text-[9px] font-semibold text-black"
          >
            Explore learning
          </Link>

        </div>

      </section>

    </div>
  );
}
