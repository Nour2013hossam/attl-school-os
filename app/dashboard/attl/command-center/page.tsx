import Link from "next/link";

const modules = [
  ["Team", "Manage ATTL members and roles.", "/dashboard/attl/team", "◎"],
  ["Applications", "Review students applying to ATTL.", "/dashboard/attl/applications", "◇"],
  ["Projects", "Monitor active team projects.", "/dashboard/attl/projects", "✦"],
  ["Tracks", "Technology, Innovation and Design.", "/dashboard/attl/tracks", "◈"],
  ["Events", "Plan workshops and activities.", "/dashboard/attl/events", "□"],
  ["Recruitment", "Manage the next generation of members.", "/dashboard/attl/recruitment", "↗"],
];

export default function AttlCommandCenter() {
  return (
    <div className="space-y-6">

      <section className="relative overflow-hidden rounded-[36px] bg-black p-7 text-white shadow-[0_30px_90px_rgba(0,0,0,.2)] md:p-9">
        <div className="pointer-events-none absolute right-[-80px] top-[-120px] h-80 w-80 rounded-full bg-blue-500/30 blur-[100px]" />

        <div className="relative">
          <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-white text-black font-semibold">
            A
          </div>

          <p className="mt-8 text-[10px] uppercase tracking-[.22em] text-blue-400">
            Al Thagr Technical Lab
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-[-.05em] md:text-4xl">
            ATTL Command Center
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
            The central workspace for managing the team, projects,
            recruitment, events and innovation activities.
          </p>

          <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              ["Members", "24"],
              ["Projects", "08"],
              ["Applications", "17"],
              ["Events", "06"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-[20px] border border-white/10 bg-white/[.06] p-4 backdrop-blur-xl"
              >
                <p className="text-[9px] text-white/35">{label}</p>
                <p className="mt-1 text-xl font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {modules.map(([title, description, href, icon]) => (
          <Link
            key={title}
            href={href}
            className="group rounded-[28px] border border-white/80 bg-white/60 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/85 hover:shadow-[0_20px_55px_rgba(20,30,50,.09)]"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-black text-white">
                {icon}
              </div>

              <span className="text-black/20 transition group-hover:translate-x-1">
                →
              </span>
            </div>

            <h2 className="mt-7 text-sm font-semibold">{title}</h2>

            <p className="mt-2 text-[10px] leading-5 text-black/40">
              {description}
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}
