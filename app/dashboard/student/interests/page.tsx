"use client";

import Link from "next/link";
import { useState } from "react";

const interestGroups = [
  {
    title: "Technology",
    description: "Build, code and explore technology.",
    interests: ["Software Development", "AI", "Cybersecurity", "Web Development"],
  },
  {
    title: "Science",
    description: "Explore scientific thinking and discovery.",
    interests: ["Physics", "Chemistry", "Biology", "Research"],
  },
  {
    title: "Creative",
    description: "Create, design and communicate ideas.",
    interests: ["UI/UX", "Design", "Writing", "Photography"],
  },
  {
    title: "Leadership",
    description: "Develop teams, initiatives and communities.",
    interests: ["Leadership", "Public Speaking", "Teamwork", "Entrepreneurship"],
  },
];

const recommendations = [
  {
    title: "Web Development",
    reason: "Matches your project activity.",
    icon: "⌘",
  },
  {
    title: "AI",
    reason: "A growing area across ATTL projects.",
    icon: "✦",
  },
  {
    title: "Research",
    reason: "Connects with innovation opportunities.",
    icon: "◇",
  },
];

export default function StudentInterestsPage() {
  const [selected, setSelected] = useState<string[]>([
    "Software Development",
    "AI",
  ]);

  const toggleInterest = (interest: string) => {
    setSelected((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    );
  };

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
              Interests
            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-[-0.06em] md:text-5xl">
              Follow what interests you.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
              Your interests help School OS connect you with projects,
              learning paths, competitions and people.
            </p>
          </div>

          <div className="rounded-[23px] border border-white/10 bg-white/[0.06] p-5">

            <p className="text-[8px] uppercase tracking-[0.18em] text-white/30">
              Selected
            </p>

            <p className="mt-3 text-4xl font-semibold tracking-[-0.07em]">
              {selected.length}
            </p>

            <p className="mt-1 text-[9px] text-white/30">
              Interests
            </p>

          </div>

        </div>
      </section>

      {/* Selected */}
      <section className="rounded-[30px] border border-white/80 bg-white/60 p-6 shadow-[0_15px_50px_rgba(20,30,50,0.05)] backdrop-blur-2xl md:p-8">

        <div className="flex items-end justify-between gap-4">

          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-black/30">
              Your profile
            </p>

            <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em]">
              Selected interests
            </h2>
          </div>

          <span className="text-[9px] text-black/30">
            {selected.length} selected
          </span>

        </div>

        <div className="mt-6 flex flex-wrap gap-2">

          {selected.length > 0 ? (
            selected.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className="group rounded-full bg-black px-4 py-2.5 text-[9px] font-semibold text-white transition hover:bg-black/80"
              >
                {interest}
                <span className="ml-2 text-white/40 group-hover:text-white">
                  ×
                </span>
              </button>
            ))
          ) : (
            <div className="rounded-[18px] bg-black/[0.025] px-4 py-3 text-[9px] text-black/35">
              Select interests below to personalize your experience.
            </div>
          )}

        </div>
      </section>

      {/* Interest Groups */}
      <section className="space-y-3">

        {interestGroups.map((group) => (
          <div
            key={group.title}
            className="rounded-[28px] border border-white/80 bg-white/60 p-6 shadow-[0_12px_40px_rgba(20,30,50,0.04)] backdrop-blur-2xl md:p-7"
          >

            <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">

              <div>
                <p className="text-[9px] uppercase tracking-[0.18em] text-black/30">
                  Interest group
                </p>

                <h2 className="mt-1 text-lg font-semibold tracking-[-0.04em]">
                  {group.title}
                </h2>
              </div>

              <p className="text-[9px] text-black/30">
                {group.description}
              </p>

            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">

              {group.interests.map((interest) => {
                const active = selected.includes(interest);

                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={
                      active
                        ? "group rounded-[19px] border border-black bg-black p-4 text-left text-white shadow-lg transition hover:-translate-y-0.5"
                        : "group rounded-[19px] border border-black/[0.05] bg-black/[0.025] p-4 text-left transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
                    }
                  >

                    <div className="flex items-center justify-between">

                      <span
                        className={
                          active
                            ? "flex h-8 w-8 items-center justify-center rounded-[11px] bg-white/10 text-[11px]"
                            : "flex h-8 w-8 items-center justify-center rounded-[11px] bg-white text-[11px] shadow-sm"
                        }
                      >
                        {active ? "✓" : "＋"}
                      </span>

                      {active && (
                        <span className="text-[7px] uppercase tracking-[0.15em] text-white/30">
                          Selected
                        </span>
                      )}

                    </div>

                    <p className="mt-4 text-[10px] font-semibold">
                      {interest}
                    </p>

                    <p
                      className={
                        active
                          ? "mt-1 text-[8px] text-white/35"
                          : "mt-1 text-[8px] text-black/30"
                      }
                    >
                      Personal interest
                    </p>

                  </button>
                );
              })}

            </div>
          </div>
        ))}

      </section>

      {/* Recommendations */}
      <section className="rounded-[30px] bg-black p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.12)] md:p-8">

        <div>
          <p className="text-[9px] uppercase tracking-[0.2em] text-white/30">
            School OS suggestions
          </p>

          <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em]">
            You might explore
          </h2>
        </div>

        <div className="mt-6 grid gap-2 md:grid-cols-3">

          {recommendations.map((item) => (
            <div
              key={item.title}
              className="rounded-[21px] border border-white/10 bg-white/[0.05] p-4"
            >

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-white/10 text-sm">
                  {item.icon}
                </div>

                <div>
                  <p className="text-[10px] font-semibold">
                    {item.title}
                  </p>

                  <p className="mt-1 text-[8px] text-white/30">
                    {item.reason}
                  </p>
                </div>

              </div>

            </div>
          ))}

        </div>

      </section>

      {/* Connections */}
      <section className="grid gap-3 md:grid-cols-3">

        <Link
          href="/dashboard/learning/explore"
          className="rounded-[24px] border border-white/80 bg-white/60 p-5 transition hover:-translate-y-1 hover:shadow-lg"
        >
          <p className="text-[9px] uppercase tracking-[0.16em] text-black/30">
            Explore
          </p>
          <h3 className="mt-2 text-sm font-semibold">
            Learning paths
          </h3>
          <p className="mt-1 text-[9px] text-black/30">
            Find learning content based on your interests.
          </p>
        </Link>

        <Link
          href="/dashboard/projects/discover"
          className="rounded-[24px] border border-white/80 bg-white/60 p-5 transition hover:-translate-y-1 hover:shadow-lg"
        >
          <p className="text-[9px] uppercase tracking-[0.16em] text-black/30">
            Build
          </p>
          <h3 className="mt-2 text-sm font-semibold">
            Discover projects
          </h3>
          <p className="mt-1 text-[9px] text-black/30">
            Find projects that match your interests.
          </p>
        </Link>

        <Link
          href="/dashboard/skills/skill-map"
          className="rounded-[24px] border border-white/80 bg-white/60 p-5 transition hover:-translate-y-1 hover:shadow-lg"
        >
          <p className="text-[9px] uppercase tracking-[0.16em] text-black/30">
            Develop
          </p>
          <h3 className="mt-2 text-sm font-semibold">
            Skill map
          </h3>
          <p className="mt-1 text-[9px] text-black/30">
            Turn your interests into skills.
          </p>
        </Link>

      </section>

    </div>
  );
}
