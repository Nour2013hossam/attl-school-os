"use client";

import { FormEvent, useEffect, useState } from "react";
import { usePreferences } from "@/components/providers/preferences-provider";

type School = {
  name: string;
  tagline: string | null;
  academicYear: string;
  supportEmail: string | null;
};

export default function SchoolControlPage() {
  const { can, permissionsReady } = usePreferences();
  const [school, setSchool] = useState<School>({
    name: "",
    tagline: "",
    academicYear: "",
    supportEmail: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const allowed = permissionsReady && can("school.manage");

  useEffect(() => {
    if (!allowed) return;
    fetch("/api/admin/school", { cache: "no-store" })
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error ?? "Could not load school settings.");
        setSchool(d.school);
      })
      .catch((e) => setMessage(e.message));
  }, [allowed]);

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!allowed) return;
    setSaving(true);
    setMessage("");
    try {
      const r = await fetch("/api/admin/school", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(school),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error ?? "Could not save school settings.");
      setMessage("School settings saved.");
      setSchool(d.school);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not save school settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[34px] bg-black p-7 text-white shadow-[0_35px_100px_rgba(0,0,0,.2)] md:p-9">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/25 blur-[110px]" />
        <div className="relative">
          <p className="text-[9px] uppercase tracking-[.22em] text-blue-300">Administration · School</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-.06em] md:text-5xl">School Control.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
            Control the public school identity and academic-year defaults used across School OS.
          </p>
        </div>
      </section>

      {allowed && (
        <form onSubmit={save} className="rounded-[30px] border border-white/80 bg-white/60 p-6 shadow-sm backdrop-blur-2xl md:p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-[9px] uppercase tracking-[.16em] text-black/30">School name</span>
              <input value={school.name} onChange={(e) => setSchool({ ...school, name: e.target.value })} className="h-12 w-full rounded-[15px] border border-black/5 bg-white/80 px-4 text-xs outline-none" required maxLength={160} />
            </label>
            <label className="space-y-2">
              <span className="text-[9px] uppercase tracking-[.16em] text-black/30">Academic year</span>
              <input value={school.academicYear} onChange={(e) => setSchool({ ...school, academicYear: e.target.value })} className="h-12 w-full rounded-[15px] border border-black/5 bg-white/80 px-4 text-xs outline-none" required maxLength={40} />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-[9px] uppercase tracking-[.16em] text-black/30">Tagline</span>
              <input value={school.tagline ?? ""} onChange={(e) => setSchool({ ...school, tagline: e.target.value || null })} className="h-12 w-full rounded-[15px] border border-black/5 bg-white/80 px-4 text-xs outline-none" maxLength={300} />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-[9px] uppercase tracking-[.16em] text-black/30">Support email</span>
              <input type="email" value={school.supportEmail ?? ""} onChange={(e) => setSchool({ ...school, supportEmail: e.target.value || null })} className="h-12 w-full rounded-[15px] border border-black/5 bg-white/80 px-4 text-xs outline-none" maxLength={160} />
            </label>
          </div>
          {message && <p className="mt-4 rounded-[15px] bg-black/[.03] px-4 py-3 text-[10px] text-black/50">{message}</p>}
          <div className="mt-5 flex gap-2">
            <button disabled={saving} className="rounded-[15px] bg-black px-5 py-3 text-[9px] font-semibold text-white disabled:opacity-50">
              {saving ? "Saving..." : "Save school settings"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
