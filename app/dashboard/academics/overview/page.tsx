"use client";

import Link from "next/link";

const stats = [
  { label: "Current GPA", value: "—", detail: "Not available yet" },
  { label: "Subjects", value: "—", detail: "Your subjects" },
  { label: "Attendance", value: "—", detail: "This term" },
  { label: "Assignments", value: "—", detail: "Pending" },
];

const modules = [
  {
    title: "Grades",
    description: "View your academic grades and performance.",
    href: "/dashboard/academics/grades",
    icon: "◇",
  },
  {
    title: "Subjects",
    description: "Explore your subjects and academic information.",
    href: "/dashboard/academics/subjects",
    icon: "▦",
  },
  {
    title: "Schedule",
    description: "Keep track of your classes and weekly schedule.",
    href: "/dashboard/academics/schedule",
    icon: "◷",
  },
  {
    title: "Exams",
    description: "Upcoming exams, preparation and exam history.",
    href: "/dashboard/academics/exams",
    icon: "✦",
  },
  {
    title: "Assignments",
    description: "Track assignments, deadlines and submissions.",
    href: "/dashboard/academics/assignments",
    icon: "✓",
  },
  {
    title: "Attendance",
    description: "Review attendance records and patterns.",
    href: "/dashboard/academics/attendance",
    icon: "◉",
  },
];

export default function AcademicsOverviewPage() {
  return (
    <div className="space-y-6">

      {/* Hero */}
      <section className="relative overflow-hidden rounded-[32px] bg-black p-6 text-white shadow-[0_25px_80px_rgba(0,0,0,.12)] md:p-8">

        <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-blue-500/25 blur-[110px]" />
        <div className="absolute bottom-[-140px] left-[25%] h-80 w-80 rounded-full bg-cyan-400/10 blur-[110px]" />

        <div className="relative">

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[8px] uppercase tracking-[.22em] text-white/40">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            Academic Center
          </div>

          <h1 className="mt-5 max-w-3xl text-3xl font-semibold tracking-[-.06em] md:text-5xl">
            Everything academic.
            <br />
            <span className="text-white/30">
              In one place.
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/40">
            Your academic command center for grades, subjects, exams,
            assignments, attendance and your overall academic journey.
          </p>

        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">

        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-[25px] border border-white/80 bg-white/60 p-5 shadow-[0_15px_45px_rgba(20,30,50,.05)] backdrop-blur-2xl"
          >

            <p className="text-[8px] uppercase tracking-[.18em] text-black/25">
              {stat.label}
            </p>

            <p className="mt-3 text-2xl font-semibold tracking-[-.05em]">
              {stat.value}
            </p>

            <p className="mt-1 text-[8px] text-black/25">
              {stat.detail}
            </p>

          </div>
        ))}

      </section>

      {/* Quick access */}
      <section className="rounded-[30px] border border-white/80 bg-white/60 p-6 shadow-[0_15px_50px_rgba(20,30,50,.05)] backdrop-blur-2xl md:p-8">

        <div className="flex items-end justify-between">

          <div>
            <p className="text-[9px] uppercase tracking-[.2em] text-black/30">
              Academic workspace
            </p>

            <h2 className="mt-1 text-xl font-semibold tracking-[-.04em]">
              Quick access
            </h2>
          </div>

          <Link
            href="/dashboard/academics/calendar"
            className="text-[9px] font-semibold text-black/35 transition hover:text-black"
          >
            Academic calendar →
          </Link>

        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">

          {modules.map((module) => (
            <Link
              key={module.title}
              href={module.href}
              className="group rounded-[23px] bg-black/[.025] p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_15px_35px_rgba(20,30,50,.07)]"
            >

              <div className="flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-white text-sm shadow-sm transition-transform duration-300 group-hover:scale-105">
                  {module.icon}
                </div>

                <span className="text-black/20 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>

              </div>

              <h3 className="mt-5 text-sm font-semibold">
                {module.title}
              </h3>

              <p className="mt-2 text-[9px] leading-5 text-black/30">
                {module.description}
              </p>

            </Link>
          ))}

        </div>
      </section>

      {/* Academic timeline */}
      <section className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">

        <div className="rounded-[30px] border border-white/80 bg-white/60 p-6 backdrop-blur-2xl md:p-8">

          <p className="text-[9px] uppercase tracking-[.2em] text-black/30">
            Academic journey
          </p>

          <h2 className="mt-1 text-xl font-semibold">
            Recent activity
          </h2>

          <div className="mt-7 space-y-5">

            {[
              ["Academic profile", "Your academic workspace is ready."],
              ["Grades", "Grade records will appear here when available."],
              ["Assignments", "Assignment activity will be tracked here."],
            ].map(([title, description], index) => (

              <div
                key={title}
                className="flex gap-4"
              >

                <div className="flex flex-col items-center">

                  <div className="h-3 w-3 rounded-full border-2 border-black bg-white" />

                  {index < 2 && (
                    <div className="mt-2 h-full w-px bg-black/10" />
                  )}

                </div>

                <div className="pb-2">

                  <p className="text-[10px] font-semibold">
                    {title}
                  </p>

                  <p className="mt-1 text-[9px] leading-5 text-black/30">
                    {description}
                  </p>

                </div>

              </div>

            ))}

          </div>
        </div>

        {/* Academic focus */}
        <div className="rounded-[30px] bg-black p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,.12)] md:p-8">

          <p className="text-[9px] uppercase tracking-[.2em] text-white/30">
            Academic focus
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-[-.05em]">
            Build your academic profile.
          </h2>

          <p className="mt-3 text-[10px] leading-6 text-white/35">
            Your School OS will connect academic performance,
            learning progress, projects and skills into one picture.
          </p>

          <div className="mt-7 space-y-3">

            {[
              "Track academic performance",
              "Monitor deadlines",
              "Prepare for exams",
              "Build consistent learning habits",
            ].map((item) => (

              <div
                key={item}
                className="flex items-center gap-3 rounded-[16px] border border-white/10 bg-white/5 p-3"
              >

                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[8px] text-black">
                  ✓
                </span>

                <span className="text-[9px] text-white/55">
                  {item}
                </span>

              </div>

            ))}

          </div>

        </div>

      </section>

    </div>
  );
}
