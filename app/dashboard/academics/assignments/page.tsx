"use client";

import { useEffect, useState } from "react";

type Assignment = {
  id: string;
  title: string;
  description: string | null;
  dueAt: string;
  maxScore: number;
  subject: { code: string; name: string };
  submissions: Array<{
    status: string;
    submittedAt: string | null;
    score: number | null;
    feedback: string | null;
  }>;
};

export default function AssignmentsPage() {
  const [items, setItems] = useState<Assignment[]>([]);
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    const response = await fetch("/api/assignments", { cache: "no-store" });
    const data = await response.json();
    setItems(data.assignments ?? []);
  }

  useEffect(() => { load(); }, []);

  async function submit(id: string, status: "IN_PROGRESS" | "SUBMITTED") {
    setBusy(id);
    setMessage("");
    const response = await fetch(`/api/assignments/${id}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    setMessage(
      response.ok
        ? status === "SUBMITTED" ? "Assignment submitted." : "Draft saved."
        : data.error ?? "Could not update submission."
    );
    setBusy("");
    if (response.ok) load();
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] bg-black p-7 text-white md:p-9">
        <p className="text-[9px] uppercase tracking-[.2em] text-blue-300">Academics</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-.05em] md:text-5xl">Assignments</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">Track deadlines, save progress and submit work from one place.</p>
      </section>

      {message && <div className="rounded-[18px] bg-blue-500/10 px-4 py-3 text-[10px] text-blue-700">{message}</div>}

      <section className="space-y-3">
        {items.map((item) => {
          const submission = item.submissions[0];
          const overdue =
            new Date(item.dueAt) < new Date() &&
            submission?.status !== "SUBMITTED" &&
            submission?.status !== "LATE";

          return (
            <article key={item.id} className="rounded-[26px] border border-white/80 bg-white/65 p-5 backdrop-blur-2xl md:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-black/[.05] px-3 py-1 text-[8px] uppercase tracking-[.12em] text-black/35">{item.subject.code}</span>
                    <span className={`rounded-full px-3 py-1 text-[8px] uppercase tracking-[.12em] ${overdue ? "bg-red-500/10 text-red-600" : "bg-blue-500/10 text-blue-600"}`}>
                      {overdue ? "Overdue" : (submission?.status ?? "Not started").replaceAll("_", " ")}
                    </span>
                  </div>
                  <h2 className="mt-3 text-lg font-semibold">{item.title}</h2>
                  <p className="mt-2 max-w-2xl text-[11px] leading-5 text-black/40">{item.description ?? "No description provided."}</p>
                  <div className="mt-4 flex flex-wrap gap-4 text-[9px] text-black/35">
                    <span>Due {new Date(item.dueAt).toLocaleString()}</span>
                    <span>Max {item.maxScore}</span>
                    {submission?.score != null && <span>Score {submission.score}</span>}
                  </div>
                  {submission?.feedback && <p className="mt-4 rounded-[15px] bg-black/[.03] p-3 text-[10px] text-black/45">Feedback: {submission.feedback}</p>}
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  <button disabled={busy === item.id} onClick={() => submit(item.id, "IN_PROGRESS")} className="rounded-[14px] bg-black/[.05] px-4 py-2.5 text-[9px] font-semibold text-black/60 disabled:opacity-40">Save draft</button>
                  <button disabled={busy === item.id} onClick={() => submit(item.id, "SUBMITTED")} className="rounded-[14px] bg-black px-4 py-2.5 text-[9px] font-semibold text-white disabled:opacity-40">
                    {busy === item.id ? "Saving..." : "Submit"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
        {items.length === 0 && <div className="rounded-[26px] border border-dashed border-black/10 p-10 text-center text-[10px] text-black/30">No assignments are currently available.</div>}
      </section>
    </div>
  );
}
