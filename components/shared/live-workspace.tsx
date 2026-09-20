"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePreferences } from "@/components/providers/preferences-provider";
import { translateUiText } from "@/lib/i18n";

type LiveWorkspaceProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon?: string;
  api?: string;
  actions?: Array<{ label: string; href: string }>;
};

function titleize(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/^./, (char) => char.toUpperCase());
}

function firstUsefulValues(value: unknown): Array<[string, string]> {
  if (!value || typeof value !== "object") return [];
  return Object.entries(value as Record<string, unknown>)
    .filter(([key]) => !["id", "createdAt", "updatedAt"].includes(key))
    .slice(0, 6)
    .map(([key, raw]) => {
      if (raw === null || raw === undefined) return [titleize(key), "—"];
      if (typeof raw === "object") return [titleize(key), "Connected"];
      return [titleize(key), String(raw)];
    });
}

export function LiveWorkspace({
  eyebrow,
  title,
  description,
  icon = "✦",
  api,
  actions = [],
}: LiveWorkspaceProps) {
  const { language } = usePreferences();
  const [payload, setPayload] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(Boolean(api));

  useEffect(() => {
    if (!api) return;

    let active = true;

    fetch(api, { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error ?? "Unable to load workspace data.");
        }
        return data;
      })
      .then((data) => {
        if (active) setPayload(data);
      })
      .catch((reason) => {
        if (active) setError(reason instanceof Error ? reason.message : "Unable to load data.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [api]);

  const collections = useMemo(() => {
    if (!payload) return [];
    return Object.entries(payload)
      .filter(([, value]) => Array.isArray(value))
      .map(([key, value]) => [key, value as unknown[]] as const);
  }, [payload]);

  const stats = useMemo(() => {
    if (!payload) return [];
    return Object.entries(payload)
      .filter(([, value]) => typeof value === "number" || typeof value === "string" || typeof value === "boolean")
      .slice(0, 4);
  }, [payload]);

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[32px] bg-black p-6 text-white shadow-[0_25px_80px_rgba(0,0,0,.12)] md:p-8">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/25 blur-[110px]" />
        <div className="absolute bottom-[-140px] left-[30%] h-80 w-80 rounded-full bg-cyan-400/10 blur-[110px]" />
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[17px] border border-white/10 bg-white/10 text-lg backdrop-blur-xl">
              {icon}
            </div>
            <div>
              <p className="text-[8px] uppercase tracking-[.22em] text-white/40">{translateUiText(eyebrow, language)}</p>
              <p className="mt-1 text-[9px] text-white/25">{translateUiText("Connected School OS workspace", language)}</p>
            </div>
          </div>

          <h1 className="mt-6 text-3xl font-semibold tracking-[-.06em] md:text-5xl">{translateUiText(title, language)}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">{translateUiText(description, language)}</p>

          {actions.length > 0 && (
            <div className="mt-7 flex flex-wrap gap-2">
              {actions.map((action) => (
                <Link key={action.href} href={action.href} className="rounded-[15px] bg-white px-4 py-2.5 text-[9px] font-semibold text-black transition hover:bg-white/90">
                  {action.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {loading && (
        <section className="rounded-[28px] border border-white/80 bg-white/60 p-6 text-[10px] text-black/35 backdrop-blur-2xl">
          {translateUiText("Loading live data...", language)}
        </section>
      )}

      {error && (
        <section className="rounded-[28px] border border-red-500/10 bg-red-500/[.025] p-6 text-[10px] text-red-600">
          {error}
        </section>
      )}

      {stats.length > 0 && (
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map(([key, value]) => (
            <div key={key} className="rounded-[23px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl">
              <p className="text-[8px] uppercase tracking-[.18em] text-black/30">{translateUiText(titleize(key), language)}</p>
              <p className="mt-3 text-2xl font-semibold tracking-[-.05em]">{String(value)}</p>
            </div>
          ))}
        </section>
      )}

      {collections.map(([key, collection]) => (
        <section key={key} className="rounded-[30px] border border-white/80 bg-white/60 p-5 shadow-[0_15px_50px_rgba(20,30,50,.05)] backdrop-blur-2xl md:p-7">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[8px] uppercase tracking-[.18em] text-black/25">{titleize(key)}</p>
              <h2 className="mt-1 text-xl font-semibold tracking-[-.04em]">{collection.length} {language === "ar" ? "سجلات" : "records"}</h2>
            </div>
            <span className="rounded-full bg-black/[.04] px-3 py-1.5 text-[8px] text-black/35">
              Live
            </span>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {collection.slice(0, 24).map((item, index) => {
              const values = firstUsefulValues(item);
              return (
                <article key={(item as { id?: string })?.id ?? String(index)} className="rounded-[22px] border border-black/[.04] bg-white/60 p-4">
                  {values.length ? (
                    values.map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between gap-4 border-b border-black/[.04] py-2 last:border-0">
                        <span className="text-[8px] text-black/30">{label}</span>
                        <span className="max-w-[60%] truncate text-[9px] font-medium text-right">{value}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-black/35">Record {index + 1}</p>
                  )}
                </article>
              );
            })}
          </div>

          {collection.length > 24 && (
            <p className="mt-4 text-center text-[9px] text-black/25">{language === "ar" ? "يتم عرض أول 24 سجلًا." : "Showing the first 24 records."}</p>
          )}
        </section>
      ))}

      {!loading && !error && collections.length === 0 && stats.length === 0 && (
        <section className="rounded-[30px] border border-dashed border-black/10 bg-black/[.02] p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">{icon}</div>
          <h2 className="mt-4 text-lg font-semibold">{language === "ar" ? "مساحة العمل جاهزة" : "Workspace ready"}</h2>
          <p className="mx-auto mt-2 max-w-xl text-[10px] leading-5 text-black/30">
            {language === "ar" ? "هذه الشاشة متصلة ببنية نظام المدرسة وجاهزة لبياناتها." : "This screen is wired to the School OS architecture and ready for its domain data."}
          </p>
        </section>
      )}
    </div>
  );
}
