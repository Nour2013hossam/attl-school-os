export default function SecurityPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[34px] border border-white/80 bg-white/65 p-7 backdrop-blur-[30px]">
        <p className="text-[10px] uppercase tracking-[.2em] text-blue-500">
          Security
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-.05em]">
          Protect your account.
        </h1>
        <p className="mt-3 text-sm text-black/40">
          Review account protection and active sessions.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {[
          ["Password", "Last changed recently", "Change password"],
          ["Two-factor authentication", "Not configured", "Configure"],
          ["Active sessions", "2 active sessions", "View sessions"],
          ["Login activity", "No unusual activity", "View activity"],
        ].map(([title, status, action]) => (
          <div
            key={title}
            className="rounded-[26px] border border-white/80 bg-white/60 p-6 backdrop-blur-xl"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-black text-white">
                ◈
              </div>
              <span className="text-[9px] text-green-600">{status}</span>
            </div>

            <h2 className="mt-5 text-sm font-semibold">{title}</h2>

            <button
              type="button"
              className="mt-5 rounded-[13px] bg-black px-4 py-2 text-[9px] text-white"
            >
              {action}
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
