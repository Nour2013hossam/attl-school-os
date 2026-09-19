const skills = [
  ["Programming", 86, "Technical"],
  ["Problem Solving", 91, "Core"],
  ["UI / UX", 74, "Creative"],
  ["Research", 82, "Academic"],
  ["Leadership", 68, "Soft Skill"],
  ["Communication", 79, "Soft Skill"],
];

export default function SkillMapPage() {
  return (
    <div className="space-y-6">

      <section className="rounded-[34px] border border-white/80 bg-white/65 p-7 shadow-[0_25px_80px_rgba(20,30,50,.08)] backdrop-blur-[30px]">
        <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-blue-500">
          Personal Development
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-[-.05em]">
          Skill Map
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-black/40">
          Your evolving map of technical, creative, academic and leadership
          capabilities.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {skills.map(([name, value, category]) => (
          <div
            key={name}
            className="rounded-[26px] border border-white/80 bg-white/60 p-5 backdrop-blur-xl transition hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">{name}</p>
                <p className="mt-1 text-[9px] uppercase tracking-wider text-black/25">
                  {category}
                </p>
              </div>

              <span className="text-lg font-semibold">{value}%</span>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-black/[.05]">
              <div
                className="h-full rounded-full bg-black transition-all duration-700"
                style={{ width: `${value}%` }}
              />
            </div>

            <div className="mt-3 flex justify-between text-[9px] text-black/25">
              <span>Current level</span>
              <span>Next milestone {Math.min(Number(value) + 10, 100)}%</span>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
