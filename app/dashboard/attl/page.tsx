import { Spotlight } from "@/components/effects/spotlight";

const tracks = [
  {
    name: "Technology",
    description: "Programming, software, AI, and emerging technologies.",
    members: 18,
    color: "bg-blue-500",
  },
  {
    name: "Innovation",
    description: "Research, inventions, ideas, and problem solving.",
    members: 12,
    color: "bg-cyan-500",
  },
  {
    name: "Media & Design",
    description: "Design, content, branding, and creative production.",
    members: 9,
    color: "bg-indigo-500",
  },
];

export default function ATTLPage() {
  return (
    <main className="space-y-6">
      <section>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-500">
          Al Thagr Technical Lab
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em]">
          ATTL
        </h1>
        <p className="mt-2 text-sm text-black/45">
          Build. Compete. Create impact.
        </p>
      </section>

      <Spotlight>
        <section className="relative overflow-hidden rounded-[32px] border border-white/80 bg-black p-7 text-white shadow-[0_25px_70px_rgba(0,0,0,0.15)]">
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-blue-500/30 blur-[80px]" />
          <div className="relative">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-300">
              ATTL Command
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">
              Build something that matters.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">
              Explore ATTL tracks, projects, competitions, events, and
              opportunities for distinguished students.
            </p>
            <button className="mt-6 rounded-2xl bg-white px-5 py-3 text-xs font-semibold text-black transition hover:scale-[1.02]">
              Explore ATTL
            </button>
          </div>
        </section>
      </Spotlight>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/35">
              Tracks
            </p>
            <h2 className="mt-1 text-xl font-semibold">Explore tracks</h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tracks.map((track) => (
            <Spotlight key={track.name}>
              <div className="rounded-[28px] border border-white/80 bg-white/65 p-5 shadow-[0_18px_50px_rgba(20,30,50,0.07)] backdrop-blur-2xl">
                <div className="h-2 w-14 rounded-full" />

                <h3 className="mt-5 text-lg font-semibold">{track.name}</h3>
                <p className="mt-2 text-sm leading-6 text-black/45">
                  {track.description}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-[11px] text-black/35">
                    {track.members} members
                  </span>
                  <span className="text-sm text-black/30">→</span>
                </div>
              </div>
            </Spotlight>
          ))}
        </div>
      </section>
    </main>
  );
}

