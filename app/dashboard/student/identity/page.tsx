"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type User = {
  name: string;
  email: string;
  role: string;
  schoolId: string | null;
  gradeLevel: string | null;
  className: string | null;
  avatarUrl: string | null;
  bio: string | null;
  xp: number;
  level: number;
  studentProfile: { interests: string[]; portfolioUrl: string | null } | null;
};

export default function StudentIdentityPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/me", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then((d) => setUser(d?.user ?? null));
  }, []);

  const name = user?.name ?? "Student";
  const initial = name.trim().charAt(0).toUpperCase() || "S";

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[32px] bg-black p-6 text-white shadow-[0_25px_80px_rgba(0,0,0,.12)] md:p-8">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/25 blur-[90px]" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[9px] uppercase tracking-[.2em] text-white/45">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" /> Student Identity
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-[-.05em] md:text-4xl">Your identity.</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">The live identity attached to your School OS account.</p>
        </div>
      </section>

      <section className="rounded-[30px] border border-white/80 bg-white/65 p-6 shadow-sm backdrop-blur-2xl md:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[28px] bg-black text-2xl font-semibold text-white shadow-xl">
            {user?.avatarUrl ? <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" /> : initial}
          </div>
          <div className="flex-1">
            <p className="text-[9px] uppercase tracking-[.2em] text-black/30">School identity</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-.05em]">{name}</h2>
            <p className="mt-1 text-xs text-black/35">{user?.role ?? "STUDENT"} · ATTL School OS</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-500/10 px-3 py-1.5 text-[9px] text-blue-600">Level {user?.level ?? 1}</span>
              <span className="rounded-full bg-black/[.04] px-3 py-1.5 text-[9px] text-black/40">{user?.xp ?? 0} XP</span>
              <span className="rounded-full bg-black/[.04] px-3 py-1.5 text-[9px] text-black/40">Active account</span>
            </div>
          </div>
          <Link href="/dashboard/settings/account" className="rounded-[16px] bg-black px-5 py-3 text-center text-[10px] font-semibold text-white">Edit Identity</Link>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        {[
          ["Email", user?.email ?? "—", "The email used to sign in."],
          ["Student ID", user?.schoolId ?? "Not assigned", "Your school identifier."],
          ["Grade", user?.gradeLevel ?? "Not set", "Your current grade level."],
          ["Class", user?.className ?? "Not set", "Your current class."],
          ["ATTL status", ["ATTL_MEMBER", "TRACK_LEAD"].includes(user?.role ?? "") ? "ATTL team" : "Not an ATTL member", "Based on your live account role."],
          ["Interests", user?.studentProfile?.interests?.length ? user.studentProfile.interests.join(" · ") : "No interests yet", "Personalized interests saved to your profile."],
        ].map(([label, value, description]) => (
          <div key={label} className="rounded-[22px] border border-white/80 bg-white/60 p-5 backdrop-blur-xl">
            <p className="text-[9px] uppercase tracking-[.16em] text-black/30">{label}</p>
            <p className="mt-2 break-words text-sm font-semibold">{value}</p>
            <p className="mt-1 text-[10px] leading-5 text-black/35">{description}</p>
          </div>
        ))}
      </section>

      <section className="rounded-[30px] border border-white/80 bg-white/60 p-6 backdrop-blur-2xl md:p-8">
        <p className="text-[9px] uppercase tracking-[.2em] text-black/30">Continue building</p>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <Link href="/dashboard/student/interests" className="rounded-[21px] bg-black/[.025] p-5 transition hover:bg-white">
            <span className="text-lg">✦</span><h3 className="mt-4 text-sm font-semibold">Interests</h3><p className="mt-2 text-[10px] text-black/35">Refine what you want to explore.</p>
          </Link>
          <Link href="/dashboard/skills/my-skills" className="rounded-[21px] bg-black/[.025] p-5 transition hover:bg-white">
            <span className="text-lg">◇</span><h3 className="mt-4 text-sm font-semibold">Skills</h3><p className="mt-2 text-[10px] text-black/35">Track what you're developing.</p>
          </Link>
          <Link href="/dashboard/student/portfolio" className="rounded-[21px] bg-black/[.025] p-5 transition hover:bg-white">
            <span className="text-lg">▣</span><h3 className="mt-4 text-sm font-semibold">Portfolio</h3><p className="mt-2 text-[10px] text-black/35">Turn your work into a visible record.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
