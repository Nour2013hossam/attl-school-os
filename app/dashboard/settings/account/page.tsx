"use client";

import Link from "next/link";

const sections = [
  ["Account", "Manage your profile and personal information.", "/dashboard/settings/account", "○"],
  ["Security", "Password, sessions and account protection.", "/dashboard/settings/security", "◈"],
  ["Appearance", "Customize how ATTL School OS looks.", "/dashboard/settings/appearance", "◐"],
  ["Language", "Choose your interface language.", "/dashboard/settings/language", "文"],
  ["Notifications", "Control what you receive and when.", "/dashboard/settings/notifications", "◌"],
  ["Privacy", "Manage your visibility and data preferences.", "/dashboard/settings/privacy", "◇"],
  ["Academic", "Academic preferences and school settings.", "/dashboard/settings/academic", "▤"],
  ["ATTL", "Manage your ATTL experience.", "/dashboard/settings/attl", "A"],
  ["Gamification", "XP, levels, achievements and leaderboards.", "/dashboard/settings/gamification", "✦"],
  ["AI", "Configure your AI learning experience.", "/dashboard/settings/ai", "✧"],
  ["Files", "Manage your uploaded files and storage.", "/dashboard/settings/files", "□"],
  ["Integrations", "Connect supported services.", "/dashboard/settings/integrations", "↗"],
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[34px] border border-white/80 bg-white/65 p-7 shadow-[0_25px_80px_rgba(20,30,50,.08)] backdrop-blur-[30px]">
        <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-blue-500">
          Settings
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-[-.05em]">
          Make ATTL yours.
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-black/40">
          Manage your account, experience, privacy, notifications and
          preferences from one place.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sections.map(([title, description, href, icon]) => (
          <Link
            key={title}
            href={href}
            className="group rounded-[26px] border border-white/80 bg-white/60 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/85 hover:shadow-[0_20px_50px_rgba(20,30,50,.08)]"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-black text-sm text-white">
                {icon}
              </div>

              <span className="text-black/20 transition-transform group-hover:translate-x-1">
                →
              </span>
            </div>

            <h2 className="mt-5 text-sm font-semibold">{title}</h2>

            <p className="mt-2 text-[10px] leading-5 text-black/35">
              {description}
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}
