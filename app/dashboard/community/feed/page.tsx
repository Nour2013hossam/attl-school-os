import Link from "next/link";

const posts = [
  ["Omar", "Shared a new robotics project with the Technology track.", "12 min"],
  ["Mariam", "Published a research resource about climate innovation.", "1h"],
  ["ATTL", "New workshop announced: Building your first prototype.", "3h"],
];

export default function CommunityFeedPage() {
  return (
    <div className="mx-auto max-w-[1050px] space-y-6">
      <section className="rounded-[34px] border border-white/80 bg-white/65 p-7 backdrop-blur-[30px]">
        <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-blue-500">
          Community
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-[-.05em]">
          Your school community.
        </h1>

        <p className="mt-3 text-sm text-black/40">
          Discover people, projects, discussions and opportunities.
        </p>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <section className="space-y-4">
          <div className="rounded-[26px] border border-white/80 bg-white/60 p-5 backdrop-blur-xl">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-xs text-white">
                A
              </div>

              <div className="flex-1 rounded-[16px] bg-black/[.035] px-4 py-3 text-xs text-black/30">
                Share something with the community...
              </div>
            </div>
          </div>

          {posts.map(([name, text, time]) => (
            <article
              key={text}
              className="rounded-[28px] border border-white/80 bg-white/60 p-6 backdrop-blur-xl"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-xs text-white">
                  {name[0]}
                </div>

                <div>
                  <p className="text-xs font-medium">{name}</p>
                  <p className="text-[9px] text-black/25">{time} ago</p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-6 text-black/65">{text}</p>

              <div className="mt-5 flex gap-2">
                {["♡ 12", "○ 4", "↗ Share"].map((action) => (
                  <button
                    key={action}
                    type="button"
                    className="rounded-[12px] bg-black/[.035] px-3 py-2 text-[9px] text-black/40 transition hover:bg-white"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </section>

        <aside className="space-y-4">
          <div className="rounded-[26px] border border-white/80 bg-white/60 p-5 backdrop-blur-xl">
            <p className="text-[9px] uppercase tracking-wider text-black/25">
              Explore
            </p>

            <div className="mt-4 space-y-2">
              {[
                ["Discussions", "/dashboard/community/discussions"],
                ["Groups", "/dashboard/community/groups"],
                ["People", "/dashboard/community/people"],
                ["Messages", "/dashboard/community/messages"],
              ].map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center justify-between rounded-[14px] px-3 py-3 text-[10px] transition hover:bg-white"
                >
                  {label}
                  <span className="text-black/20">→</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
