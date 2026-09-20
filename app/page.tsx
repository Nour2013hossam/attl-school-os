import Link from "next/link";
import { HomeMembers } from "@/components/home/members-section";

const platformModules = [
  {
    index: "01",
    title: "Academics",
    description: "Grades, attendance, exams, assignments, subjects and schedules.",
    href: "/dashboard/academics/overview",
    tags: ["Grades", "Attendance", "Exams"],
    tone: "from-blue-500/18 via-blue-300/8 to-white/35",
  },
  {
    index: "02",
    title: "Projects",
    description: "Build real work with teams, tasks, milestones and progress.",
    href: "/dashboard/projects/all",
    tags: ["Teams", "Tasks", "Milestones"],
    tone: "from-sky-400/18 via-cyan-300/8 to-white/35",
  },
  {
    index: "03",
    title: "Learning",
    description: "Courses, lessons, progress, bookmarks and certificates.",
    href: "/dashboard/learning/courses",
    tags: ["Courses", "Progress", "Certificates"],
    tone: "from-indigo-500/16 via-violet-300/8 to-white/35",
  },
  {
    index: "04",
    title: "ATTL",
    description: "Recruitment, tracks, team operations and student-led initiatives.",
    href: "/dashboard/attl",
    tags: ["Team", "Tracks", "Operations"],
    tone: "from-slate-500/14 via-blue-200/9 to-white/35",
  },
  {
    index: "05",
    title: "Competitions",
    description: "Discover opportunities, apply, follow participation and results.",
    href: "/dashboard/competitions/explore",
    tags: ["Explore", "Apply", "Results"],
    tone: "from-blue-600/14 via-cyan-200/10 to-white/35",
  },
  {
    index: "06",
    title: "Community",
    description: "Discussions, groups, polls, announcements and school connections.",
    href: "/dashboard/community/feed",
    tags: ["Groups", "Discussions", "Updates"],
    tone: "from-cyan-500/14 via-blue-200/10 to-white/35",
  },
];

const workflow = [
  {
    number: "01",
    title: "Discover",
    text: "Find a course, project, competition, event or community space that matches what you want to do next.",
  },
  {
    number: "02",
    title: "Build",
    text: "Turn the idea into action with tasks, milestones, learning progress and people around you.",
  },
  {
    number: "03",
    title: "Show",
    text: "Keep a visible record of progress, achievements, certificates, projects and outcomes.",
  },
];

const roleCards = [
  {
    title: "Students",
    text: "One workspace for school, learning, projects, goals and opportunities.",
    href: "/register",
    meta: "LEARN · BUILD · GROW",
  },
  {
    title: "Teachers",
    text: "A focused view for classes, students, attendance, grades, assignments and exams.",
    href: "/dashboard/teacher/overview",
    meta: "TEACH · TRACK · SUPPORT",
  },
  {
    title: "ATTL",
    text: "A command center for team operations, recruitment, tracks and initiatives.",
    href: "/dashboard/attl/command-center",
    meta: "LEAD · CREATE · SHIP",
  },
  {
    title: "School admin",
    text: "Control users, permissions, academics, events, projects, ATTL and system settings.",
    href: "/dashboard/admin/overview",
    meta: "CONTROL · GOVERN · INSIGHT",
  },
];

const journeys = [
  ["Academics", "Know where you stand.", "/dashboard/academics/overview"],
  ["Skills", "See what you can build.", "/dashboard/skills"],
  ["Innovation", "Turn questions into ideas.", "/dashboard/innovation/lab"],
  ["Mentorship", "Learn with people.", "/dashboard/mentorship/mentors"],
  ["Events", "Step into the school life.", "/dashboard/events/discover"],
  ["Showcase", "Put your work forward.", "/dashboard/projects/showcase"],
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#eef3f8] text-[#08090b]">
      <div className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute -left-40 top-10 h-[560px] w-[560px] rounded-full bg-blue-400/18 blur-[135px]" />
        <div className="pointer-events-none absolute right-[-180px] top-[10%] h-[700px] w-[700px] rounded-full bg-cyan-300/18 blur-[160px]" />
        <div className="pointer-events-none absolute left-[32%] top-[20%] h-[400px] w-[400px] rounded-full bg-white/80 blur-[120px]" />

        <nav className="relative z-30 mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 md:px-8 md:py-7">
          <Link href="/" className="group flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-[14px] border border-white/90 bg-white/70 text-[11px] font-bold tracking-[-.05em] shadow-sm backdrop-blur-2xl group-hover:-translate-y-0.5">
              AT
            </div>
            <div>
              <div className="text-[15px] font-bold tracking-[-.04em]">ATTL</div>
              <div className="text-[9px] font-medium uppercase tracking-[.19em] text-black/35">School OS</div>
            </div>
          </Link>

          <div className="hidden items-center gap-1 rounded-full border border-white/85 bg-white/45 p-1 shadow-sm backdrop-blur-2xl md:flex">
            {[
              ["Platform", "#platform"],
              ["Experience", "#experience"],
              ["Journey", "#journey"],
              ["Members", "#members"],
              ["Vision", "#vision"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="rounded-full px-4 py-2 text-[10px] font-semibold text-black/55 hover:bg-white/70 hover:text-black"
              >
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-[14px] border border-white/85 bg-white/68 px-4 py-2.5 text-[10px] font-semibold shadow-sm backdrop-blur-xl hover:bg-white"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-[14px] bg-black px-4 py-2.5 text-[10px] font-semibold text-white shadow-[0_12px_34px_rgba(0,0,0,.18)] hover:-translate-y-0.5"
            >
              Get started
            </Link>
          </div>
        </nav>

        <section className="relative z-10 mx-auto max-w-[1240px] px-5 pb-16 pt-14 md:px-8 md:pb-24 md:pt-20">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/62 px-4 py-2 text-[9px] font-semibold uppercase tracking-[.25em] text-black/38 shadow-sm backdrop-blur-2xl">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              Al Thagr Technical Lab
            </div>

            <h1 className="mt-8 text-[58px] font-semibold leading-[.9] tracking-[-.09em] md:text-[94px] lg:text-[120px]">
              Your school.
              <br />
              <span className="bg-gradient-to-b from-black/55 to-black/18 bg-clip-text text-transparent">
                Reimagined.
              </span>
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-[14px] leading-7 text-black/48 md:text-[15px]">
              ATTL School OS connects academics, projects, learning, skills, competitions, innovation and student life in one intelligent school platform.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link
                href="/dashboard"
                className="rounded-[17px] bg-black px-6 py-4 text-[10px] font-semibold text-white shadow-[0_18px_45px_rgba(0,0,0,.16)] hover:-translate-y-0.5"
              >
                Open School OS
              </Link>
              <a
                href="#platform"
                className="rounded-[17px] border border-white/90 bg-white/58 px-6 py-4 text-[10px] font-semibold shadow-sm backdrop-blur-2xl hover:-translate-y-0.5 hover:bg-white/78"
              >
                Explore the system
              </a>
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-6xl rounded-[34px] border border-white/90 bg-white/44 p-2 shadow-[0_32px_100px_rgba(35,60,95,.12)] backdrop-blur-3xl md:mt-20 md:p-3">
            <div className="relative overflow-hidden rounded-[29px] border border-white/80 bg-[linear-gradient(135deg,rgba(255,255,255,.94),rgba(230,240,253,.52))] p-5 md:p-7">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_5%,rgba(75,145,255,.16),transparent_28%),radial-gradient(circle_at_92%_78%,rgba(52,211,255,.15),transparent_30%)]" />

              <div className="relative grid gap-5 lg:grid-cols-[1.08fr_.92fr]">
                <div className="rounded-[24px] border border-white/85 bg-white/65 p-5 shadow-[0_18px_50px_rgba(20,35,60,.07)] backdrop-blur-2xl md:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[9px] font-medium uppercase tracking-[.18em] text-black/30">A glimpse inside</div>
                      <div className="mt-1 text-xl font-semibold tracking-[-.045em]">The school, at a glance.</div>
                    </div>
                    <div className="rounded-full border border-white bg-white/80 px-3 py-1 text-[9px] font-semibold text-black/42">Live workspace</div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      ["Academic", "Hub"],
                      ["Projects", "Flow"],
                      ["Skills", "Map"],
                      ["Student", "Life"],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-[18px] border border-white/80 bg-white/68 p-4">
                        <div className="text-[9px] text-black/34">{label}</div>
                        <div className="mt-2 text-[17px] font-semibold tracking-[-.04em]">{value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 rounded-[18px] border border-white/80 bg-black/[.035] p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-[9px] font-medium uppercase tracking-[.18em] text-black/30">Today</div>
                        <div className="mt-1 text-sm font-semibold tracking-[-.025em]">One dashboard. Your next move.</div>
                      </div>
                      <span className="rounded-full bg-black px-2.5 py-1 text-[8px] font-semibold text-white">Focus</span>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/8">
                        <div className="h-full w-[72%] rounded-full bg-black" />
                      </div>
                      <span className="text-[8px] font-semibold text-black/36">72%</span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {roleCards.map((role) => (
                    <Link
                      key={role.title}
                      href={role.href}
                      className="group rounded-[22px] border border-white/85 bg-white/58 p-5 shadow-sm backdrop-blur-2xl hover:-translate-y-1 hover:bg-white/78"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-semibold uppercase tracking-[.18em] text-black/32">{role.meta}</span>
                        <span className="grid h-7 w-7 place-items-center rounded-full border border-white bg-white/72 text-[12px] transition-transform group-hover:translate-x-0.5">
                          ↗
                        </span>
                      </div>
                      <div className="mt-10 text-lg font-semibold tracking-[-.04em]">{role.title}</div>
                      <p className="mt-2 text-[12px] leading-6 text-black/48">{role.text}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-7 grid max-w-6xl grid-cols-2 gap-2 md:grid-cols-4">
            {[
              ["01", "One identity", "School-wide account"],
              ["02", "One system", "Connected workspaces"],
              ["03", "One journey", "From class to project"],
              ["04", "One control layer", "Permissions by role"],
            ].map(([n, title, text]) => (
              <div key={n} className="rounded-[20px] border border-white/80 bg-white/44 px-4 py-4 backdrop-blur-2xl">
                <div className="text-[8px] font-semibold uppercase tracking-[.18em] text-blue-500">{n}</div>
                <div className="mt-2 text-[11px] font-semibold tracking-[-.02em]">{title}</div>
                <div className="mt-1 text-[9px] leading-4 text-black/38">{text}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section id="platform" className="relative border-t border-black/5 bg-white/74 px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="text-[9px] font-semibold uppercase tracking-[.24em] text-blue-500">The platform</div>
              <h2 className="mt-3 max-w-3xl text-4xl font-semibold tracking-[-.065em] md:text-6xl">
                Everything your school needs.
                <br />
                Nothing hidden behind the noise.
              </h2>
            </div>
            <p className="max-w-md text-[13px] leading-6 text-black/43">
              Every module has its own space, but the experience stays connected so you can move from one part of school life to another without losing context.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {platformModules.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={`group relative min-h-[260px] overflow-hidden rounded-[28px] border border-black/5 bg-gradient-to-br ${item.tone} p-6 shadow-[0_18px_55px_rgba(30,45,70,.07)] hover:-translate-y-1`}
              >
                <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-white/48 blur-2xl transition-transform duration-500 group-hover:scale-125" />
                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-semibold uppercase tracking-[.18em] text-black/28">{item.index}</span>
                    <span className="grid h-9 w-9 place-items-center rounded-full border border-white/85 bg-white/58 text-[13px] shadow-sm backdrop-blur-xl transition-transform group-hover:translate-x-0.5">
                      ↗
                    </span>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span key={tag} className="rounded-full border border-white/80 bg-white/48 px-2.5 py-1 text-[8px] font-medium text-black/42">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="mt-4 text-2xl font-semibold tracking-[-.05em]">{item.title}</h3>
                    <p className="mt-3 max-w-sm text-[12px] leading-6 text-black/45">{item.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-5 rounded-[28px] border border-black/5 bg-[#f5f8fc] p-5 md:p-6">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="text-[9px] font-semibold uppercase tracking-[.2em] text-black/30">And it keeps going</div>
                <div className="mt-2 text-lg font-semibold tracking-[-.035em]">Innovation · Mentorship · Challenges · Events · Skills · Community</div>
              </div>
              <Link href="/dashboard" className="rounded-[15px] bg-black px-5 py-3 text-[10px] font-semibold text-white hover:-translate-y-0.5">
                Enter the dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="experience" className="border-t border-black/5 bg-[#f4f7fb] px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-[1240px]">
          <div className="max-w-3xl">
            <div className="text-[9px] font-semibold uppercase tracking-[.24em] text-black/34">The experience</div>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-.065em] md:text-6xl">
              Designed around the way school actually moves.
            </h2>
            <p className="mt-5 max-w-2xl text-[13px] leading-7 text-black/45">
              The system is built around moments: what you need to see, what you need to do, who you need to work with and what should happen next.
            </p>
          </div>

          <div className="mt-12 grid gap-3 lg:grid-cols-3">
            {workflow.map((item) => (
              <div key={item.number} className="rounded-[26px] border border-white/90 bg-white/68 p-6 shadow-sm backdrop-blur-2xl">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold tracking-[.18em] text-blue-500">{item.number}</span>
                  <span className="text-[16px] text-black/18">✦</span>
                </div>
                <h3 className="mt-12 text-2xl font-semibold tracking-[-.05em]">{item.title}</h3>
                <p className="mt-3 text-[12px] leading-6 text-black/45">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[.82fr_1.18fr]">
            <div className="rounded-[27px] border border-black/5 bg-black p-7 text-white">
              <div className="text-[9px] font-semibold uppercase tracking-[.22em] text-white/35">A calmer system</div>
              <h3 className="mt-4 max-w-md text-3xl font-semibold tracking-[-.055em]">
                Less hunting through pages. More focus on what happens next.
              </h3>
              <p className="mt-5 max-w-md text-[12px] leading-6 text-white/45">
                Role-aware navigation keeps the right tools close and keeps irrelevant controls out of the way.
              </p>
            </div>

            <div className="rounded-[27px] border border-white/90 bg-white/68 p-6 shadow-sm backdrop-blur-2xl">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Adaptive UI", "Responsive layouts for phone, tablet and desktop."],
                  ["Permission aware", "Controls appear when your role allows them."],
                  ["Bilingual ready", "Arabic and English with RTL/LTR support."],
                  ["Liquid glass", "A calm visual system with lightweight motion."],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-[20px] border border-black/5 bg-[#f7f9fc] p-4">
                    <div className="text-[12px] font-semibold tracking-[-.02em]">{title}</div>
                    <p className="mt-2 text-[11px] leading-5 text-black/42">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="journey" className="border-t border-black/5 bg-white/74 px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="text-[9px] font-semibold uppercase tracking-[.24em] text-blue-500">Your journey</div>
              <h2 className="mt-3 text-4xl font-semibold tracking-[-.065em] md:text-6xl">
                School is more than one timetable.
              </h2>
            </div>
            <p className="max-w-md text-[13px] leading-6 text-black/43">
              Move between the academic, creative and social sides of school while your progress stays connected.
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {journeys.map(([title, text, href], index) => (
              <Link
                key={title}
                href={href}
                className="group rounded-[23px] border border-black/5 bg-[#f6f8fb] p-5 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_50px_rgba(30,45,70,.08)]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-semibold uppercase tracking-[.18em] text-black/25">0{index + 1}</span>
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-white bg-white text-[12px] transition-transform group-hover:translate-x-0.5">↗</span>
                </div>
                <h3 className="mt-10 text-xl font-semibold tracking-[-.04em]">{title}</h3>
                <p className="mt-2 text-[11px] leading-5 text-black/42">{text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <HomeMembers />

      <section className="px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-[1240px] overflow-hidden rounded-[34px] border border-white/90 bg-black text-white shadow-[0_35px_110px_rgba(20,30,50,.2)]">
          <div className="relative p-7 md:p-12">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-400/18 blur-[80px]" />
            <div className="pointer-events-none absolute -left-24 bottom-[-110px] h-64 w-64 rounded-full bg-cyan-300/12 blur-[80px]" />

            <div className="relative grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
              <div>
                <div id="vision" className="text-[9px] font-semibold uppercase tracking-[.24em] text-white/34">The vision</div>
                <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-.065em] md:text-6xl">
                  A school system that grows with its students.
                </h2>
                <p className="mt-5 max-w-2xl text-[13px] leading-7 text-white/46">
                  From the first class to the first competition, from a small idea to a real project — the goal is a connected digital layer for the whole journey.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {["Academics", "Innovation", "Community", "Leadership", "Skills", "Projects"].map((item) => (
                  <div key={item} className="rounded-[16px] border border-white/10 bg-white/[.055] px-3 py-3 text-[10px] font-medium text-white/62">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mt-10 flex flex-wrap gap-3">
              <Link href="/register" className="rounded-[16px] bg-white px-5 py-3 text-[10px] font-semibold text-black hover:-translate-y-0.5">
                Start your journey
              </Link>
              <Link href="/dashboard" className="rounded-[16px] border border-white/12 bg-white/[.06] px-5 py-3 text-[10px] font-semibold text-white/76 hover:bg-white/[.1]">
                Explore the OS
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-black/5 bg-[#eef3f8] px-5 py-10 md:px-8">
        <div className="mx-auto grid max-w-[1240px] gap-8 md:grid-cols-[1.2fr_.8fr_.8fr]">
          <div>
            <Link href="/" className="text-[17px] font-bold tracking-[-.045em]">ATTL</Link>
            <p className="mt-2 max-w-sm text-[11px] leading-5 text-black/38">
              Al Thagr Technical Lab · A School OS for academics, projects, innovation, learning and student life.
            </p>
          </div>

          <div>
            <div className="text-[9px] font-semibold uppercase tracking-[.2em] text-black/30">Explore</div>
            <div className="mt-3 grid gap-2 text-[10px] font-medium text-black/52">
              <a href="#platform" className="hover:text-black">Platform</a>
              <a href="#experience" className="hover:text-black">Experience</a>
              <a href="#journey" className="hover:text-black">Journey</a>
              <a href="#members" className="hover:text-black">Members</a>
              <a href="#vision" className="hover:text-black">Vision</a>
            </div>
          </div>

          <div>
            <div className="text-[9px] font-semibold uppercase tracking-[.2em] text-black/30">Account</div>
            <div className="mt-3 grid gap-2 text-[10px] font-medium text-black/52">
              <Link href="/login" className="hover:text-black">Sign in</Link>
              <Link href="/register" className="hover:text-black">Get started</Link>
              <Link href="/dashboard" className="hover:text-black">Dashboard</Link>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-9 flex max-w-[1240px] flex-col gap-2 border-t border-black/5 pt-5 text-[8px] text-black/28 md:flex-row md:items-center md:justify-between">
          <span>ATTL — Al Thagr Technical Lab</span>
          <span>School OS · Academics · Projects · Learning · Innovation · Community</span>
        </div>
      </footer>
    </main>
  );
}
