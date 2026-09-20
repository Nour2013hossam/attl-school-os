"use client";

import { useEffect, useMemo, useState } from "react";

type Member = {
  id: string;
  name: string;
  role: string;
  scope: string;
  avatarUrl: string | null;
  bio: string | null;
  xp: number;
  level: number;
  portfolioUrl: string | null;
  links: Array<{ id: string; platform: string; url: string; label: string | null }>;
};

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join("");
}

export function HomeMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/members", { cache: "no-store" })
      .then((r) => r.ok ? r.json() : { members: [] })
      .then((d) => setMembers(d.members ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return members;
    return members.filter((member) =>
      [member.name, member.role, member.scope, member.bio ?? "", ...member.links.map((link) => link.platform)]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  }, [members, query]);

  return (
    <section id="members" className="border-t border-black/5 bg-[#f4f7fb] px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="text-[9px] font-semibold uppercase tracking-[.24em] text-blue-500">The community</div>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-.065em] md:text-6xl">
              Meet the people behind the system.
            </h2>
            <p className="mt-4 max-w-2xl text-[13px] leading-6 text-black/43">
              Profiles come directly from active School OS accounts. Role, bio, XP and public links stay connected automatically.
            </p>
          </div>
          <div className="w-full md:max-w-xs">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search members..."
              className="h-11 w-full rounded-[15px] border border-white/90 bg-white/70 px-4 text-[10px] outline-none backdrop-blur-xl"
            />
          </div>
        </div>

        {loading ? (
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-64 animate-pulse rounded-[28px] border border-white/80 bg-white/60" />
            ))}
          </div>
        ) : (
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((member) => (
              <article key={member.id} className="group relative overflow-hidden rounded-[28px] border border-white/85 bg-white/65 p-6 shadow-[0_18px_55px_rgba(30,45,70,.07)] backdrop-blur-2xl transition hover:-translate-y-1 hover:bg-white/85">
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl transition-transform duration-500 group-hover:scale-125" />
                <div className="relative flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[18px] bg-black text-[12px] font-semibold text-white shadow-lg">
                    {member.avatarUrl ? <img src={member.avatarUrl} alt="" className="h-full w-full object-cover" /> : initials(member.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold tracking-[-.035em]">{member.name}</h3>
                    <p className="mt-1 text-[9px] font-semibold uppercase tracking-[.15em] text-blue-600">{member.role}</p>
                    <p className="mt-1 text-[9px] text-black/33">{member.scope}</p>
                  </div>
                </div>

                <p className="relative mt-5 min-h-[48px] text-[11px] leading-5 text-black/42">
                  {member.bio || "School OS member."}
                </p>

                <div className="relative mt-5 grid grid-cols-2 gap-2">
                  <div className="rounded-[16px] bg-black/[.03] p-3">
                    <p className="text-[7px] uppercase tracking-[.16em] text-black/25">XP</p>
                    <p className="mt-1 text-lg font-semibold">{member.xp.toLocaleString()}</p>
                  </div>
                  <div className="rounded-[16px] bg-black/[.03] p-3">
                    <p className="text-[7px] uppercase tracking-[.16em] text-black/25">Level</p>
                    <p className="mt-1 text-lg font-semibold">{member.level}</p>
                  </div>
                </div>

                <div className="relative mt-4 flex flex-wrap gap-1.5">
                  {member.links.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-black/5 bg-white/80 px-2.5 py-1.5 text-[8px] font-medium text-black/45 hover:bg-black hover:text-white"
                    >
                      {link.label || link.platform} ↗
                    </a>
                  ))}
                  {member.portfolioUrl && (
                    <a href={member.portfolioUrl} target="_blank" rel="noreferrer" className="rounded-full border border-blue-500/10 bg-blue-500/10 px-2.5 py-1.5 text-[8px] font-semibold text-blue-600">
                      Portfolio ↗
                    </a>
                  )}
                </div>
              </article>
            ))}
            {filtered.length === 0 && (
              <div className="rounded-[28px] border border-dashed border-black/10 bg-white/45 p-10 text-center text-[10px] text-black/30 sm:col-span-2 lg:col-span-3">
                No visible members yet.
              </div>
            )}
          </div>
        )}

        <p className="mt-5 text-[8px] leading-4 text-black/25">
          Public member cards respect each account's profile visibility setting and never show passwords or private account data.
        </p>
      </div>
    </section>
  );
}
