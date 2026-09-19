import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#eef2f7] text-black">

      <div className="relative min-h-screen overflow-hidden">

        <div className="absolute -left-32 top-20 h-[500px] w-[500px] rounded-full bg-blue-400/20 blur-[130px]" />
        <div className="absolute right-[-100px] top-[30%] h-[500px] w-[500px] rounded-full bg-cyan-300/15 blur-[130px]" />

        <nav className="relative z-10 mx-auto flex max-w-[1400px] items-center justify-between px-6 py-6">

          <div>
            <div className="text-xl font-bold tracking-[-.05em]">
              ATTL
            </div>

            <div className="text-[9px] text-black/35">
              School OS
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-[15px] bg-white/70 px-5 py-3 text-[9px] font-semibold shadow-sm backdrop-blur-xl"
            >
              Sign in
            </Link>

            <Link
              href="/register"
              className="rounded-[15px] bg-black px-5 py-3 text-[9px] font-semibold text-white shadow-lg"
            >
              Get started
            </Link>
          </div>

        </nav>

        <section className="relative z-10 mx-auto flex min-h-[75vh] max-w-[1100px] flex-col items-center justify-center px-6 text-center">

          <div className="rounded-full border border-white/80 bg-white/60 px-4 py-2 text-[8px] uppercase tracking-[.25em] text-black/40 backdrop-blur-xl">
            Al Thagr Technical Lab
          </div>

          <h1 className="mt-8 max-w-5xl text-5xl font-semibold tracking-[-.08em] md:text-8xl">
            Your school.
            <br />
            <span className="text-black/30">
              Reimagined.
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-sm leading-7 text-black/40">
            ATTL School OS connects academics, projects, skills,
            competitions, innovation and student life in one intelligent
            school platform.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">

            <Link
              href="/dashboard"
              className="rounded-[18px] bg-black px-7 py-4 text-[10px] font-semibold text-white shadow-xl"
            >
              Explore School OS
            </Link>

            <Link
              href="/dashboard/projects/all"
              className="rounded-[18px] border border-white/80 bg-white/60 px-7 py-4 text-[10px] font-semibold backdrop-blur-xl"
            >
              Explore projects
            </Link>

          </div>

        </section>

      </div>
    </main>
  );
}
