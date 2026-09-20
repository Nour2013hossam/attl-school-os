import Link from "next/link";
import { auth } from "@/auth";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { MobileDock } from "@/components/layout/mobile-dock";
import { CommandCenter } from "@/components/layout/command-center";
import { DashboardSearch } from "@/components/layout/dashboard-search";
import { SignOutButton } from "@/components/auth/signout-button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const displayName = session?.user?.name ?? "ATTL Student";
  const initial = displayName.trim().charAt(0).toUpperCase() || "A";
  const avatarUrl = session?.user?.image ?? null;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#eef2f7] text-[#08090b]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-[420px] w-[420px] rounded-full bg-blue-400/20 blur-[120px]" />
        <div className="absolute right-20 top-[35%] h-[380px] w-[380px] rounded-full bg-cyan-300/15 blur-[120px]" />
        <div className="absolute bottom-[-150px] left-[35%] h-[450px] w-[450px] rounded-full bg-blue-300/10 blur-[130px]" />
      </div>

      <aside className="fixed bottom-4 right-4 top-4 z-50 hidden w-[250px] min-h-0 flex-col overflow-hidden rounded-[30px] border border-white/80 bg-white/60 p-3 shadow-[0_25px_80px_rgba(20,30,50,0.10)] backdrop-blur-2xl lg:flex">
        <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-white" />

        <div className="relative shrink-0 flex items-center justify-between px-3 py-3">
          <div>
            <div className="text-lg font-bold tracking-[-0.04em]">ATTL</div>
            <div className="mt-0.5 text-[10px] text-black/40">School OS</div>
          </div>

          <Link
            href="/dashboard/student/profile"
            className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-[15px] bg-black text-sm font-semibold text-white shadow-lg transition-transform duration-300 hover:scale-105"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              initial
            )}
          </Link>
        </div>

        <div className="my-3 h-px shrink-0 bg-black/[0.05]" />

        <div className="relative min-h-0 flex-1 overflow-hidden">
          <DashboardNav role={session?.user?.role ?? "STUDENT"} />
        </div>

        <div className="group relative mt-3 shrink-0 overflow-hidden rounded-[23px] bg-black p-4 text-white shadow-xl">
          <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-blue-500/30 blur-2xl transition-transform duration-500 group-hover:scale-150" />

          <div className="relative">
            <div className="text-[8px] uppercase tracking-[0.25em] text-white/30">
              {session?.user?.role ?? "STUDENT"}
            </div>

            <div className="mt-2 text-sm font-semibold">{displayName}</div>

            <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[4%] rounded-full bg-white transition-all duration-700" />
            </div>

            <div className="mt-2 text-[9px] text-white/30">0 / 100 XP</div>

            <SignOutButton />
          </div>
        </div>
      </aside>

      <main className="relative lg:mr-[274px]">
        <header className="sticky top-0 z-40 px-3 pt-3 md:px-5 lg:px-8 lg:pt-4">
          <div className="relative mx-auto flex h-[68px] max-w-[1500px] items-center rounded-[24px] border border-white/80 bg-white/60 px-3 shadow-[0_12px_40px_rgba(20,30,50,0.06)] backdrop-blur-2xl md:px-4">
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-white" />

            <div className="hidden items-center gap-2 rounded-[17px] bg-black/[0.025] px-2 py-1.5 sm:flex">
              <Link
                href="/dashboard/student/profile"
                className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-black text-xs font-semibold text-white transition-transform duration-300 hover:scale-105"
              >
                {initial}
              </Link>
              <span className="max-w-[160px] truncate px-2 text-[11px] font-medium">
                {displayName}
              </span>
            </div>

            <div className="flex h-11 flex-1 items-center justify-center px-2">
              <DashboardSearch />
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/dashboard/notifications"
                aria-label="Notifications"
                className="relative flex h-10 w-10 items-center justify-center rounded-[14px] bg-black/[0.025] text-sm text-black/40 transition-all duration-300 hover:bg-white hover:text-black hover:shadow-md"
              >
                ●
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,.7)]" />
              </Link>

              <div className="hidden items-center gap-3 sm:flex">
                <div className="text-right">
                  <p className="text-[9px] text-black/35">Welcome back</p>
                  <p className="max-w-[180px] truncate text-xs font-semibold">
                    {displayName}
                  </p>
                </div>

                <Link
                  href="/dashboard/student/profile"
                  className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-[14px] bg-black text-xs font-semibold text-white shadow-lg transition-transform duration-300 hover:scale-105"
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    initial
                  )}
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] px-3 pb-32 pt-4 md:px-5 lg:px-8 lg:pb-12">
          {children}
        </div>
      </main>

      <MobileDock />
      <CommandCenter />
    </div>
  );
}
