const achievements = [
  ["01", "First Project", "Build your first project"],
  ["02", "Explorer", "Explore your first skill"],
  ["03", "ATTL Member", "Join the ATTL community"],
];

export default function StudentProfilePage() {
  return (
    <section dir="ltr" className="space-y-5">

      {/* PROFILE HERO */}
      <div className="relative overflow-hidden rounded-[34px] bg-black p-7 text-white shadow-[0_30px_90px_rgba(0,0,0,0.16)] md:p-10">

        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/20 blur-[100px]" />
        <div className="absolute -left-20 bottom-[-120px] h-80 w-80 rounded-full bg-cyan-400/10 blur-[100px]" />

        <div className="relative flex flex-col gap-8 md:flex-row md:items-end">

          <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-[32px] border border-white/10 bg-white/[0.08] text-4xl font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,.2)] backdrop-blur-xl">
            A
          </div>

          <div className="flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] text-white/45">
                Student
              </span>

              <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-[9px] text-blue-300">
                Level 01
              </span>
            </div>

            <h1 className="text-4xl font-semibold tracking-[-0.05em] md:text-5xl">
              Your Profile
            </h1>

            <p className="mt-3 max-w-xl text-sm text-white/40">
              Your identity, skills, projects, achievements and journey inside
              ATTL School OS.
            </p>
          </div>

          <button className="rounded-2xl bg-white px-5 py-3 text-xs font-semibold text-black transition hover:-translate-y-0.5">
            Edit profile
          </button>
        </div>
      </div>

      {/* IDENTITY + XP */}
      <div className="grid gap-5 lg:grid-cols-[1fr_1.5fr]">

        <div className="rounded-[30px] border border-white/80 bg-white/65 p-6 shadow-[0_15px_50px_rgba(0,0,0,0.05)] backdrop-blur-2xl">

          <p className="text-[9px] uppercase tracking-[0.2em] text-black/30">
            Identity
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <p className="text-[9px] text-black/30">Name</p>
              <p className="mt-1 text-sm font-semibold">Student</p>
            </div>

            <div>
              <p className="text-[9px] text-black/30">Role</p>
              <p className="mt-1 text-sm font-semibold">Student</p>
            </div>

            <div>
              <p className="text-[9px] text-black/30">School</p>
              <p className="mt-1 text-sm font-semibold">Al Thagr School</p>
            </div>

            <div>
              <p className="text-[9px] text-black/30">ATTL status</p>
              <p className="mt-1 text-sm font-semibold">Not a member yet</p>
            </div>
          </div>
        </div>

        <div className="rounded-[30px] border border-white/80 bg-white/65 p-6 shadow-[0_15px_50px_rgba(0,0,0,0.05)] backdrop-blur-2xl">

          <div className="flex items-start justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-black/30">
                Progress
              </p>
              <h2 className="mt-2 text-xl font-semibold">
                Experience
              </h2>
            </div>

            <div className="text-right">
              <p className="text-2xl font-semibold">0 XP</p>
              <p className="text-[9px] text-black/30">Level 01</p>
            </div>
          </div>

          <div className="mt-7 h-3 overflow-hidden rounded-full bg-black/5">
            <div className="h-full w-[3%] rounded-full bg-black" />
          </div>

          <div className="mt-3 flex justify-between text-[9px] text-black/30">
            <span>0 XP</span>
            <span>100 XP</span>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-black/[0.035] p-4">
              <p className="text-[9px] text-black/30">Projects</p>
              <p className="mt-2 text-xl font-semibold">0</p>
            </div>

            <div className="rounded-2xl bg-black/[0.035] p-4">
              <p className="text-[9px] text-black/30">Skills</p>
              <p className="mt-2 text-xl font-semibold">0</p>
            </div>

            <div className="rounded-2xl bg-black/[0.035] p-4">
              <p className="text-[9px] text-black/30">Badges</p>
              <p className="mt-2 text-xl font-semibold">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* ACHIEVEMENTS */}
      <div className="rounded-[30px] border border-white/80 bg-white/65 p-6 shadow-[0_15px_50px_rgba(0,0,0,0.05)] backdrop-blur-2xl">

        <div>
          <p className="text-[9px] uppercase tracking-[0.2em] text-black/30">
            Gamification
          </p>
          <h2 className="mt-2 text-xl font-semibold">
            Achievements
          </h2>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {achievements.map(([number, title, description]) => (
            <div
              key={title}
              className="group rounded-[24px] border border-black/5 bg-white/45 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-black/25">{number}</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/[0.04]">
                  ✦
                </span>
              </div>

              <p className="mt-5 text-sm font-semibold">{title}</p>
              <p className="mt-1 text-[10px] text-black/30">{description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* EMPTY STATE */}
      <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-blue-600 to-blue-900 p-7 text-white shadow-[0_25px_70px_rgba(37,99,235,0.18)]">

        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-[80px]" />

        <div className="relative">
          <p className="text-[9px] uppercase tracking-[0.2em] text-white/40">
            YOUR STORY
          </p>

          <h2 className="mt-3 text-2xl font-semibold">
            This is just the beginning.
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-white/50">
            Projects, competitions, skills, achievements and ATTL milestones
            will gradually become part of your profile.
          </p>
        </div>
      </div>

    </section>
  );
}