"use client";

import { useState } from "react";

export default function AppearancePage() {
  const [compact, setCompact] = useState(false);
  const [motion, setMotion] = useState(true);

  return (
    <div className="space-y-6">
      <section className="rounded-[34px] bg-black p-7 text-white shadow-[0_30px_90px_rgba(0,0,0,.18)]">
        <p className="text-[10px] uppercase tracking-[.2em] text-blue-400">
          Appearance
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-.05em]">
          Your interface.
        </h1>
        <p className="mt-3 text-sm text-white/40">
          Customize the visual experience of your School OS.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {["Liquid Glass", "Minimal", "High Contrast"].map((theme, index) => (
          <button
            key={theme}
            type="button"
            className={`rounded-[26px] border p-5 text-left transition ${
              index === 0
                ? "border-blue-400 bg-white shadow-[0_15px_40px_rgba(40,100,255,.12)]"
                : "border-white/80 bg-white/60 hover:bg-white"
            }`}
          >
            <div className="h-24 rounded-[18px] bg-gradient-to-br from-white via-blue-50 to-black/5" />
            <p className="mt-4 text-sm font-semibold">{theme}</p>
            <p className="mt-1 text-[9px] text-black/35">
              {index === 0 ? "Currently active" : "Available theme"}
            </p>
          </button>
        ))}
      </section>

      <section className="rounded-[28px] border border-white/80 bg-white/60 p-6 backdrop-blur-xl">
        {[
          ["Compact navigation", compact, setCompact],
          ["Motion effects", motion, setMotion],
        ].map(([label, value, setter]) => (
          <div
            key={String(label)}
            className="flex items-center justify-between border-b border-black/5 py-5 last:border-0"
          >
            <div>
              <p className="text-sm font-medium">{String(label)}</p>
              <p className="mt-1 text-[9px] text-black/30">
                Customize your interface experience.
              </p>
            </div>

            <button
              type="button"
              onClick={() => (setter as (v: boolean) => void)(!(value as boolean))}
              className={`h-7 w-12 rounded-full p-1 transition ${
                value ? "bg-black" : "bg-black/10"
              }`}
            >
              <span
                className={`block h-5 w-5 rounded-full bg-white transition ${
                  value ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
