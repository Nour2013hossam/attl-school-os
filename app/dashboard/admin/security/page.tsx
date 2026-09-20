"use client";

import { useEffect, useState } from "react";
import { usePreferences } from "@/components/providers/preferences-provider";

type SecurityData = {
  summary: { activeUsers: number; disabledUsers: number; permissionOverrides: number; customRoles: number; fileCount: number };
  recentAudit: Array<{ id: string; action: string; entity: string; createdAt: string; actor: { name: string; role: string } | null }>;
  controls: Record<string, string>;
};

export default function SecurityPage() {
  const { can, permissionsReady } = usePreferences();
  const [data, setData] = useState<SecurityData | null>(null);
  const [error, setError] = useState("");

  async function load() {
    setError("");
    const r = await fetch("/api/admin/security/overview", { cache: "no-store" });
    const d = await r.json();
    if (!r.ok) return setError(d.error ?? "Unable to load security overview.");
    setData(d);
  }

  useEffect(() => {
    if (permissionsReady && can("security.manage")) load();
  }, [permissionsReady, can]);

  if (!permissionsReady) return <div className="rounded-[28px] bg-black p-8 text-[10px] text-white/40">Loading security controls…</div>;

  if (!can("security.manage")) {
    return <div className="rounded-[28px] border border-dashed border-black/10 p-10 text-center text-[10px] text-black/35">Security controls are not available for this account.</div>;
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[34px] bg-black p-7 text-white shadow-[0_25px_80px_rgba(20,30,50,.12)] md:p-9">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/25 blur-[110px]" />
        <div className="relative">
          <p className="text-[9px] uppercase tracking-[.22em] text-blue-300">Admin OS · Security</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-.06em] md:text-5xl">Security center.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">Live authorization, account-state and audit signals for the School OS.</p>
        </div>
      </section>

      {error && <div className="rounded-[16px] bg-red-500/10 px-4 py-3 text-[10px] text-red-600">{error}</div>}

      <section className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {data && [
          ["Active users", data.summary.activeUsers],
          ["Disabled users", data.summary.disabledUsers],
          ["Permission overrides", data.summary.permissionOverrides],
          ["Custom roles", data.summary.customRoles],
          ["Stored files", data.summary.fileCount],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-[23px] border border-white/80 bg-white/65 p-5 backdrop-blur-2xl">
            <p className="text-[8px] uppercase tracking-[.16em] text-black/25">{label}</p>
            <p className="mt-3 text-2xl font-semibold">{String(value)}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
        <div className="rounded-[28px] border border-white/80 bg-white/65 p-6 backdrop-blur-2xl">
          <p className="text-[8px] uppercase tracking-[.18em] text-black/25">Audit stream</p>
          <h2 className="mt-1 text-xl font-semibold">Recent security-relevant activity</h2>
          <div className="mt-5 space-y-2">
            {(data?.recentAudit ?? []).map((entry) => (
              <div key={entry.id} className="rounded-[17px] bg-black/[.025] p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[9px] font-semibold">{entry.action.replaceAll("_", " ")}</p>
                  <span className="text-[8px] text-black/25">{new Date(entry.createdAt).toLocaleString()}</span>
                </div>
                <p className="mt-1 text-[8px] text-black/35">{entry.entity} · {entry.actor?.name ?? "System"} · {entry.actor?.role ?? "SYSTEM"}</p>
              </div>
            ))}
            {data && data.recentAudit.length === 0 && <p className="text-[10px] text-black/30">No audit activity yet.</p>}
          </div>
        </div>

        <div className="rounded-[28px] bg-black p-6 text-white">
          <p className="text-[8px] uppercase tracking-[.18em] text-white/30">Security baseline</p>
          <div className="mt-5 space-y-2">
            {Object.entries(data?.controls ?? {}).map(([label, value]) => (
              <div key={label} className="rounded-[17px] border border-white/10 bg-white/[.05] p-3">
                <p className="text-[9px] font-semibold">{label}</p>
                <p className="mt-1 text-[8px] text-white/35">{value}</p>
              </div>
            ))}
          </div>
          <button onClick={load} className="mt-5 rounded-[14px] bg-white px-4 py-2.5 text-[9px] font-semibold text-black">Refresh</button>
        </div>
      </section>
    </div>
  );
}
