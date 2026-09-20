"use client";

import { useEffect, useState } from "react";
import { usePreferences } from "@/components/providers/preferences-provider";

type Health = { ok: boolean; service: string; database: string; timestamp?: string };
type School = { name: string; tagline: string | null; academicYear: string; supportEmail: string | null };

export default function SystemPage() {
  const { can, permissionsReady } = usePreferences();
  const [health, setHealth] = useState<Health | null>(null);
  const [stats, setStats] = useState<string[]>([]);
  const [school, setSchool] = useState<School>({
    name: "Al Thagr School",
    tagline: "ATTL School OS",
    academicYear: "2026–2027",
    supportEmail: null,
  });
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setMessage("");
    const [healthResponse, statsResponse, schoolResponse] = await Promise.all([
      fetch("/api/health", { cache: "no-store" }),
      fetch("/api/admin/system/stats", { cache: "no-store" }),
      fetch("/api/admin/school", { cache: "no-store" }),
    ]);

    if (healthResponse.ok) setHealth(await healthResponse.json());
    if (statsResponse.ok) {
      const data = await statsResponse.json();
      setStats(data.stats ?? []);
    }
    if (schoolResponse.ok) {
      const data = await schoolResponse.json();
      if (data.school) setSchool(data.school);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function saveSchool() {
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/admin/school", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(school),
    });
    const data = await response.json();
    setMessage(response.ok ? "School settings saved." : (data.error ?? "Could not save school settings."));
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[32px] bg-black p-7 text-white md:p-9">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/25 blur-[110px]" />
        <div className="relative">
          <p className="text-[9px] uppercase tracking-[.2em] text-blue-300">Admin OS</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-.05em] md:text-5xl">System control.</h1>
          <p className="mt-3 max-w-2xl text-sm text-white/40">
            Monitor the School OS and control the school-wide configuration from one place.
          </p>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <div className="rounded-[25px] border border-white/80 bg-white/60 p-5 backdrop-blur-xl">
          <p className="text-[8px] uppercase tracking-[.15em] text-black/25">Database</p>
          <p className={"mt-2 text-lg font-semibold " + (health?.ok ? "text-green-600" : "text-red-600")}>{health?.database ?? "Checking..."}</p>
          <p className="mt-1 text-[8px] text-black/25">{health?.timestamp ? new Date(health.timestamp).toLocaleString() : ""}</p>
        </div>
        {stats.map((item, index) => {
          const [label, ...rest] = item.split(":");
          return (
            <div key={index} className="rounded-[25px] border border-white/80 bg-white/60 p-5 backdrop-blur-xl">
              <p className="text-[8px] uppercase tracking-[.15em] text-black/25">{label}</p>
              <p className="mt-2 text-lg font-semibold">{rest.join(":")}</p>
            </div>
          );
        })}
      </section>

      {permissionsReady && can("system.manage") && (
        <section className="rounded-[30px] border border-white/80 bg-white/60 p-6 backdrop-blur-2xl md:p-8">
          <div>
            <p className="text-[8px] uppercase tracking-[.2em] text-blue-500">School control</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-.04em]">School profile & configuration</h2>
            <p className="mt-2 max-w-2xl text-[11px] leading-5 text-black/40">
              These values are stored centrally and can be used across School OS surfaces.
            </p>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-[9px] uppercase tracking-[.16em] text-black/30">School name</span>
              <input value={school.name} onChange={(e) => setSchool((s) => ({ ...s, name: e.target.value }))} className="h-11 w-full rounded-[14px] border border-black/5 bg-white/80 px-3 text-[10px] outline-none" />
            </label>
            <label className="space-y-2">
              <span className="text-[9px] uppercase tracking-[.16em] text-black/30">Academic year</span>
              <input value={school.academicYear} onChange={(e) => setSchool((s) => ({ ...s, academicYear: e.target.value }))} className="h-11 w-full rounded-[14px] border border-black/5 bg-white/80 px-3 text-[10px] outline-none" />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-[9px] uppercase tracking-[.16em] text-black/30">Tagline</span>
              <input value={school.tagline ?? ""} onChange={(e) => setSchool((s) => ({ ...s, tagline: e.target.value || null }))} className="h-11 w-full rounded-[14px] border border-black/5 bg-white/80 px-3 text-[10px] outline-none" />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-[9px] uppercase tracking-[.16em] text-black/30">Support email</span>
              <input type="email" value={school.supportEmail ?? ""} onChange={(e) => setSchool((s) => ({ ...s, supportEmail: e.target.value || null }))} className="h-11 w-full rounded-[14px] border border-black/5 bg-white/80 px-3 text-[10px] outline-none" />
            </label>
          </div>

          {message && <div className="mt-4 rounded-[14px] bg-blue-500/10 px-4 py-3 text-[9px] text-blue-700">{message}</div>}

          <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={saveSchool} disabled={saving} className="rounded-[14px] bg-black px-5 py-3 text-[9px] font-semibold text-white disabled:opacity-40">{saving ? "Saving..." : "Save school settings"}</button>
            <button onClick={load} disabled={saving} className="rounded-[14px] bg-black/[.04] px-5 py-3 text-[9px] font-semibold text-black/50">Refresh status</button>
          </div>
        </section>
      )}

      <section className="rounded-[28px] border border-white/80 bg-white/60 p-6 backdrop-blur-xl">
        <p className="text-[8px] uppercase tracking-[.15em] text-black/25">Service</p>
        <h2 className="mt-2 text-xl font-semibold">{health?.service ?? "ATTL School OS"}</h2>
        <p className="mt-2 text-[10px] leading-5 text-black/35">
          System health stays separate from operational data so administrators can diagnose the platform quickly.
        </p>
      </section>
    </div>
  );
}
