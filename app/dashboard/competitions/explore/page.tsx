import Link from "next/link";

const competitions = [
  {
    title: "ISEF Science & Engineering",
    category: "Science",
    date: "Oct 18",
    status: "Open",
    icon: "◇",
  },
  {
    title: "Climate Innovation Challenge",
    category: "Innovation",
    date: "Nov 02",
    status: "Open",
    icon: "◈",
  },
  {
    title: "School Hackathon",
    category: "Technology",
    date: "Nov 14",
    status: "Coming Soon",
    icon: "⌘",
  },
];

export default function CompetitionsPage() {
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[34px] border border-white/80 bg-white/65 p-7 shadow-[0_25px_80px_rgba(20,30,50,.08)] backdrop-blur-[30px]">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-400/15 blur-[90px]" />

        <div className="relative">
          <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-blue-500">
            Competition Hub
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-[-.05em]">
            Compete. Build. Represent.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/40">
            Discover competitions, challenges and opportunities to represent
            yourself and your school.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ["Available", "12"],
          ["Joined", "04"],
          ["Applications", "02"],
          ["Awards", "03"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-[24px] border border-white/80 bg-white/60 p-5 backdrop-blur-xl"
          >
            <p className="text-[10px] text-black/35">{label}</p>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {competitions.map((competition) => (
          <div
            key={competition.title}
            className="group rounded-[28px] border border-white/80 bg-white/60 p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/85"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-black text-white">
                {competition.icon}
              </div>

              <span className="rounded-full bg-black/[.045] px-3 py-1 text-[9px] text-black/45">
                {competition.status}
              </span>
            </div>

            <p className="mt-6 text-[9px] uppercase tracking-wider text-blue-500">
              {competition.category}
            </p>

            <h2 className="mt-2 text-base font-semibold leading-6">
              {competition.title}
            </h2>

            <p className="mt-3 text-[10px] text-black/35">
              Registration deadline · {competition.date}
            </p>

            <Link
              href="/dashboard/competitions/my-competitions"
              className="mt-6 block rounded-[14px] bg-black py-3 text-center text-[10px] text-white transition hover:opacity-80"
            >
              Explore competition
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
}
