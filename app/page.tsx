import Link from "next/link";

const platformModules = [
  {
    title: "Academics",
    eyebrow: "01",
    description: "Grades, attendance, exams, assignments, schedule and transcript in one academic space.",
    href: "/dashboard/academics",
    tone: "from-blue-500/20 via-blue-400/5 to-white/30",
  },
  {
    title: "Projects",
    eyebrow: "02",
    description: "Turn ideas into real projects with tasks, members, milestones and progress.",
    href: "/dashboard/projects/all",
    tone: "from-cyan-400/20 via-sky-300/5 to-white/30",
  },
  {
    title: "Learning",
    eyebrow: "03",
    description: "Courses, lessons, progress, bookmarks and certificates built for students.",
    href: "/dashboard/learning/courses",
    tone: "from-indigo-500/20 via-violet-300/5 to-white/30",
  },
  {
    title: "ATTL",
    eyebrow: "04",
    description: "Recruitment, tracks, team operations, initiatives and student-led innovation.",
    href: "/dashboard/attl",
    tone: "from-slate-500/15 via-blue-200/10 to-white/30",
  },
  {
    title: "Competitions",
    eyebrow: "05",
    description: "Discover opportunities, apply, track participation and keep the momentum moving.",
    href: "/dashboard/competitions/all",
    tone: "from-blue-600/15 via-cyan-300/10 to-white/30",
  },
  {
    title: "Community",
    eyebrow: "06",
    description: "Discussions, groups, polls, announcements and a connected school community.",
    href: "/dashboard/community",
    tone: "from-sky-500/15 via-blue-300/10 to-white/30",
  },
];

const principles = [
  {
    number: "01",
    title: "One school identity",
    text: "A single account follows the student across academics, projects, skills and school life.",
  },
  {
    number: "02",
    title: "Role-aware by default",
    text: "Students, teachers, ATTL members and admins see the tools their permissions allow.",
  },
  {
    number: "03",
    title: "Built for action",
    text: "Every workspace is designed around real next steps, not walls of information.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#eef3f8] text-[#08090b]">
      <div className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute -left-28 top-12 h-[540px] w-[540px] rounded-full bg-blue-400/20 blur-[125px]" />
        <div className="pointer-events-none absolute right-[-160px] top-[18%] h-[640px] w-[640px] rounded-full bg-cyan-300/20 blur-[150px]" />
        <div className="pointer-events-none absolute left-[35%] top-[34%] h-[300px] w-[300px] rounded-full bg-white/70 blur-[100px]" />

        <nav className="relative z-20 mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 md:px-8 md:py-7">
          <Link href="/" className="group flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-[14px] border border-white/90 bg-white/65 text-[12px] font-bold tracking-[-0.05em] shadow-sm backdrop-blur-2xl">
              AT
            </div>
            <div>
              <div className="text-[15px] font-bold tracking-[-0.04em]">ATTL</div>
              <div className="text-[9px] font-medium uppercase tracking-[0.19em] text-black/35">School OS</div>
            </div>
          </Link>

          <div className="hidden items-center gap-1 rounded-full border border-white/85 bg-white/42 p-1 shadow-sm backdrop-blur-2xl md:flex">
            <a href="#platform" className="rounded-full px-4 py-2 text-[10px] font-semibold text-black/55 hover:bg-white/65 hover:text-black">Platform</a>
            <a href="#how-it-works" className="rounded-full px-4 py-2 text-[10px] font-semibold text-black/55 hover:bg-white/65 hover:text-black">How it works</a>
            <a href="#vision" className="rounded-full px-4 py-2 text-[10px] font-semibold text-black/55 hover:bg-white/65 hover:text-black">Vision</a>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-[14px] border border-white/80 bg-white/65 px-4 py-2.5 text-[10px] font-semibold shadow-sm backdrop-blur-xl hover:bg-white"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-[14px] bg-black px-4 py-2.5 text-[10px] font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,.18)] hover:-translate-y-0.5"
            >
              Get started
            </Link>
          </div>
        </nav>

        <section className="relative z-10 mx-auto max-w-[1240px] px-5 pb-20 pt-16 md:px-8 md:pb-28 md:pt-20">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/62 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.25em] text-black/40 shadow-sm backdrop-blur-2xl">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              Al Thagr Technical Lab
            </div>

            <h1 className="mt-8 text-[58px] font-semibold leading-[0.92] tracking-[-0.085em] md:text-[96px] lg:text-[118px]">
              Your school.
              <br />
              <span className="bg-gradient-to-b from-black/55 to-black/20 bg-clip-text text-transparent">
                Reimagined.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-[14px] leading-7 text-black/48 md:text-[15px]">
              ATTL School OS brings academics, projects, skills, competitions, innovation and student life together in one intelligent school platform.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link
                href="/dashboard"
                className="rounded-[17px] bg-black px-6 py-4 text-[10px] font-semibold text-white shadow-[0_18px_45px_rgba(0,0,0,.16)] hover:-translate-y-0.5"
              >
                Explore School OS
              </Link>
              <a
                href="#platform"
                className="rounded-[17px] border border-white/90 bg-white/58 px-6 py-4 text-[10px] font-semibold shadow-sm backdrop-blur-2xl hover:-translate-y-0.5 hover:bg-white/78"
              >
                See what&apos;s inside
              </a>
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-6xl rounded-[32px] border border-white/90 bg-white/42 p-2 shadow-[0_30px_100px_rgba(35,60,95,.12)] backdrop-blur-3xl md:mt-20 md:p-3">
            <div className="relative overflow-hidden rounded-[27px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,.9),rgba(232,241,253,.55))] p-6 md:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(81,147,255,.16),transparent_28%),radial-gradient(circle_at_88%_70%,rgba(42,211,255,.14),transparent_28%)]" />
              <div className="relative grid gap-8 lg:grid-cols-[1.05fr_.95fr]">
                <div className="rounded-[24px] border border-white/85 bg-white/62 p-5 shadow-[0_18px_50px_rgba(20,35,60,.08)] backdrop-blur-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[9px] uppercase tracking-[0.2em] text-black/30">School overview</div>
                      <div className="mt-1 text-lg font-semibold tracking-[-.04em]">Everything in one view.</div>
                    </div>
                    <div className="rounded-full border border-white bg-white/80 px-3 py-1 text-[9px] font-semibold text-black/45">Live</div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      ["Academics", "24/7"],
                      ["Projects", "18"],
                      ["Skills", "32"],
                      ["Events", "07"],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-[18px] border border-white/80 bg-white/65 p-4">
                        <div className="text-[9px] text-black/35">{label}</div>
                        <div className="mt-2 text-xl font-semibold tracking-[-.05em]">{value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 rounded-[18px] border border-white/80 bg-black/[.045] p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[9px] uppercase tracking-[0.18em] text-black/30">Your next move</div>
                        <div className="mt-1 text-sm font-semibold tracking-[-.02em]">Continue building your project</div>
                      </div>
                      <span className="rounded-full bg-black px-2.5 py-1 text-[8px] font-semibold text-white">Open</span>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/8">
                      <div className="h-full w-[72%] rounded-full bg-black" />
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["Student", "Your courses, grades, projects and goals.", "/dashboard"],
                    ["Teacher", "Classes, attendance, gradebook and exams.", "/dashboard/teacher/overview"],
                    ["ATTL", "Team operations, tracks and recruitment.", "/dashboard/attl"],
                    ["Admin", "Control the school from one workspace.", "/dashboard/admin/overview"],
                  ].map(([role, copy, href]) => (
                    <Link
                      key={role}
                      href={href}
                      className="group rounded-[22px] border border-white/85 bg-white/58 p-5 shadow-sm backdrop-blur-2xl hover:-translate-y-1 hover:bg-white/75"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-black/32">{role}</span>
                        <span className="grid h-7 w-7 place-items-center rounded-full border border-white bg-white/70 text-[12px] transition-transform group-hover:translate-x-0.5">↗</span>
                      </div>
                      <p className="mt-12 max-w-[180px] text-[13px] leading-6 text-black/58">{copy}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section id="platform" className="relative border-t border-black/5 bg-white/72 px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="text-[9px] font-semibold uppercase tracking-[0.24em] text-blue-500">The platform</div>
              <h2 className="mt-3 max-w-2xl text-4xl font-semibold tracking-[-.06em] md:text-6xl">
                One place for the work that matters.
              </h2>
            </div>
            <p className="max-w-md text-[13px] leading-6 text-black/43">
              The home should feel like the front door to the whole school system — useful before you even sign in.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {platformModules.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={`group relative min-h-[230px] overflow-hidden rounded-[27px] border border-black/5 bg-gradient-to-br ${item.tone} p-6 shadow-[0_18px_55px_rgba(30,45,70,.07)] hover:-translate-y-1`}
              >
                <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-white/45 blur-2xl transition-transform duration-500 group-hover:scale-125" />
                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-black/28">{item.eyebrow}</span>
                    <span className="grid h-9 w-9 place-items-center rounded-full border border-white/85 bg-white/58 text-[13px] shadow-sm backdrop-blur-xl transition-transform group-hover:translate-x-0.5">↗</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold tracking-[-.045em]">{item.title}</h3>
                    <p className="mt-3 max-w-sm text-[12px] leading-6 text-black/47">{item.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-t border-black/5 bg-[#f4f7fb] px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div>
            <div className="text-[9px] font-semibold uppercase tracking-[0.24em] text-black/35">How it works</div>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-.06em] md:text-6xl">
              Less hunting.
              <br />
              More doing.
            </h2>
            <p className="mt-5 max-w-md text-[13px] leading-7 text-black/45">
              Every account opens into a role-aware workspace, so the right tools are close without turning the system into a maze.
            </p>
          </div>

          <div className="space-y-3">
            {principles.map((item) => (
              <div key={item.number} className="rounded-[24px] border border-white/90 bg-white/68 p-5 shadow-sm backdrop-blur-2xl md:p-6">
                <div className="grid gap-4 md:grid-cols-[70px_1fr]">
                  <div className="text-[10px] font-semibold tracking-[0.16em] text-blue-500">{item.number}</div>
                  <div>
                    <h3 className="text-lg font-semibold tracking-[-.03em]">{item.title}</h3>
                    <p className="mt-2 max-w-xl text-[12px] leading-6 text-black/45">{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="vision" className="px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-[1240px] overflow-hidden rounded-[34px] border border-white/90 bg-black p-7 text-white shadow-[0_35px_110px_rgba(20,30,50,.2)] md:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
            <div>
              <div className="text-[9px] font-semibold uppercase tracking-[0.24em] text-white/35">Built for the future of school</div>
              <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-.065em] md:text-6xl">
                A school system that grows with its students.
              </h2>
              <p className="mt-5 max-w-2xl text-[13px] leading-7 text-white/48">
                From the first class to the first competition, from a small idea to a real project — ATTL School OS is designed to connect the journey.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 lg:justify-end">
              {["Academics", "Innovation", "Community", "Leadership", "Skills", "Projects"].map((item) => (
                <span key={item} className="rounded-full border border-white/12 bg-white/[.06] px-3 py-2 text-[10px] font-medium text-white/62">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/register" className="rounded-[16px] bg-white px-5 py-3 text-[10px] font-semibold text-black hover:-translate-y-0.5">
              Start your journey
            </Link>
            <Link href="/login" className="rounded-[16px] border border-white/12 bg-white/[.06] px-5 py-3 text-[10px] font-semibold text-white/75 hover:bg-white/[.1]">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-black/5 px-5 py-8 md:px-8">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-2 text-[9px] text-black/35 md:flex-row md:items-center md:justify-between">
          <span>ATTL — Al Thagr Technical Lab</span>
          <span>School OS · Academics · Projects · Innovation · Community</span>
        </div>
      </footer>
    </main>
  );
}
