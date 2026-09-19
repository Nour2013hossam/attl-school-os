import { Spotlight } from "@/components/effects/spotlight";

const skills = [
  { name: "Programming", level: 72, category: "Technology" },
  { name: "Problem Solving", level: 84, category: "Core" },
  { name: "UI / UX", level: 61, category: "Design" },
  { name: "Leadership", level: 48, category: "Leadership" },
  { name: "Research", level: 67, category: "Academic" },
  { name: "Communication", level: 76, category: "Soft Skill" },
];

export default function SkillsPage() {
  return (
    <main className="space-y-6">
      <section>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-500">
          Development
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em]">
          Skills
        </h1>
        <p className="mt-2 text-sm text-black/45">
          Discover your strengths and build the skills that matter.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {skills.map((skill) => (
          <Spotlight key={skill.name}>
            <div className="rounded-[28px] border border-white/80 bg-white/65 p-5 shadow-[0_18px_50px_rgba(20,30,50,0.07)] backdrop-blur-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-black/35">
                    {skill.category}
                  </p>
                  <h2 className="mt-1 text-base font-semibold">
                    {skill.name}
                  </h2>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
                  {skill.level}
                </div>
              </div>

              <div className="mt-6 h-2 overflow-hidden rounded-full bg-black/5">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${skill.level}%` }}
                />
              </div>

              <div className="mt-2 flex justify-between text-[10px] text-black/35">
                <span>Current level</span>
                <span>{skill.level}/100</span>
              </div>
            </div>
          </Spotlight>
        ))}
      </div>

      <Spotlight>
        <section className="rounded-[28px] border border-white/80 bg-white/55 p-6 backdrop-blur-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-500">
            Skill Growth
          </p>
          <h2 className="mt-2 text-xl font-semibold">
            Your skill journey starts here.
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-black/45">
            Complete challenges, join projects, attend workshops, and earn XP
            to grow your skill profile.
          </p>
        </section>
      </Spotlight>
    </main>
  );
}

