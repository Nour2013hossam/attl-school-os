"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePreferences } from "@/components/providers/preferences-provider";

const interestGroups = [
  { title: "Technology", description: "Build, code and explore technology.", interests: ["Software Development", "AI", "Cybersecurity", "Web Development"] },
  { title: "Science", description: "Explore scientific thinking and discovery.", interests: ["Physics", "Chemistry", "Biology", "Research"] },
  { title: "Creative", description: "Create, design and communicate ideas.", interests: ["UI/UX", "Design", "Writing", "Photography"] },
  { title: "Leadership", description: "Develop teams, initiatives and communities.", interests: ["Leadership", "Public Speaking", "Teamwork", "Entrepreneurship"] },
];

export default function StudentInterestsPage() {
  const { can, permissionsReady } = usePreferences();
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/profile", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then((d) => {
      setSelected(d?.user?.studentProfile?.interests ?? []);
    });
  }, []);

  const toggle = (interest: string) => {
    setSelected((current) => current.includes(interest) ? current.filter((x) => x !== interest) : [...current, interest]);
  };

  async function save() {
    if (!can("profile.write")) return;
    setSaving(true);
    setMessage("");
    const r = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interests: selected }),
    });
    const d = await r.json();
    setMessage(r.ok ? "Interests saved." : (d.error ?? "Could not save interests."));
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[32px] bg-black p-7 text-white md:p-9">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/25 blur-[100px]" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-[.22em] text-blue-300">Interests</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-.06em] md:text-5xl">Follow what interests you.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">Saved interests can power recommendations across learning, projects and opportunities.</p>
          </div>
          <div className="rounded-[20px] border border-white/10 bg-white/[.06] px-5 py-4"><p className="text-[8px] uppercase tracking-[.16em] text-white/30">Selected</p><p className="mt-2 text-3xl font-semibold">{selected.length}</p></div>
        </div>
      </section>

      <section className="rounded-[30px] border border-white/80 bg-white/60 p-6 backdrop-blur-2xl md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="text-[9px] uppercase tracking-[.2em] text-black/25">Your profile</p><h2 className="mt-1 text-xl font-semibold">Selected interests</h2></div>
          {permissionsReady && can("profile.write") && <button onClick={save} disabled={saving} className="rounded-[14px] bg-black px-5 py-2.5 text-[9px] font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : "Save interests"}</button>}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {selected.map((item) => <button key={item} type="button" onClick={() => toggle(item)} className="rounded-full bg-black px-4 py-2.5 text-[9px] font-semibold text-white">{item} ×</button>)}
          {!selected.length && <span className="text-[10px] text-black/30">Nothing selected yet.</span>}
        </div>
        {message && <p className="mt-4 rounded-[14px] bg-blue-500/10 px-3 py-2.5 text-[9px] text-blue-700">{message}</p>}
      </section>

      <section className="space-y-3">
        {interestGroups.map((group) => (
          <div key={group.title} className="rounded-[28px] border border-white/80 bg-white/60 p-6 backdrop-blur-2xl md:p-7">
            <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between"><div><p className="text-[9px] uppercase tracking-[.18em] text-black/30">Interest group</p><h2 className="mt-1 text-lg font-semibold">{group.title}</h2></div><p className="text-[9px] text-black/30">{group.description}</p></div>
            <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {group.interests.map((interest) => {
                const active = selected.includes(interest);
                return <button key={interest} type="button" onClick={() => toggle(interest)} className={active ? "rounded-[19px] border border-black bg-black p-4 text-left text-white shadow-lg" : "rounded-[19px] border border-black/[.05] bg-black/[.025] p-4 text-left hover:bg-white"}>
                  <div className="flex items-center justify-between"><span className={active ? "flex h-8 w-8 items-center justify-center rounded-[11px] bg-white/10" : "flex h-8 w-8 items-center justify-center rounded-[11px] bg-white shadow-sm"}>{active ? "✓" : "+"}</span>{active && <span className="text-[7px] uppercase tracking-[.15em] text-white/30">Selected</span>}</div>
                  <p className="mt-4 text-[10px] font-semibold">{interest}</p>
                  <p className={active ? "mt-1 text-[8px] text-white/35" : "mt-1 text-[8px] text-black/30"}>Personal interest</p>
                </button>;
              })}
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <Link href="/dashboard/learning/explore" className="rounded-[24px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl"><h3 className="text-sm font-semibold">Learning paths</h3><p className="mt-2 text-[9px] text-black/35">Explore content that matches your interests.</p></Link>
        <Link href="/dashboard/projects/discover" className="rounded-[24px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl"><h3 className="text-sm font-semibold">Projects</h3><p className="mt-2 text-[9px] text-black/35">Find projects that match what you want to build.</p></Link>
        <Link href="/dashboard/skills/skill-map" className="rounded-[24px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl"><h3 className="text-sm font-semibold">Skill map</h3><p className="mt-2 text-[9px] text-black/35">Turn interests into skills.</p></Link>
      </section>
    </div>
  );
}
