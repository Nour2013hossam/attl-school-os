import Link from "next/link";

const mentors = [
  ["Technology Mentor", "Software & Development", "Available"],
  ["Innovation Mentor", "Research & Innovation", "Available"],
  ["Project Mentor", "Project Management", "Busy"],
];

export default function MentorsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[34px] bg-black p-7 text-white shadow-[0_30px_90px_rgba(0,0,0,.18)] md:p-9">
        <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-blue-400">
          Mentorship
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-[-.05em]">
          Learn from people ahead of you.
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
          Find mentors, request guidance and build a development journey
          around your goals.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {mentors.map(([title, specialty, status]) => (
          <div
            key={title}
            className="rounded-[28px] border border-white/80 bg-white/60 p-6 backdrop-blur-xl transition hover:-translate-y-1"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white">
              ◎
            </div>

            <h2 className="mt-6 text-sm font-semibold">{title}</h2>

            <p className="mt-2 text-[10px] text-black/35">{specialty}</p>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-[9px] text-black/30">{status}</span>

              <Link
                href="/dashboard/mentorship/requests"
                className="rounded-[12px] bg-black px-3 py-2 text-[9px] text-white"
              >
                Request
              </Link>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["My Requests", "/dashboard/mentorship/requests"],
          ["Sessions", "/dashboard/mentorship/sessions"],
          ["Progress", "/dashboard/mentorship/progress"],
        ].map(([title, href]) => (
          <Link
            key={title}
            href={href}
            className="rounded-[24px] border border-white/80 bg-white/55 p-5 backdrop-blur-xl transition hover:bg-white"
          >
            <span className="text-lg">↗</span>
            <h3 className="mt-5 text-sm font-semibold">{title}</h3>
            <p className="mt-2 text-[10px] text-black/35">
              Open mentorship workspace →
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}
