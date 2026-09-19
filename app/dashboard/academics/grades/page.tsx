"use client";

import Link from "next/link";
import { useState } from "react";

const subjects = [
  {
    name: "Mathematics",
    code: "MATH",
    score: "—",
    grade: "Pending",
    status: "Awaiting results",
  },
  {
    name: "Physics",
    code: "PHY",
    score: "—",
    grade: "Pending",
    status: "Awaiting results",
  },
  {
    name: "Chemistry",
    code: "CHEM",
    score: "—",
    grade: "Pending",
    status: "Awaiting results",
  },
  {
    name: "English",
    code: "ENG",
    score: "—",
    grade: "Pending",
    status: "Awaiting results",
  },
];

export default function GradesPage() {
  const [view, setView] = useState("Current");

  return (
    <div className="space-y-6">

      {/* Hero */}
      <section className="relative overflow-hidden rounded-[32px] bg-black p-6 text-white shadow-[0_25px_80px_rgba(0,0,0,.12)] md:p-8">

        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/25 blur-[110px]" />
        <div className="absolute bottom-[-130px] left-[30%] h-72 w-72 rounded-full bg-cyan-400/10 blur-[110px]" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[8px] uppercase tracking-[.22em] text-white/40">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              Academic Records
            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-[-.06em] md:text-5xl">
              Your grades.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
              Your academic results, subject performance and official grade
              records will live here.
            </p>
          </div>

          <Link
            href="/dashboard/academics/transcript"
            className="rounded-[16px] border border-white/10 bg-white/5 px-5 py-3 text-center text-[9px] font-semibold text-white/70 transition hover:bg-white/10"
          >
            View transcript →
          </Link>

        </div>
      </section>

      {/* Results Lock */}
      <section className="relative overflow-hidden rounded-[28px] border border-white/80 bg-white/60 p-6 shadow-[0_15px_50px_rgba(20,30,50,.05)] backdrop-blur-2xl">

        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-blue-400/10 blur-[70px]" />

        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-black text-white">
              ◷
            </div>

            <div>
              <p className="text-[8px] uppercase tracking-[.18em] text-black/25">
                Results status
              </p>

              <h2 className="mt-1 text-sm font-semibold">
                Results are currently locked
              </h2>

              <p className="mt-2 max-w-xl text-[9px] leading-5 text-black/30">
                Official grades will become visible when the school releases
                the results. This lock will eventually be controlled by the
                School OS backend.
              </p>
            </div>

          </div>

          <div className="shrink-0 rounded-[18px] bg-black/[.035] px-5 py-3 text-center">
            <p className="text-[8px] uppercase tracking-[.15em] text-black/25">
              Status
            </p>

            <p className="mt-1 text-[10px] font-semibold">
              Locked
            </p>
          </div>

        </div>
      </section>

      {/* Summary */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">

        {[
          ["Overall GPA", "—", "Pending"],
          ["Average", "—", "Pending"],
          ["Subjects", String(subjects.length), "Registered"],
          ["Term", "Current", "Academic year"],
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

          {["Current", "History"].map((item) => {

            const active = view === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => setView(item)}
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
          href="/dashboard/academics/reports"
          className="text-[9px] font-semibold text-black/35 hover:text-black"
        >
          Academic reports →
        </Link>

      </section>

      {/* Subject Grades */}
      {view === "Current" ? (
        <section className="rounded-[30px] border border-white/80 bg-white/60 p-5 shadow-[0_15px_50px_rgba(20,30,50,.05)] backdrop-blur-2xl md:p-7">

          <div className="flex items-end justify-between">

            <div>
              <p className="text-[9px] uppercase tracking-[.2em] text-black/30">
                Current term
              </p>

              <h2 className="mt-1 text-xl font-semibold tracking-[-.04em]">
                Subject results
              </h2>
            </div>

            <span className="rounded-full bg-black/[.04] px-3 py-1.5 text-[8px] text-black/30">
              Results locked
            </span>

          </div>

          <div className="mt-6 space-y-2">

            {subjects.map((subject) => (

              <div
                key={subject.code}
                className="group rounded-[21px] bg-black/[.025] p-4 transition hover:bg-white hover:shadow-[0_10px_30px_rgba(20,30,50,.05)] md:p-5"
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-white text-[9px] font-semibold shadow-sm">
                    {subject.code}
                  </div>

                  <div className="min-w-0 flex-1">

                    <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">

                      <div>
                        <h3 className="text-[11px] font-semibold">
                          {subject.name}
                        </h3>

                        <p className="mt-1 text-[8px] text-black/25">
                          {subject.status}
                        </p>
                      </div>

                      <div className="flex items-center gap-5">

                        <div className="text-right">
                          <p className="text-[8px] text-black/25">
                            Score
                          </p>
                          <p className="mt-1 text-[11px] font-semibold">
                            {subject.score}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-[8px] text-black/25">
                            Grade
                          </p>
                          <p className="mt-1 text-[11px] font-semibold">
                            {subject.grade}
                          </p>
                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>
            ))}

          </div>
        </section>
      ) : (
        <section className="rounded-[30px] border border-white/80 bg-white/60 p-7 shadow-[0_15px_50px_rgba(20,30,50,.05)] backdrop-blur-2xl">

          <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-black text-xl text-white">
            ◌
          </div>

          <h2 className="mt-6 text-xl font-semibold">
            Grade history
          </h2>

          <p className="mt-2 max-w-xl text-[10px] leading-6 text-black/30">
            Previous academic terms and archived grade records will appear
            here once historical records are imported into the School OS.
          </p>

        </section>
      )}

      {/* Future Backend Architecture */}
      <section className="rounded-[30px] bg-black p-6 text-white md:p-8">

        <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">

          <div>
            <p className="text-[8px] uppercase tracking-[.2em] text-white/30">
              School OS architecture
            </p>

            <h2 className="mt-2 text-xl font-semibold tracking-[-.04em]">
              Official results pipeline
            </h2>

            <p className="mt-3 max-w-2xl text-[9px] leading-6 text-white/35">
              Excel import → validation → preview → approval → scheduled
              release → student results.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">

            {[
              "Excel",
              "Validation",
              "Approval",
              "Release Lock",
            ].map((item) => (
              <span
                key={item}
                className="rounded-[14px] border border-white/10 bg-white/5 px-3 py-2 text-[8px] text-white/50"
              >
                {item}
              </span>
            ))}

          </div>

        </div>
      </section>

    </div>
  );
}
