"use client";

import Link from "next/link";

const identityItems = [
  {
    label: "Full Name",
    value: "Student Name",
    description: "Your official school identity.",
  },
  {
    label: "Student ID",
    value: "Not assigned",
    description: "Your unique school identifier.",
  },
  {
    label: "Grade",
    value: "Not set",
    description: "Your current academic grade.",
  },
  {
    label: "Class",
    value: "Not set",
    description: "Your current school class.",
  },
];

const privacyOptions = [
  {
    title: "Profile visibility",
    description: "Control who can discover your student profile.",
    value: "School members",
  },
  {
    title: "Activity visibility",
    description: "Control visibility of your School OS activity.",
    value: "Private",
  },
  {
    title: "Portfolio visibility",
    description: "Choose who can view your public work.",
    value: "School members",
  },
];

export default function StudentIdentityPage() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <section className="relative overflow-hidden rounded-[32px] bg-black p-6 text-white shadow-[0_25px_80px_rgba(0,0,0,0.12)] md:p-8">

        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/25 blur-[90px]" />
        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-cyan-400/10 blur-[100px]" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-white/45">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            Student Identity
          </div>

          <h1 className="mt-5 text-3xl font-semibold tracking-[-0.05em] md:text-4xl">
            Your identity.
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
            The information that represents you inside the ATTL School OS.
          </p>
        </div>
      </section>

      {/* Identity card */}
      <section className="rounded-[30px] border border-white/80 bg-white/65 p-6 shadow-[0_15px_50px_rgba(20,30,50,0.05)] backdrop-blur-2xl md:p-8">

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[28px] bg-black text-2xl font-semibold text-white shadow-xl">
            A
          </div>

          <div className="flex-1">
            <p className="text-[9px] uppercase tracking-[0.2em] text-black/30">
              School identity
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.05em]">
              Student Name
            </h2>

            <p className="mt-1 text-xs text-black/35">
              Student · ATTL School OS
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-500/10 px-3 py-1.5 text-[9px] font-medium text-blue-600">
                Level 01
              </span>

              <span className="rounded-full bg-black/[0.04] px-3 py-1.5 text-[9px] text-black/40">
                0 XP
              </span>

              <span className="rounded-full bg-black/[0.04] px-3 py-1.5 text-[9px] text-black/40">
                New Student
              </span>
            </div>
          </div>

          <Link
            href="/dashboard/settings/account"
            className="rounded-[16px] bg-black px-5 py-3 text-center text-[10px] font-semibold text-white transition hover:-translate-y-0.5"
          >
            Edit Identity
          </Link>
        </div>
      </section>

      {/* Information */}
      <section className="rounded-[30px] border border-white/80 bg-white/60 p-6 shadow-[0_15px_50px_rgba(20,30,50,0.05)] backdrop-blur-2xl md:p-8">

        <div>
          <p className="text-[9px] uppercase tracking-[0.2em] text-black/30">
            Core information
          </p>

          <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em]">
            Student information
          </h2>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {identityItems.map((item) => (
            <div
              key={item.label}
              className="rounded-[21px] bg-black/[0.025] p-5"
            >
              <p className="text-[9px] uppercase tracking-[0.16em] text-black/30">
                {item.label}
              </p>

              <p className="mt-2 text-sm font-semibold">
                {item.value}
              </p>

              <p className="mt-1 text-[10px] leading-5 text-black/35">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* School status */}
      <section className="grid gap-4 lg:grid-cols-2">

        <div className="rounded-[30px] border border-white/80 bg-white/60 p-6 shadow-[0_15px_50px_rgba(20,30,50,0.05)] backdrop-blur-2xl">

          <p className="text-[9px] uppercase tracking-[0.2em] text-black/30">
            School status
          </p>

          <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em]">
            Your current status
          </h2>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between rounded-[18px] bg-black/[0.025] px-4 py-3">
              <span className="text-[10px] text-black/45">
                Account
              </span>

              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-[9px] font-semibold text-blue-600">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between rounded-[18px] bg-black/[0.025] px-4 py-3">
              <span className="text-[10px] text-black/45">
                Student verification
              </span>

              <span className="text-[9px] text-black/30">
                Pending
              </span>
            </div>

            <div className="flex items-center justify-between rounded-[18px] bg-black/[0.025] px-4 py-3">
              <span className="text-[10px] text-black/45">
                ATTL membership
              </span>

              <span className="text-[9px] text-black/30">
                Not a member
              </span>
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="rounded-[30px] border border-white/80 bg-white/60 p-6 shadow-[0_15px_50px_rgba(20,30,50,0.05)] backdrop-blur-2xl">

          <p className="text-[9px] uppercase tracking-[0.2em] text-black/30">
            Privacy
          </p>

          <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em]">
            Visibility controls
          </h2>

          <div className="mt-5 space-y-2">
            {privacyOptions.map((option) => (
              <Link
                key={option.title}
                href="/dashboard/settings/privacy"
                className="group flex items-center justify-between gap-4 rounded-[18px] bg-black/[0.025] p-4 transition hover:bg-white"
              >
                <div>
                  <p className="text-[10px] font-semibold">
                    {option.title}
                  </p>

                  <p className="mt-1 text-[9px] leading-4 text-black/35">
                    {option.description}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-[9px] text-black/35">
                    {option.value}
                  </span>

                  <span className="text-black/20 group-hover:text-blue-600">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Identity roadmap */}
      <section className="rounded-[30px] border border-white/80 bg-white/60 p-6 shadow-[0_15px_50px_rgba(20,30,50,0.05)] backdrop-blur-2xl md:p-8">

        <div>
          <p className="text-[9px] uppercase tracking-[0.2em] text-black/30">
            Identity roadmap
          </p>

          <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em]">
            Build your student identity
          </h2>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">

          <Link
            href="/dashboard/student/interests"
            className="group rounded-[21px] bg-black/[0.025] p-5 transition hover:bg-white"
          >
            <span className="text-lg">✦</span>
            <h3 className="mt-4 text-sm font-semibold">
              Define interests
            </h3>
            <p className="mt-2 text-[10px] leading-5 text-black/35">
              Tell the School OS what you want to explore.
            </p>
            <span className="mt-4 block text-[9px] text-black/30 group-hover:text-blue-600">
              Start →
            </span>
          </Link>

          <Link
            href="/dashboard/skills/my-skills"
            className="group rounded-[21px] bg-black/[0.025] p-5 transition hover:bg-white"
          >
            <span className="text-lg">◇</span>
            <h3 className="mt-4 text-sm font-semibold">
              Build skills
            </h3>
            <p className="mt-2 text-[10px] leading-5 text-black/35">
              Track the skills you're developing.
            </p>
            <span className="mt-4 block text-[9px] text-black/30 group-hover:text-blue-600">
              Explore →
            </span>
          </Link>

          <Link
            href="/dashboard/student/portfolio"
            className="group rounded-[21px] bg-black/[0.025] p-5 transition hover:bg-white"
          >
            <span className="text-lg">▣</span>
            <h3 className="mt-4 text-sm font-semibold">
              Create portfolio
            </h3>
            <p className="mt-2 text-[10px] leading-5 text-black/35">
              Turn your work into a visible story.
            </p>
            <span className="mt-4 block text-[9px] text-black/30 group-hover:text-blue-600">
              Build →
            </span>
          </Link>

        </div>
      </section>

    </div>
  );
}
