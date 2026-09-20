"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePreferences } from "@/components/providers/preferences-provider";

type Kind = "notifications" | "privacy" | "academic" | "attl" | "gamification" | "ai";
type Me = { name: string; role: string; xp: number; level: number; gradeLevel: string | null; className: string | null };

const copy: Record<Kind, { eyebrow: string; title: string; description: string }> = {
  notifications: { eyebrow: "Settings · Notifications", title: "Stay informed, without the noise.", description: "Choose how School OS keeps you updated about your account and school activity." },
  privacy: { eyebrow: "Settings · Privacy", title: "Your visibility, your control.", description: "Manage the profile visibility setting currently supported by School OS." },
  academic: { eyebrow: "Settings · Academic", title: "Shape your academic workspace.", description: "Jump directly into the academic areas that matter while keeping your core profile settings centralized." },
  attl: { eyebrow: "Settings · ATTL", title: "Your ATTL layer.", description: "See your current ATTL status and move into the team spaces available to your account." },
  gamification: { eyebrow: "Settings · Gamification", title: "Your progress layer.", description: "See the live XP and level values that power your School OS progression." },
  ai: { eyebrow: "Settings · AI", title: "The intelligent layer.", description: "AI features are being prepared as a safe, permission-aware layer for learning and school workflows." },
};

export function SettingsHub({ kind }: { kind: Kind }) {
  const { preferences, language, can, updatePreferences } = usePreferences();
  const [me, setMe] = useState<Me | null>(null);
  const [message, setMessage] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(preferences.emailNotifications);
  const [pushNotifications, setPushNotifications] = useState(preferences.pushNotifications);
  const [profileVisible, setProfileVisible] = useState(preferences.profileVisible);

  useEffect(() => {
    setEmailNotifications(preferences.emailNotifications);
    setPushNotifications(preferences.pushNotifications);
    setProfileVisible(preferences.profileVisible);
  }, [preferences.emailNotifications, preferences.pushNotifications, preferences.profileVisible]);

  useEffect(() => {
    fetch("/api/me", { cache: "no-store" }).then((r) => r.ok ? r.json() : null).then((d) => setMe(d?.user ?? null));
  }, []);

  async function update(patch: Partial<typeof preferences>) {
    try {
      await updatePreferences(patch);
      setMessage(language === "ar" ? "تم حفظ الإعدادات." : "Settings saved.");
    } catch {
      setMessage(language === "ar" ? "تعذر حفظ الإعدادات." : "Could not save settings.");
    }
  }

  const meta = copy[kind];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[34px] bg-black p-7 text-white shadow-[0_30px_90px_rgba(0,0,0,.16)] md:p-9">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/20 blur-[105px]" />
        <div className="relative">
          <p className="text-[9px] uppercase tracking-[.22em] text-blue-300">{meta.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-.06em]">{meta.title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">{meta.description}</p>
        </div>
      </section>

      {kind === "notifications" && (
        <section className="rounded-[28px] border border-white/80 bg-white/60 p-6 backdrop-blur-2xl md:p-8">
          {[
            ["Email notifications", emailNotifications, { emailNotifications: !emailNotifications }],
            ["Push notifications", pushNotifications, { pushNotifications: !pushNotifications }],
          ].map(([label, value, patch]) => (
            <div key={String(label)} className="flex items-center justify-between gap-4 border-b border-black/5 py-5 last:border-0">
              <div><p className="text-sm font-semibold">{String(label)}</p><p className="mt-1 text-[9px] text-black/35">Saved to your School OS account.</p></div>
              <button type="button" onClick={() => { const next = Boolean(!(value as boolean)); if (String(label).startsWith("Email")) setEmailNotifications(next); else setPushNotifications(next); update(patch as Partial<typeof preferences>); }} className={"h-7 w-12 rounded-full p-1 transition " + (value ? "bg-black" : "bg-black/10")}><span className={"block h-5 w-5 rounded-full bg-white transition " + (value ? "translate-x-5" : "")} /></button>
            </div>
          ))}
          {message && <p className="mt-4 rounded-[15px] bg-black/[.03] px-4 py-3 text-[10px] text-black/50">{message}</p>}
        </section>
      )}

      {kind === "privacy" && (
        <section className="rounded-[28px] border border-white/80 bg-white/60 p-6 backdrop-blur-2xl md:p-8">
          <div className="flex items-center justify-between gap-5">
            <div><p className="text-sm font-semibold">Profile visibility</p><p className="mt-1 max-w-xl text-[10px] leading-5 text-black/35">When enabled, your profile can be discovered by other School OS members where the relevant feature supports it.</p></div>
            <button type="button" onClick={() => { const next = !profileVisible; setProfileVisible(next); update({ profileVisible: next }); }} className={"h-7 w-12 shrink-0 rounded-full p-1 transition " + (profileVisible ? "bg-black" : "bg-black/10")}><span className={"block h-5 w-5 rounded-full bg-white transition " + (profileVisible ? "translate-x-5" : "")} /></button>
          </div>
          {message && <p className="mt-5 rounded-[15px] bg-black/[.03] px-4 py-3 text-[10px] text-black/50">{message}</p>}
        </section>
      )}

      {kind === "academic" && (
        <section className="grid gap-3 md:grid-cols-2">
          {[
            ["Grades", "Review your current academic record.", "/dashboard/academics/grades"],
            ["Attendance", "See attendance history and trends.", "/dashboard/academics/attendance"],
            ["Assignments", "Track pending work and submissions.", "/dashboard/academics/assignments"],
            ["Schedule", "Open your current academic timetable.", "/dashboard/academics/schedule"],
            ["Results", "View released results when available.", "/dashboard/academics/results"],
            ["Transcript", "Open your academic transcript.", "/dashboard/academics/transcript"],
          ].filter(([, , href]) => can("academics.read") || href.includes("settings")).map(([title, text, href]) => (
            <Link key={title} href={href} className="rounded-[23px] border border-white/80 bg-white/60 p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white">
              <p className="text-[8px] uppercase tracking-[.18em] text-blue-500">Academic</p>
              <h2 className="mt-2 text-base font-semibold">{title}</h2>
              <p className="mt-2 text-[10px] leading-5 text-black/35">{text}</p>
              <span className="mt-5 block text-[9px] text-black/30">Open →</span>
            </Link>
          ))}
        </section>
      )}

      {kind === "attl" && (
        <section className="grid gap-4 lg:grid-cols-[.8fr_1.2fr]">
          <div className="rounded-[28px] bg-black p-6 text-white">
            <p className="text-[8px] uppercase tracking-[.18em] text-white/30">Current account</p>
            <p className="mt-3 text-xl font-semibold">{me?.role ?? "—"}</p>
            <p className="mt-2 text-[10px] text-white/35">{me?.name ?? "Loading..."}</p>
            <div className="mt-6 rounded-[18px] bg-white/[.06] p-4">
              <p className="text-[8px] uppercase tracking-[.15em] text-white/25">ATTL access</p>
              <p className="mt-2 text-sm font-semibold">{can("attl.read") ? "Available" : "Not available"}</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["ATTL Overview", "/dashboard/attl/overview"],
              ["Command Center", "/dashboard/attl/command-center"],
              ["Team", "/dashboard/attl/team"],
              ["Tracks", "/dashboard/attl/tracks"],
            ].filter(([, href]) => can(href.includes("tracks") ? "attl.tracks.manage" : "attl.read")).map(([title, href]) => (
              <Link key={title} href={href} className="rounded-[23px] border border-white/80 bg-white/60 p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white">
                <h2 className="text-sm font-semibold">{title}</h2>
                <p className="mt-2 text-[10px] text-black/35">Open the workspace.</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {kind === "gamification" && (
        <section className="grid gap-3 md:grid-cols-3">
          {[
            ["XP", me?.xp ?? "—", "Current experience points.", "/dashboard/student/xp"],
            ["Level", me?.level ?? "—", "Current School OS level.", "/dashboard/student/level"],
            ["Achievements", "View", "Open your achievement collection.", "/dashboard/student/achievements"],
          ].map(([title, value, text, href]) => (
            <Link key={title} href={href} className="rounded-[25px] border border-white/80 bg-white/60 p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white">
              <p className="text-[8px] uppercase tracking-[.18em] text-black/25">{title}</p>
              <p className="mt-3 text-3xl font-semibold">{value}</p>
              <p className="mt-2 text-[10px] text-black/35">{text}</p>
            </Link>
          ))}
        </section>
      )}

      {kind === "ai" && (
        <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          {[
            ["Learning assistant", "A future permission-aware layer for course guidance, summaries and study support.", "/dashboard/learning/explore", "learning.read"],
            ["Project assistant", "A future layer for project planning, task suggestions and progress support.", "/dashboard/projects/all", "projects.read"],
            ["Innovation assistant", "A future layer for idea shaping, research prompts and experiment planning.", "/dashboard/innovation/ideas", "innovation.submit"],
            ["School intelligence", "A future admin layer for operational insights and governed analytics.", "/dashboard/admin/analytics", "analytics.read"],
          ].filter(([, , , permission]) => can(permission)).map(([title, text, href]) => (
            <Link key={title} href={href} className="rounded-[25px] border border-white/80 bg-white/60 p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white">
              <p className="text-[8px] uppercase tracking-[.18em] text-blue-500">AI layer</p>
              <h2 className="mt-2 text-base font-semibold">{title}</h2>
              <p className="mt-2 text-[10px] leading-5 text-black/35">{text}</p>
              <span className="mt-5 block text-[9px] text-black/30">Open context →</span>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}
