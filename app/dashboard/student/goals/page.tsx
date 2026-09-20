"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { usePreferences } from "@/components/providers/preferences-provider";

type Goal = {
  id: string;
  title: string;
  description: string | null;
  targetDate: string | null;
  progress: number;
  completedAt: string | null;
  createdAt: string;
};

const filters = ["All", "Active", "Completed"];

export default function StudentGoalsPage() {
  const { can, permissionsReady } = usePreferences();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [filter, setFilter] = useState("All");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);

  async function loadGoals() {
    const response = await fetch("/api/goals", { cache: "no-store" });
    if (!response.ok) return;
    const payload = await response.json();
    setGoals(payload.goals ?? []);
  }

  useEffect(() => {
    loadGoals();
  }, []);

  const filteredGoals = useMemo(() => {
    if (filter === "All") return goals;
    if (filter === "Completed") return goals.filter((goal) => goal.completedAt);
    return goals.filter((goal) => !goal.completedAt);
  }, [goals, filter]);

  const completed = goals.filter((goal) => goal.completedAt).length;
  const active = goals.length - completed;
  const overall = goals.length
    ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length)
    : 0;

  async function updateGoal(id: string, progress: number) {
    const response = await fetch("/api/goals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, progress }),
    });
    if (response.ok) await loadGoals();
  }

  async function deleteGoal(id: string) {
    const response = await fetch("/api/goals", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (response.ok) await loadGoals();
  }

  async function createGoal(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    const response = await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        targetDate: targetDate ? new Date(targetDate).toISOString() : undefined,
      }),
    });

    if (response.ok) {
      setTitle("");
      setDescription("");
      setTargetDate("");
      setShowCreate(false);
      await loadGoals();
    }
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[32px] bg-black p-6 text-white shadow-[0_25px_80px_rgba(0,0,0,.12)] md:p-8">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/25 blur-[110px]" />
        <div className="absolute bottom-[-130px] left-[30%] h-72 w-72 rounded-full bg-cyan-400/10 blur-[110px]" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[8px] uppercase tracking-[.2em] text-white/45">
              Personal Goals
            </span>
            <h1 className="mt-5 text-3xl font-semibold tracking-[-.06em] md:text-5xl">
              Build toward something.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
              Goals are saved to your School OS account and can later connect
              to projects, XP and achievement rules.
            </p>
          </div>

          {permissionsReady && can("goals.manage") && <button
            type="button"
            onClick={() => setShowCreate((value) => !value)}
            className="rounded-[16px] bg-white px-5 py-3 text-[9px] font-semibold text-black"
          >
            {showCreate ? "Close" : "+ Create goal"}
          </button>}
        </div>
      </section>

      {showCreate && permissionsReady && can("goals.manage") && (
        <section className="rounded-[30px] border border-white/80 bg-white/60 p-6 backdrop-blur-2xl">
          <form onSubmit={createGoal} className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-[9px] uppercase tracking-[.16em] text-black/30">Goal title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={140} placeholder="What do you want to achieve?" className="h-12 w-full rounded-[16px] border border-black/5 bg-white/80 px-4 text-xs outline-none focus:border-blue-400/50" />
            </div>
            <div>
              <label className="mb-2 block text-[9px] uppercase tracking-[.16em] text-black/30">Target date</label>
              <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="h-12 w-full rounded-[16px] border border-black/5 bg-white/80 px-4 text-xs outline-none focus:border-blue-400/50" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-[9px] uppercase tracking-[.16em] text-black/30">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={2000} rows={4} placeholder="Add a little context..." className="w-full rounded-[16px] border border-black/5 bg-white/80 px-4 py-3 text-xs outline-none focus:border-blue-400/50" />
            </div>
            <div className="md:col-span-2">
              <button disabled={saving} className="rounded-[15px] bg-black px-5 py-3 text-[9px] font-semibold text-white disabled:opacity-50">
                {saving ? "Saving..." : "Save goal"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ["Overall", `${overall}%`],
          ["Active", String(active)],
          ["Completed", String(completed)],
          ["Total", String(goals.length)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-[23px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl">
            <p className="text-[8px] uppercase tracking-[.18em] text-black/30">{label}</p>
            <p className="mt-3 text-2xl font-semibold tracking-[-.05em]">{value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-[24px] border border-white/80 bg-white/60 p-2 backdrop-blur-xl">
        <div className="flex gap-1">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={filter === item ? "rounded-[14px] bg-black px-4 py-2.5 text-[9px] font-semibold text-white" : "rounded-[14px] px-4 py-2.5 text-[9px] text-black/35 hover:bg-black/[.04]"}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        {filteredGoals.map((goal) => (
          <article key={goal.id} className="rounded-[25px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[8px] uppercase tracking-[.16em] text-black/25">
                  {goal.completedAt ? "Completed" : "Active"}
                </p>
                <h2 className="mt-1 text-sm font-semibold">{goal.title}</h2>
              </div>
              <span className="rounded-full bg-black/[.04] px-3 py-1.5 text-[8px] text-black/35">
                {goal.progress}%
              </span>
            </div>

            {goal.description && (
              <p className="mt-3 text-[10px] leading-5 text-black/35">{goal.description}</p>
            )}

            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-black/[.06]">
              <div className="h-full rounded-full bg-black" style={{ width: `${goal.progress}%` }} />
            </div>

            <div className="mt-4 flex items-center justify-between text-[8px] text-black/30">
              <span>{goal.targetDate ? `Target ${new Date(goal.targetDate).toLocaleDateString()}` : "No target date"}</span>
              <span>{goal.completedAt ? "Done" : "In progress"}</span>
            </div>
            {permissionsReady && can("goals.manage") && (
              <div className="mt-4 flex gap-2">
                <button type="button" onClick={() => updateGoal(goal.id, Math.min(100, goal.progress + 25))} className="rounded-[12px] bg-black px-3 py-2 text-[8px] text-white">+25%</button>
                <button type="button" onClick={() => deleteGoal(goal.id)} className="rounded-[12px] bg-red-500/10 px-3 py-2 text-[8px] font-semibold text-red-600">Delete</button>
              </div>
            )}
          </article>
        ))}

        {filteredGoals.length === 0 && (
          <div className="rounded-[25px] border border-dashed border-black/10 bg-black/[.02] p-10 text-center md:col-span-2">
            <p className="text-sm font-semibold">No goals yet</p>
            <p className="mt-2 text-[10px] text-black/30">Create your first goal and start tracking it.</p>
          </div>
        )}
      </section>

      <section className="rounded-[30px] bg-black p-6 text-white">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[8px] uppercase tracking-[.2em] text-white/30">Next step</p>
            <h2 className="mt-2 text-xl font-semibold">Connect goals to real work.</h2>
            <p className="mt-2 max-w-xl text-[10px] leading-5 text-white/35">
              Projects, challenges and achievements can consume these goals
              as the School OS grows.
            </p>
          </div>
          <Link href="/dashboard/projects/create" className="rounded-[16px] bg-white px-5 py-3 text-center text-[9px] font-semibold text-black">
            Create project →
          </Link>
        </div>
      </section>
    </div>
  );
}
