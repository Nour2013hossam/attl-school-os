"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Achievement = {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  xpReward: number;
  unlocked: boolean;
  awardedAt: string | null;
};

export default function StudentAchievementsPage() {
  const [items, setItems] = useState<Achievement[]>([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/achievements", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { achievements: [] }))
      .then((d) => setItems(d.achievements ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (filter === "Unlocked") return items.filter((item) => item.unlocked);
    if (filter === "Locked") return items.filter((item) => !item.unlocked);
    return items;
  }, [filter, items]);

  const unlocked = items.filter((item) => item.unlocked);
  const xp = unlocked.reduce((sum, item) => sum + item.xpReward, 0);
  const progress = items.length ? Math.round((unlocked.length / items.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[32px] bg-black p-7 text-white md:p-9">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/25 blur-[90px]" />
        <div className="relative flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-[.22em] text-blue-300">Achievement System</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-.06em] md:text-5xl">Earn your story.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">Live achievements calculated from your School OS account.</p>
          </div>
          <Link href="/dashboard/student/xp" className="rounded-[15px] border border-white/10 bg-white/[.06] px-4 py-3 text-[9px] font-semibold text-white/75">View XP →</Link>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ["Unlocked", unlocked.length],
          ["Total", items.length],
          ["Achievement XP", xp],
          ["Progress", progress + "%"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-[24px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl">
            <p className="text-[8px] uppercase tracking-[.16em] text-black/30">{label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-[-.05em]">{loading ? "—" : value}</p>
          </div>
        ))}
      </section>

      <section className="overflow-x-auto rounded-[24px] border border-white/80 bg-white/60 p-2 backdrop-blur-2xl">
        <div className="flex min-w-max gap-1">
          {["All", "Unlocked", "Locked"].map((item) => (
            <button key={item} type="button" onClick={() => setFilter(item)} className={filter === item ? "rounded-[16px] bg-black px-4 py-2.5 text-[9px] font-semibold text-white" : "rounded-[16px] px-4 py-2.5 text-[9px] text-black/35 hover:bg-black/[.04]"}>{item}</button>
          ))}
        </div>
      </section>

      <section className="rounded-[30px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl md:p-8">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[9px] uppercase tracking-[.2em] text-black/25">Collection</p>
            <h2 className="mt-1 text-xl font-semibold">Achievements</h2>
          </div>
          <span className="text-[9px] text-black/30">{filtered.length} shown</span>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {filtered.map((item) => (
            <article key={item.id} className={item.unlocked ? "rounded-[24px] border border-black/10 bg-white p-5 shadow-sm" : "rounded-[24px] border border-black/[.04] bg-black/[.02] p-5"}>
              <div className="flex items-start gap-4">
                <div className={item.unlocked ? "flex h-12 w-12 items-center justify-center rounded-[15px] bg-black text-white" : "flex h-12 w-12 items-center justify-center rounded-[15px] bg-black/[.05] text-black/25"}>{item.icon ?? "✦"}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold">{item.title}</h3>
                    <span className={item.unlocked ? "rounded-full bg-blue-500/10 px-2.5 py-1 text-[8px] text-blue-600" : "rounded-full bg-black/[.04] px-2.5 py-1 text-[8px] text-black/30"}>{item.unlocked ? "Unlocked" : "Locked"}</span>
                  </div>
                  <p className="mt-2 text-[10px] leading-5 text-black/35">{item.description ?? "Achievement in the School OS."}</p>
                  <div className="mt-4 flex items-center justify-between text-[8px] text-black/30"><span>+{item.xpReward} XP</span><span>{item.awardedAt ? new Date(item.awardedAt).toLocaleDateString() : "Not earned yet"}</span></div>
                </div>
              </div>
            </article>
          ))}
          {!loading && filtered.length === 0 && <div className="rounded-[22px] border border-dashed border-black/10 p-8 text-center text-[10px] text-black/30 md:col-span-2">No achievements match this filter.</div>}
        </div>
      </section>
    </div>
  );
}
