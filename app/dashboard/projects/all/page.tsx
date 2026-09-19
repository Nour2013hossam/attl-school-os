import Link from "next/link";

const projects = [
  ["ATTL School OS", "Technology", "82%", "In Progress"],
  ["Smart School", "Innovation", "64%", "In Progress"],
  ["Climate Platform", "Research", "100%", "Completed"],
];

export default function ProjectsPage() {
  return (
    <div className="space-y-6">

      <section className="rounded-[34px] border border-white/80 bg-white/65 p-7 shadow-[0_25px_80px_rgba(20,30,50,.08)] backdrop-blur-[30px]">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-blue-500">
              Project Lab
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-[-.05em]">
              Projects
            </h1>

            <p className="mt-3 text-sm text-black/40">
              Build, collaborate, experiment and turn ideas into real projects.
            </p>
          </div>

          <Link
            href="/dashboard/projects/create"
            className="rounded-[16px] bg-black px-5 py-3 text-xs font-medium text-white shadow-lg"
          >
            + New Project
          </Link>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {projects.map(([title, track, progress, status]) => (
          <div
            key={title}
            className="group rounded-[28px] border border-white/80 bg-white/60 p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/80"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-black text-white">
                ✦
              </div>

              <span className="rounded-full bg-black/[.045] px-3 py-1 text-[9px] text-black/40">
                {status}
              </span>
            </div>

            <h2 className="mt-6 text-base font-semibold">{title}</h2>
            <p className="mt-1 text-[10px] text-black/35">{track}</p>

            <div className="mt-6">
              <div className="mb-2 flex justify-between text-[9px]">
                <span className="text-black/30">Progress</span>
                <span>{progress}</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-black/[.05]">
                <div
                  className="h-full rounded-full bg-black"
                  style={{ width: progress }}
                />
              </div>
            </div>

            <Link
              href="/dashboard/projects/my-projects"
              className="mt-6 block text-[10px] text-blue-500"
            >
              Open project →
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
}
