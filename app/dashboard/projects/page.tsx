import { Spotlight } from "@/components/effects/spotlight";

const projects = [
  { title: "Climate Innovation", status: "Active", progress: 72, members: 4 },
  { title: "Smart School", status: "Planning", progress: 35, members: 6 },
  { title: "ATTL School OS", status: "Building", progress: 58, members: 3 },
];

export default function ProjectsPage() {
  return (
    <main className="space-y-6">
      <section>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-500">
          Workspace
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em]">
          Projects
        </h1>
        <p className="mt-2 text-sm text-black/45">
          Build, track, and collaborate on your school projects.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <Spotlight key={project.title}>
            <div className="rounded-[28px] border border-white/80 bg-white/65 p-5 shadow-[0_18px_50px_rgba(20,30,50,0.07)] backdrop-blur-2xl">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
                  ✦
                </div>
                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-[10px] font-semibold text-blue-600">
                  {project.status}
                </span>
              </div>

              <h2 className="mt-6 text-lg font-semibold">{project.title}</h2>

              <div className="mt-5">
                <div className="mb-2 flex justify-between text-[11px] text-black/40">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-black/5">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-5 text-[11px] text-black/40">
                {project.members} members
              </div>
            </div>
          </Spotlight>
        ))}
      </div>

      <Spotlight>
        <section className="rounded-[28px] border border-white/80 bg-white/55 p-6 backdrop-blur-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">
            Project Lab
          </p>
          <h2 className="mt-2 text-xl font-semibold">
            Turn ideas into real projects.
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-black/45">
            Create teams, define milestones, track progress, and document
            everything your team builds.
          </p>
          <button className="mt-5 rounded-2xl bg-black px-5 py-3 text-xs font-semibold text-white transition hover:scale-[1.02]">
            Create Project
          </button>
        </section>
      </Spotlight>
    </main>
  );
}

