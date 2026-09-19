"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ClassItem = {
  time: string;
  end: string;
  subject: string;
  code: string;
  teacher: string;
  room: string;
  kind: "Class" | "Lab";
};

const week = [
  { key: "MON", label: "Monday", date: "16" },
  { key: "TUE", label: "Tuesday", date: "17" },
  { key: "WED", label: "Wednesday", date: "18" },
  { key: "THU", label: "Thursday", date: "19" },
  { key: "FRI", label: "Friday", date: "20" },
];

const schedule: Record<string, ClassItem[]> = {
  MON: [
    {
      time: "08:00",
      end: "09:00",
      subject: "Mathematics",
      code: "MATH",
      teacher: "Assigned teacher",
      room: "Room A12",
      kind: "Class",
    },
    {
      time: "09:15",
      end: "10:15",
      subject: "Physics",
      code: "PHY",
      teacher: "Assigned teacher",
      room: "Room B04",
      kind: "Class",
    },
    {
      time: "10:30",
      end: "11:30",
      subject: "English",
      code: "ENG",
      teacher: "Assigned teacher",
      room: "Room C08",
      kind: "Class",
    },
  ],
  TUE: [
    {
      time: "08:00",
      end: "09:00",
      subject: "Chemistry",
      code: "CHEM",
      teacher: "Assigned teacher",
      room: "Lab 01",
      kind: "Lab",
    },
    {
      time: "09:15",
      end: "10:15",
      subject: "Mathematics",
      code: "MATH",
      teacher: "Assigned teacher",
      room: "Room A12",
      kind: "Class",
    },
    {
      time: "10:30",
      end: "11:30",
      subject: "Physics",
      code: "PHY",
      teacher: "Assigned teacher",
      room: "Room B04",
      kind: "Class",
    },
  ],
  WED: [
    {
      time: "08:00",
      end: "09:00",
      subject: "English",
      code: "ENG",
      teacher: "Assigned teacher",
      room: "Room C08",
      kind: "Class",
    },
    {
      time: "09:15",
      end: "10:15",
      subject: "Chemistry",
      code: "CHEM",
      teacher: "Assigned teacher",
      room: "Lab 01",
      kind: "Lab",
    },
    {
      time: "10:30",
      end: "11:30",
      subject: "Mathematics",
      code: "MATH",
      teacher: "Assigned teacher",
      room: "Room A12",
      kind: "Class",
    },
  ],
  THU: [
    {
      time: "08:00",
      end: "09:00",
      subject: "Physics",
      code: "PHY",
      teacher: "Assigned teacher",
      room: "Room B04",
      kind: "Class",
    },
    {
      time: "09:15",
      end: "10:15",
      subject: "Chemistry",
      code: "CHEM",
      teacher: "Assigned teacher",
      room: "Lab 01",
      kind: "Lab",
    },
    {
      time: "10:30",
      end: "11:30",
      subject: "English",
      code: "ENG",
      teacher: "Assigned teacher",
      room: "Room C08",
      kind: "Class",
    },
  ],
  FRI: [
    {
      time: "08:30",
      end: "09:30",
      subject: "Mathematics",
      code: "MATH",
      teacher: "Assigned teacher",
      room: "Room A12",
      kind: "Class",
    },
    {
      time: "09:45",
      end: "10:45",
      subject: "Project Lab",
      code: "LAB",
      teacher: "ATTL Workspace",
      room: "Innovation Lab",
      kind: "Lab",
    },
  ],
};

const upcoming = [
  {
    label: "Next exam",
    value: "Physics",
    detail: "Exam period",
    href: "/dashboard/academics/exams",
  },
  {
    label: "Next deadline",
    value: "Assignments",
    detail: "Academic workspace",
    href: "/dashboard/academics/deadlines",
  },
  {
    label: "Academic calendar",
    value: "Open calendar",
    detail: "See the full week",
    href: "/dashboard/academics/calendar",
  },
];

export default function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState("THU");
  const selectedClasses = useMemo(
    () => schedule[selectedDay] ?? [],
    [selectedDay]
  );

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[32px] bg-black p-6 text-white shadow-[0_25px_80px_rgba(0,0,0,.12)] md:p-8">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/25 blur-[110px]" />
        <div className="absolute bottom-[-140px] left-[32%] h-80 w-80 rounded-full bg-cyan-400/10 blur-[110px]" />

        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[8px] uppercase tracking-[.22em] text-white/40">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,.8)]" />
              Academic Schedule
            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-[-.06em] md:text-5xl">
              Your week,
              <br />
              <span className="text-white/40">at a glance.</span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
              See classes, labs and academic blocks in one focused timetable.
              The current data is frontend preview data until the school system
              is connected.
            </p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl">
            <p className="text-[8px] uppercase tracking-[.18em] text-white/30">
              Today
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-[-.05em]">
              Thursday
            </p>
            <p className="mt-1 text-[10px] text-white/35">
              3 academic blocks
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Classes", "14", "Weekly blocks"],
          ["Labs", "3", "Practical sessions"],
          ["Free blocks", "7", "Open study time"],
          ["Today", "3", "Scheduled today"],
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
            <p className="mt-1 text-[8px] text-black/25">{detail}</p>
          </div>
        ))}
      </section>

      <section className="rounded-[28px] border border-white/80 bg-white/60 p-3 shadow-[0_15px_50px_rgba(20,30,50,.05)] backdrop-blur-2xl md:p-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {week.map((day) => {
            const active = selectedDay === day.key;

            return (
              <button
                key={day.key}
                type="button"
                onClick={() => setSelectedDay(day.key)}
                className={
                  active
                    ? "rounded-[20px] bg-black px-3 py-4 text-white shadow-lg transition-all"
                    : "rounded-[20px] px-3 py-4 text-black/45 transition-all hover:bg-white hover:text-black"
                }
              >
                <div className="text-[8px] uppercase tracking-[.16em] opacity-60">
                  {day.key}
                </div>
                <div className="mt-1 text-sm font-semibold">{day.label}</div>
                <div className="mt-1 text-[9px] opacity-45">Sep {day.date}</div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.45fr_.55fr]">
        <div className="rounded-[30px] border border-white/80 bg-white/60 p-5 shadow-[0_15px_50px_rgba(20,30,50,.05)] backdrop-blur-2xl md:p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[8px] font-semibold uppercase tracking-[.2em] text-black/30">
                Timetable
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-[-.04em]">
                {week.find((day) => day.key === selectedDay)?.label}
              </h2>
            </div>
            <span className="rounded-full bg-black/[.04] px-3 py-1.5 text-[8px] text-black/35">
              {selectedClasses.length} blocks
            </span>
          </div>

          <div className="mt-6 space-y-3">
            {selectedClasses.map((item, index) => (
              <article
                key={item.time + item.code}
                className="group relative grid gap-4 overflow-hidden rounded-[23px] border border-black/[.04] bg-white/65 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_15px_40px_rgba(20,30,50,.07)] md:grid-cols-[88px_1fr_auto] md:items-center"
              >
                <div>
                  <p className="text-sm font-semibold tracking-[-.03em]">
                    {item.time}
                  </p>
                  <p className="mt-1 text-[9px] text-black/30">{item.end}</p>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-black text-[8px] font-semibold text-white">
                      {item.code}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold">
                        {item.subject}
                      </h3>
                      <p className="mt-1 text-[9px] text-black/35">
                        {item.teacher} · {item.room}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 md:block md:text-right">
                  <span
                    className={
                      item.kind === "Lab"
                        ? "rounded-full bg-blue-50 px-3 py-1.5 text-[8px] font-medium text-blue-600"
                        : "rounded-full bg-black/[.04] px-3 py-1.5 text-[8px] text-black/35"
                    }
                  >
                    {item.kind}
                  </span>
                  <p className="mt-1 hidden text-[8px] text-black/20 md:block">
                    Block {index + 1}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-5 rounded-[20px] border border-dashed border-black/10 bg-black/[.02] p-4">
            <p className="text-[8px] uppercase tracking-[.18em] text-black/25">
              Schedule note
            </p>
            <p className="mt-2 text-[10px] leading-5 text-black/35">
              This timetable is a frontend preview. Live room, teacher,
              substitution and attendance data will come from the School OS
              backend later.
            </p>
          </div>
        </div>

        <div className="rounded-[30px] bg-black p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,.12)]">
          <p className="text-[8px] font-semibold uppercase tracking-[.2em] text-white/30">
            Next up
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-[-.04em]">
            Keep your week moving.
          </h2>

          <div className="mt-6 space-y-2">
            {upcoming.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block rounded-[19px] border border-white/10 bg-white/[.06] p-4 transition hover:bg-white/[.1]"
              >
                <p className="text-[8px] uppercase tracking-[.16em] text-white/25">
                  {item.label}
                </p>
                <p className="mt-2 text-sm font-semibold">{item.value}</p>
                <p className="mt-1 text-[9px] text-white/30">{item.detail}</p>
              </Link>
            ))}
          </div>

          <Link
            href="/dashboard/academics/overview"
            className="mt-3 flex items-center justify-between rounded-[18px] bg-white px-4 py-3 text-[9px] font-semibold text-black transition hover:bg-white/90"
          >
            Back to academics
            <span>→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
