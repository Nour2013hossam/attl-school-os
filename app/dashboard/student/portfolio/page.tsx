"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePreferences } from "@/components/providers/preferences-provider";

type Project = { id: string; title: string; description: string | null; status: string; progress: number; owner: { name: string }; _count: { members: number; tasks: number } };
type SkillRow = { id: string; level: number | null; progress: number | null; skill: { name: string; category: string } };
type Achievement = { id: string; awardedAt: string; achievement: { title: string; description: string; xpReward: number; icon: string | null } };

export default function StudentPortfolioPage() {
  const { can, permissionsReady } = usePreferences();
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<SkillRow[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [tab, setTab] = useState("Overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/projects", { cache: "no-store" }).then((r) => r.ok ? r.json() : { projects: [] }),
      fetch("/api/skills", { cache: "no-store" }).then((r) => r.ok ? r.json() : { skills: [] }),
      fetch("/api/achievements", { cache: "no-store" }).then((r) => r.ok ? r.json() : { achievements: [] }),
    ]).then(([p, s, a]) => {
      setProjects(p.projects ?? []);
      setSkills(s.skills ?? []);
      setAchievements(a.achievements ?? []);
    }).finally(() => setLoading(false));
  }, []);

  const myProjects = useMemo(() => projects, [projects]);
  const strength = Math.min(100, myProjects.length * 18 + skills.length * 12 + achievements.length * 12);

  const tabs = ["Overview", "Projects", "Achievements", "Skills"];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[32px] bg-black p-6 text-white shadow-[0_25px_80px_rgba(0,0,0,.12)] md:p-8">
        <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-blue-500/25 blur-[100px]" />
        <div className="relative flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[9px] uppercase tracking-[.2em] text-white/45">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" /> Student Portfolio
            </div>
            <h1 className="mt-5 text-3xl font-semibold tracking-[-.06em] md:text-5xl">Your work. Your journey.</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">A live portfolio assembled from your connected projects, skills and achievements.</p>
          </div>
          {permissionsReady && can("projects.create") && (
            <Link href="/dashboard/projects/create" className="rounded-[16px] bg-white px-5 py-3 text-center text-[9px] font-semibold text-black">+ Add project</Link>
          )}
        </div>
      </section>

      <section className="grid gap-3 lg:grid-cols-[1.3fr_.7fr]">
        <div className="rounded-[28px] border border-white/80 bg-white/60 p-6 backdrop-blur-2xl">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-black text-lg font-semibold text-white shadow-lg">OS</div>
            <div>
              <p className="text-[8px] uppercase tracking-[.18em] text-black/30">Student</p>
              <h2 className="mt-1 text-xl font-semibold tracking-[-.04em]">Connected portfolio</h2>
              <p className="mt-1 text-[9px] text-black/30">{myProjects.length} projects · {skills.length} skills · {achievements.length} achievements</p>
            </div>
          </div>
        </div>
        <div className="rounded-[28px] bg-black p-6 text-white">
          <p className="text-[8px] uppercase tracking-[.18em] text-white/30">Portfolio strength</p>
          <p className="mt-4 text-5xl font-semibold tracking-[-.08em]">{loading ? "—" : strength + "%"}</p>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-white" style={{ width: strength + "%" }} /></div>
          <p className="mt-3 text-[9px] leading-5 text-white/30">Based on connected work, skills and recognition.</p>
        </div>
      </section>

      <section className="overflow-x-auto rounded-[24px] border border-white/80 bg-white/60 p-2 backdrop-blur-2xl">
        <div className="flex min-w-max gap-1">
          {tabs.map((item) => <button key={item} type="button" onClick={() => setTab(item)} className={tab === item ? "rounded-[16px] bg-black px-5 py-2.5 text-[9px] font-semibold text-white" : "rounded-[16px] px-5 py-2.5 text-[9px] text-black/35 hover:bg-black/[.04]"}>{item}</button>)}
        </div>
      </section>

      {tab === "Overview" && (
        <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
          <section className="rounded-[30px] border border-white/80 bg-white/60 p-6 backdrop-blur-2xl">
            <div className="flex items-end justify-between"><div><p className="text-[9px] uppercase tracking-[.2em] text-black/30">Featured work</p><h2 className="mt-1 text-xl font-semibold">Projects</h2></div><Link href="/dashboard/projects/all" className="text-[9px] text-black/40">View all →</Link></div>
            <div className="mt-6 space-y-3">
              {myProjects.slice(0, 6).map((project) => (
                <Link key={project.id} href={"/dashboard/projects/" + project.id} className="block rounded-[23px] bg-black/[.025] p-5 transition hover:bg-white">
                  <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold">{project.title}</p><p className="mt-1 text-[9px] text-black/30">{project.owner.name} · {project._count.members} members · {project._count.tasks} tasks</p></div><span className="rounded-full bg-black/[.04] px-2.5 py-1 text-[7px] text-black/35">{project.status}</span></div>
                  <p className="mt-2 text-[9px] leading-5 text-black/30">{project.description || "School project."}</p>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-black/[.06]"><div className="h-full rounded-full bg-black" style={{ width: project.progress + "%" }} /></div>
                </Link>
              ))}
              {!loading && myProjects.length === 0 && <div className="rounded-[22px] bg-black/[.025] p-7 text-center text-[10px] text-black/35">No connected projects yet.</div>}
            </div>
          </section>
          <div className="space-y-6">
            <section className="rounded-[30px] border border-white/80 bg-white/60 p-6 backdrop-blur-2xl"><p className="text-[9px] uppercase tracking-[.2em] text-black/30">Recognition</p><h2 className="mt-1 text-xl font-semibold">Achievements</h2><div className="mt-5 space-y-2">{achievements.slice(0,5).map((a)=><div key={a.id} className="flex items-center gap-3 rounded-[18px] bg-black/[.025] p-3.5"><div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-black text-white">{a.achievement.icon || "✦"}</div><div className="flex-1"><p className="text-[10px] font-semibold">{a.achievement.title}</p><p className="mt-1 text-[8px] text-black/30">+{a.achievement.xpReward} XP</p></div></div>)}</div></section>
            <section className="rounded-[30px] border border-white/80 bg-white/60 p-6 backdrop-blur-2xl"><p className="text-[9px] uppercase tracking-[.2em] text-black/30">Development</p><h2 className="mt-1 text-xl font-semibold">Skills</h2><div className="mt-5 space-y-4">{skills.slice(0,5).map((s)=><div key={s.id}><div className="flex items-center justify-between"><p className="text-[10px] font-semibold">{s.skill.name}</p><span className="text-[8px]">{s.progress ?? s.level ?? 0}%</span></div><div className="mt-2 h-1.5 rounded-full bg-black/[.06]"><div className="h-full rounded-full bg-black" style={{ width: Math.min(100, s.progress ?? s.level ?? 0) + "%" }} /></div></div>)}</div></section>
          </div>
        </div>
      )}

      {tab === "Projects" && <section className="rounded-[30px] border border-white/80 bg-white/60 p-6 backdrop-blur-2xl"><h2 className="text-xl font-semibold">Projects</h2><div className="mt-5 grid gap-3 md:grid-cols-2">{myProjects.map((p)=><Link key={p.id} href={"/dashboard/projects/" + p.id} className="rounded-[22px] bg-black/[.025] p-5 hover:bg-white"><h3 className="text-sm font-semibold">{p.title}</h3><p className="mt-2 text-[9px] text-black/35">{p.status} · {p.progress}%</p></Link>)}</div></section>}
      {tab === "Achievements" && <section className="rounded-[30px] border border-white/80 bg-white/60 p-6 backdrop-blur-2xl"><h2 className="text-xl font-semibold">Achievements</h2><div className="mt-5 grid gap-3 md:grid-cols-2">{achievements.map((a)=><div key={a.id} className="rounded-[22px] bg-black/[.025] p-5"><div className="flex h-12 w-12 items-center justify-center rounded-[15px] bg-black text-white">{a.achievement.icon || "✦"}</div><h3 className="mt-4 text-sm font-semibold">{a.achievement.title}</h3><p className="mt-2 text-[9px] text-black/35">{a.achievement.description}</p></div>)}</div></section>}
      {tab === "Skills" && <section className="rounded-[30px] border border-white/80 bg-white/60 p-6 backdrop-blur-2xl"><h2 className="text-xl font-semibold">Skills</h2><div className="mt-5 space-y-4">{skills.map((s)=><div key={s.id} className="rounded-[22px] bg-black/[.025] p-5"><div className="flex items-center justify-between"><div><p className="text-[10px] font-semibold">{s.skill.name}</p><p className="mt-1 text-[8px] text-black/25">{s.skill.category}</p></div><span className="text-[9px] font-semibold">{s.progress ?? s.level ?? 0}%</span></div><div className="mt-4 h-2 rounded-full bg-black/[.06]"><div className="h-full rounded-full bg-black" style={{ width: Math.min(100, s.progress ?? s.level ?? 0) + "%" }} /></div></div>)}</div></section>}
    </div>
  );
}
