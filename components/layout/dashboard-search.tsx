"use client";

export function DashboardSearch() {
  const openCommandCenter = () => {
    window.dispatchEvent(new Event("open-command-center"));
  };

  return (
    <button
      type="button"
      onClick={openCommandCenter}
      className="group flex h-10 w-full max-w-[450px] items-center gap-3 rounded-[16px] border border-black/5 bg-black/[0.025] px-4 text-left transition-all duration-300 hover:bg-white/80 hover:shadow-[0_8px_25px_rgba(20,30,50,0.06)]"
    >
      <span className="text-sm text-black/30">⌕</span>

      <span className="flex-1 text-[11px] text-black/35">
        Search ATTL School OS...
      </span>

      <span className="rounded-lg bg-white/80 px-2 py-1 text-[9px] text-black/30 shadow-sm">
        /
      </span>
    </button>
  );
}
