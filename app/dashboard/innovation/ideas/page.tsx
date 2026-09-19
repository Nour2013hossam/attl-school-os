import Link from "next/link";

const ideas = [
  ["Smart Classroom", "Technology", "Reviewing"],
  ["Water Saving System", "Sustainability", "Prototype"],
  ["AI Study Companion", "Education", "Research"],
];

export default function InnovationIdeasPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[34px] bg-black p-7 text-white shadow-[0_30px_90px_rgba(0,0,0,.18)] md:p-9">
        <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-blue-400">
          Innovation Lab
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-[-.05em]">
          Ideas become reality.
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
          Submit ideas, develop experiments and turn problems into meaningful
          solutions.
        </p>

        <Link
          href="/dashboard/innovation/submit"
          className="mt-7 inline-flex rounded-[16px] bg-white px-5 py-3 text-xs font-medium text-black transition hover:-translate-y-0.5"
        >
          Submit an idea
        </Link>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {ideas.map(([title, category, status]) => (
          <div
            key={title}
            className="rounded-[28px] border border-white/80 bg-white/60 p-6 backdrop-blur-xl transition hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-black text-white">
                ⚡
              </div>

              <span className="text-[9px] text-black/30">{status}</span>
            </div>

            <h2 className="mt-6 text-base font-semibold">{title}</h2>

            <p className="mt-1 text-[10px] text-blue-500">{category}</p>

            <p className="mt-4 text-[10px] leading-5 text-black/35">
              An innovation workspace where the idea can evolve through
              research, testing and iteration.
            </p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["Ideas", "/dashboard/innovation/ideas", "Explore submitted ideas."],
          ["Experiments", "/dashboard/innovation/experiments", "Track prototypes and tests."],
          ["Research", "/dashboard/innovation/research", "Organize research work."],
        ].map(([title, href, description]) => (
          <Link
            key={title}
            href={href}
            className="rounded-[24px] border border-white/80 bg-white/55 p-5 backdrop-blur-xl transition hover:bg-white"
          >
            <span className="text-lg">✦</span>
            <h3 className="mt-5 text-sm font-semibold">{title}</h3>
            <p className="mt-2 text-[10px] text-black/35">{description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
