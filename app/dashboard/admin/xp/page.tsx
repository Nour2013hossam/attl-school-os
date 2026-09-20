"use client";

import { useEffect, useMemo, useState } from "react";
import { usePreferences } from "@/components/providers/preferences-provider";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  xp: number;
  level: number;
  isActive: boolean;
};

export default function XPControlPage() {
  const { can, permissionsReady } = usePreferences();
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    const response = await fetch("/api/admin/users", { cache: "no-store" });
    const data = await response.json();
    if (response.ok) setUsers(data.users ?? []);
    else setMessage(data.error ?? "Unable to load users.");
  }

  useEffect(() => {
    if (permissionsReady && can("xp.manage")) load();
  }, [permissionsReady, can]);

  const filtered = useMemo(
    () =>
      users.filter((user) =>
        [user.name, user.email, user.role].join(" ").toLowerCase().includes(query.toLowerCase())
      ),
    [users, query]
  );

  async function save(user: User) {
    const xp = Number(drafts[user.id] ?? user.xp);
    if (!Number.isInteger(xp) || xp < 0) return;

    setSaving(user.id);
    setMessage("");
    const response = await fetch("/api/admin/users/xp", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, xp }),
    });
    const data = await response.json();
    setMessage(response.ok ? `${user.name}'s XP was updated.` : (data.error ?? "Could not update XP."));
    if (response.ok) {
      setDrafts((current) => ({ ...current, [user.id]: String(data.user.xp) }));
      await load();
    }
    setSaving("");
  }

  if (!permissionsReady) return <div className="rounded-[28px] bg-black p-8 text-[10px] text-white/40">Loading XP control…</div>;
  if (!can("xp.manage")) return <div className="rounded-[28px] border border-dashed border-black/10 p-10 text-center text-[10px] text-black/35">XP control is not available for this account.</div>;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[34px] bg-black p-7 text-white shadow-[0_35px_100px_rgba(0,0,0,.2)] md:p-9">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/25 blur-[110px]" />
        <div className="relative">
          <p className="text-[9px] uppercase tracking-[.22em] text-blue-300">Administration · Gamification</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-.06em] md:text-5xl">XP Control.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">Adjust a user’s XP; level is recalculated from the stored XP value.</p>
        </div>
      </section>

      {message && <div className="rounded-[16px] bg-blue-500/10 px-4 py-3 text-[10px] text-blue-700">{message}</div>}

      <section className="rounded-[28px] border border-white/80 bg-white/60 p-5 backdrop-blur-xl">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email or role..." className="h-11 w-full rounded-[14px] border border-black/5 bg-white/80 px-4 text-[10px] outline-none" />
      </section>

      <section className="space-y-2">
        {filtered.map((user) => {
          const draft = drafts[user.id] ?? String(user.xp);
          return (
            <article key={user.id} className="rounded-[24px] border border-white/80 bg-white/60 p-4 backdrop-blur-xl">
              <div className="grid gap-4 md:grid-cols-[1fr_auto_auto] md:items-center">
                <div>
                  <p className="text-xs font-semibold">{user.name}</p>
                  <p className="mt-1 text-[9px] text-black/30">{user.email} · {user.role} · Level {user.level}</p>
                </div>
                <div className="flex items-center gap-2">
                  <input type="number" min="0" max="1000000000" value={draft} onChange={(event) => setDrafts((current) => ({ ...current, [user.id]: event.target.value }))} className="h-10 w-32 rounded-[13px] border border-black/5 bg-white px-3 text-[9px] outline-none" />
                  <span className="text-[9px] text-black/30">XP</span>
                </div>
                <button type="button" disabled={saving === user.id} onClick={() => save(user)} className="rounded-[13px] bg-black px-4 py-2.5 text-[9px] font-semibold text-white disabled:opacity-40">
                  {saving === user.id ? "Saving..." : "Save"}
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
