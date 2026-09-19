"use client";

import Link from "next/link";

type Stat = {
  label: string;
  value: string;
};

type Card = {
  title: string;
  description: string;
  icon?: string;
};

type PageShellProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: string;
  stats?: Stat[];
  cards?: Card[];
  children?: React.ReactNode;
};

export function PageShell({
  eyebrow = "ATTL SCHOOL OS",
  title,
  description,
  icon = "✦",
  stats = [],
  cards = [],
  children,
}: PageShellProps) {
  return (
    <div className="space-y-6">

      {/* Hero */}
      <section className="relative overflow-hidden rounded-[32px] bg-black p-6 text-white shadow-[0_25px_80px_rgba(0,0,0,.12)] md:p-8">

        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/25 blur-[100px]" />
        <div className="absolute bottom-[-120px] left-1/3 h-72 w-72 rounded-full bg-cyan-400/10 blur-[100px]" />

        <div className="relative">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-[17px] border border-white/10 bg-white/10 text-lg backdrop-blur-xl">
              {icon}
            </div>

            <div>
              <p className="text-[8px] uppercase tracking-[.22em] text-white/40">
                {eyebrow}
              </p>

              <p className="mt-1 text-[9px] text-white/25">
                School OS workspace
              </p>
            </div>

          </div>

          <h1 className="mt-6 text-3xl font-semibold tracking-[-.06em] md:text-5xl">
            {title}
          </h1>

          {description && (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
              {description}
            </p>
          )}

        </div>
      </section>

      {/* Stats */}
      {stats.length > 0 && (
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[24px] border border-white/80 bg-white/60 p-5 shadow-[0_15px_50px_rgba(20,30,50,.05)] backdrop-blur-2xl"
            >

              <p className="text-[8px] uppercase tracking-[.18em] text-black/30">
                {stat.label}
              </p>

              <p className="mt-3 text-2xl font-semibold tracking-[-.05em]">
                {stat.value}
              </p>

            </div>
          ))}

        </section>
      )}

      {/* Custom page content */}
      {children}

      {/* Cards */}
      {cards.length > 0 && (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

          {cards.map((card) => (
            <article
              key={card.title}
              className="group rounded-[28px] border border-white/80 bg-white/60 p-6 shadow-[0_15px_50px_rgba(20,30,50,.05)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/75 hover:shadow-[0_25px_70px_rgba(20,30,50,.09)]"
            >

              <div className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-black text-sm text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
                {card.icon ?? "✦"}
              </div>

              <h2 className="mt-5 text-sm font-semibold">
                {card.title}
              </h2>

              <p className="mt-2 text-[9px] leading-5 text-black/30">
                {card.description}
              </p>

              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-black/[.06]">
                <div className="h-full w-[32%] rounded-full bg-black transition-all duration-500 group-hover:w-[55%]" />
              </div>

            </article>
          ))}

        </section>
      )}

      {/* Default state */}
      {!children && stats.length === 0 && cards.length === 0 && (
        <section className="rounded-[28px] border border-white/80 bg-white/60 p-7 shadow-[0_15px_50px_rgba(20,30,50,.05)] backdrop-blur-2xl">

          <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-black text-white">
            {icon}
          </div>

          <h2 className="mt-5 text-lg font-semibold">
            Workspace ready
          </h2>

          <p className="mt-2 max-w-xl text-[10px] leading-6 text-black/35">
            This area is part of the ATTL School OS and will become
            fully connected as the frontend and backend systems are completed.
          </p>

        </section>
      )}

      {/* System Footer */}
      <section className="rounded-[28px] bg-black p-6 text-white md:p-7">

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div>

            <p className="text-[8px] uppercase tracking-[.2em] text-white/30">
              ATTL SYSTEM
            </p>

            <h2 className="mt-2 text-lg font-semibold">
              Keep building your journey.
            </h2>

            <p className="mt-2 text-[9px] text-white/35">
              More School OS functionality will connect here as the system grows.
            </p>

          </div>

          <Link
            href="/dashboard"
            className="rounded-[15px] bg-white px-5 py-3 text-center text-[9px] font-semibold text-black transition-transform duration-300 hover:scale-[1.02]"
          >
            Back to dashboard
          </Link>

        </div>

      </section>

    </div>
  );
}
