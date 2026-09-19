import Link from "next/link";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { MobileDock } from "@/components/layout/mobile-dock";
import { CommandCenter } from "@/components/layout/command-center";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#eef2f7] text-[#08090b]">

      {/* Ambient Liquid Glass Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-[420px] w-[420px] rounded-full bg-blue-400/20 blur-[120px]" />
        <div className="absolute right-20 top-[35%] h-[380px] w-[380px] rounded-full bg-cyan-300/15 blur-[120px]" />
        <div className="absolute bottom-[-150px] left-[35%] h-[450px] w-[450px] rounded-full bg-blue-300/10 blur-[130px]" />
      </div>

      {/* Desktop Liquid Glass Sidebar */}
      <aside className="fixed bottom-4 right-4 top-4 z-50 hidden w-[250px] overflow-hidden rounded-[32px] border border-white/80 bg-white/55 p-3 shadow-[0_30px_80px_rgba(20,30,50,0.12),inset_0_1px_0_white] backdrop-blur-[35px] lg:flex lg:flex-col">

        <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-white" />

        {/* Brand */}
        <div className="relative flex items-center justify-between px-3 py-4">
          <div>
            <div className="text-lg font-bold tracking-[-0.04em]">
              ATTL
            </div>

            <div className="mt-0.5 text-[10px] text-black/40">
              School OS
            </div>
          </div>

          <Link
            href="/dashboard/student"
            className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-black text-sm font-semibold text-white shadow-lg transition duration-300 hover:scale-105"
          >
            A
          </Link>
        </div>

        <div className="my-3 h-px bg-black/[0.05]" />

        {/* Navigation */}
        <div className="relative flex-1">
          <DashboardNav />
        </div>

        {/* XP Card */}
        <div className="group relative overflow-hidden rounded-[23px] bg-black p-4 text-white shadow-[0_15px_35px_rgba(0,0,0,0.15)]">

          <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-blue-500/20 blur-[35px] transition duration-500 group-hover:bg-blue-400/30" />

          <div className="relative">
            <div className="text-[8px] uppercase tracking-[0.25em] text-white/35">
              ATTL SYSTEM
            </div>

            <div className="mt-2 text-sm font-semibold">
              Level 01
            </div>

            <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[4%] rounded-full bg-white transition-all duration-700" />
            </div>

            <div className="mt-2 text-[9px] text-white/30">
              0 / 100 XP
            </div>
          </div>
        </div>
      </aside>

      {/* Main Application */}
      <main className="relative lg:mr-[274px]">

        {/* Top Glass Header */}
        <header className="sticky top-0 z-40 px-3 pt-3 md:px-5 lg:px-8 lg:pt-4">

          <div className="relative mx-auto flex h-[68px] max-w-[1500px] items-center gap-3 overflow-hidden rounded-[25px] border border-white/80 bg-white/55 px-3 shadow-[0_20px_60px_rgba(20,30,50,0.08),inset_0_1px_0_white] backdrop-blur-[35px] md:px-4">

            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-white" />

            {/* Identity */}
            <div className="hidden items-center gap-2 rounded-[17px] bg-black/[0.035] p-1 md:flex">

              <Link
                href="/dashboard/student"
                className="flex h-9 w-9 items-center justify-center rounded-[13px] bg-black text-xs font-semibold text-white transition duration-300 hover:scale-105"
              >
                A
              </Link>

              <span className="px-2 text-[11px] font-medium">
                Student
              </span>
            </div>

            {/* Search */}
            <div className="flex h-11 flex-1 items-center justify-center">
              <div className="group flex h-10 w-full max-w-[450px] items-center gap-3 rounded-[15px] border border-black/[0.05] bg-black/[0.035] px-3.5 transition duration-300 focus-within:bg-white/70 focus-within:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">

                <span className="text-sm text-black/30">
                  âŒ•
                </span>

                <span className="flex-1 text-[11px] text-black/35">
                  Search anything...
                </span>

                <span className="rounded-lg bg-white/80 px-2 py-1 text-[9px] text-black/30 shadow-sm">
                  /
                </span>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">

              <button
                aria-label="Notifications"
                className="relative flex h-10 w-10 items-center justify-center rounded-[14px] bg-black/[0.035] text-sm transition duration-300 hover:bg-black hover:text-white"
              >
                â™§

                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,.7)]" />
              </button>

              <div className="hidden items-center gap-3 sm:flex">

                <div className="text-right">
                  <p className="text-[9px] text-black/35">
                    Welcome back
                  </p>

                  <p className="text-xs font-semibold">
                    Your School OS
                  </p>
                </div>

                <Link
                  href="/dashboard/student"
                  className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-black text-xs font-semibold text-white shadow-lg transition duration-300 hover:scale-105"
                >
                  A
                </Link>

              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="mx-auto max-w-[1500px] px-3 pb-32 pt-4 md:px-5 lg:px-8 lg:pb-12">
          {children}
        </div>
      </main>

      {/* Mobile Liquid Glass Dock */}
      <MobileDock />
      <CommandCenter />

    </div>
  );
}
