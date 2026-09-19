"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Me = {
  id: string;
  name: string;
  email: string;
  role: string;
  gradeLevel: string | null;
  className: string | null;
  bio: string | null;
  avatarUrl: string | null;
  xp: number;
  level: number;
  studentProfile?: {
    interests: string[];
    portfolioUrl: string | null;
  } | null;
};

export default function StudentProfilePage() {
  const [user, setUser] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/me")
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load profile");
        return response.json();
      })
      .then((payload) => setUser(payload.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const completion = useMemo(() => {
    if (!user) return 0;
    const checks = [
      Boolean(user.name),
      Boolean(user.email),
      Boolean(user.gradeLevel),
      Boolean(user.className),
      Boolean(user.bio),
      Boolean(user.studentProfile?.interests?.length),
      Boolean(user.studentProfile?.portfolioUrl),
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-[24px] border border-white/80 bg-white/60 px-6 py-4 text-[10px] text-black/40 backdrop-blur-xl">
          Loading your profile...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <section className="rounded-[30px] bg-black p-8 text-white">
        <h1 className="text-2xl font-semibold">Profile unavailable</h1>
        <p className="mt-2 text-sm text-white/45">
          Please sign in again to load your School OS profile.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex rounded-[15px] bg-white px-5 py-3 text-[9px] font-semibold text-black"
        >
          Back to sign in
        </Link>
      </section>
    );
  }

  const initial = user.name.trim().charAt(0).toUpperCase() || "A";

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[32px] bg-black p-6 text-white shadow-[0_25px_80px_rgba(0,0,0,.12)] md:p-8">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/25 blur-[110px]" />
        <div className="absolute bottom-[-130px] left-[30%] h-72 w-72 rounded-full bg-cyan-400/10 blur-[110px]" />

        <div className="relative flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[28px] bg-white text-2xl font-semibold text-black shadow-xl">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt=""
                  className="h-full w-full rounded-[28px] object-cover"
                />
              ) : (
                initial
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-400/10 px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[.15em] text-blue-300">
                  {user.role}
                </span>
                <span className="rounded-full bg-white/5 px-3 py-1.5 text-[8px] text-white/40">
                  Level {user.level}
                </span>
              </div>

              <h1 className="mt-3 text-3xl font-semibold tracking-[-.06em]">
                {user.name}
              </h1>

              <p className="mt-2 text-sm text-white/40">{user.email}</p>
              <p className="mt-2 text-[10px] text-white/25">
                {user.gradeLevel ?? "Grade not set"} · {user.className ?? "Class not set"}
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/settings/account"
            className="rounded-[16px] bg-white px-5 py-3 text-center text-[9px] font-semibold text-black transition hover:bg-white/90"
          >
            Edit account
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ["Level", String(user.level), "/dashboard/student/level"],
          ["XP", String(user.xp), "/dashboard/student/xp"],
          ["Profile", `${completion}%`, "/dashboard/student/profile"],
          ["Interests", String(user.studentProfile?.interests?.length ?? 0), "/dashboard/student/interests"],
        ].map(([label, value, href]) => (
          <Link
            key={label}
            href={href}
            className="rounded-[23px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl transition hover:-translate-y-1 hover:bg-white"
          >
            <p className="text-[8px] uppercase tracking-[.18em] text-black/30">{label}</p>
            <p className="mt-3 text-2xl font-semibold tracking-[-.05em]">{value}</p>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
        <div className="rounded-[30px] border border-white/80 bg-white/60 p-6 backdrop-blur-2xl">
          <p className="text-[9px] font-semibold uppercase tracking-[.2em] text-black/30">
            Identity
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-[-.04em]">Your School OS profile</h2>
          <p className="mt-2 text-[10px] leading-5 text-black/35">
            {user.bio || "Add a short bio from Account Settings to personalize your profile."}
          </p>

          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            {[
              ["School email", user.email],
              ["Grade", user.gradeLevel ?? "Not set"],
              ["Class", user.className ?? "Not set"],
              ["Portfolio", user.studentProfile?.portfolioUrl ? "Connected" : "Not connected"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[18px] bg-black/[.025] p-4">
                <p className="text-[8px] uppercase tracking-[.15em] text-black/25">{label}</p>
                <p className="mt-2 text-[10px] font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[30px] bg-black p-6 text-white">
          <p className="text-[9px] uppercase tracking-[.2em] text-white/30">Progress</p>
          <h2 className="mt-2 text-xl font-semibold tracking-[-.04em]">
            Complete your profile
          </h2>
          <div className="mt-7">
            <div className="flex items-center justify-between text-[9px] text-white/35">
              <span>Profile completion</span>
              <span>{completion}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-white transition-all duration-700" style={{ width: `${completion}%` }} />
            </div>
          </div>

          <Link
            href="/dashboard/settings/account"
            className="mt-7 flex items-center justify-between rounded-[16px] bg-white px-4 py-3 text-[9px] font-semibold text-black"
          >
            Complete profile
            <span>→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
