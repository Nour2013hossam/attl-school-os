"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { usePreferences } from "@/components/providers/preferences-provider";

type Question = {
  id: string;
  prompt: string;
  type: "text" | "textarea" | "select" | "multiselect";
  required: boolean;
  options: string[] | null;
  position: number;
  active: boolean;
};

const types: Question["type"][] = ["text", "textarea", "select", "multiselect"];

export default function ApplicationFormPage() {
  const { can, permissionsReady } = usePreferences();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState<Question["type"]>("text");
  const [options, setOptions] = useState("");
  const [required, setRequired] = useState(true);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState("");

  const allowed = permissionsReady && can("attl.review");

  async function load() {
    const r = await fetch("/api/attl/questions", { cache: "no-store" });
    const d = await r.json();
    if (r.ok) setQuestions(d.questions ?? []);
    else setMessage(d.error ?? "Could not load questions.");
  }

  useEffect(() => {
    if (allowed) load();
  }, [allowed]);

  async function create(event: FormEvent) {
    event.preventDefault();
    setBusy("create");
    setMessage("");
    const needsOptions = type === "select" || type === "multiselect";
    const values = options.split("\n").map((item) => item.trim()).filter(Boolean);
    const r = await fetch("/api/attl/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        type,
        required,
        options: needsOptions ? values : undefined,
        position: questions.length,
        active: true,
      }),
    });
    const d = await r.json();
    setMessage(r.ok ? "Question added." : (d.error ?? "Could not add question."));
    if (r.ok) {
      setPrompt("");
      setType("text");
      setOptions("");
      setRequired(true);
      await load();
    }
    setBusy("");
  }

  async function updateQuestion(question: Question, patch: Partial<Question>) {
    setBusy(question.id);
    const next = { ...question, ...patch };
    const r = await fetch("/api/attl/questions/" + question.id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: next.prompt,
        type: next.type,
        required: next.required,
        options: next.type === "select" || next.type === "multiselect" ? next.options ?? [] : null,
        position: next.position,
        active: next.active,
      }),
    });
    const d = await r.json();
    setMessage(r.ok ? "Question updated." : (d.error ?? "Could not update question."));
    if (r.ok) await load();
    setBusy("");
  }

  async function archive(question: Question) {
    setBusy(question.id);
    const r = await fetch("/api/attl/questions/" + question.id, { method: "DELETE" });
    const d = await r.json();
    setMessage(r.ok ? "Question archived." : (d.error ?? "Could not archive question."));
    if (r.ok) await load();
    setBusy("");
  }

  if (!permissionsReady) return null;
  if (!allowed) return <div className="rounded-[28px] border border-dashed border-black/10 p-10 text-center text-sm text-black/40">You do not have permission to manage the ATTL application form.</div>;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[34px] bg-black p-7 text-white shadow-[0_30px_90px_rgba(0,0,0,.16)] md:p-9">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/25 blur-[110px]" />
        <div className="relative">
          <p className="text-[9px] uppercase tracking-[.22em] text-blue-300">ATTL · Recruitment</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-.06em]">Application form.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">Design the questions applicants answer before they enter the ATTL recruitment pipeline.</p>
        </div>
      </section>

      {message && <div className="rounded-[16px] bg-blue-500/10 px-4 py-3 text-[10px] text-blue-700">{message}</div>}

      <section className="rounded-[30px] border border-white/80 bg-white/60 p-6 backdrop-blur-2xl">
        <div className="flex items-end justify-between gap-3">
          <div><p className="text-[8px] uppercase tracking-[.18em] text-black/25">Builder</p><h2 className="mt-1 text-xl font-semibold">Add a question</h2></div>
          <Link href="/dashboard/attl/applications" className="rounded-[13px] bg-black/[.04] px-3 py-2 text-[8px] font-semibold text-black/45">Recruitment →</Link>
        </div>
        <form onSubmit={create} className="mt-5 grid gap-3 lg:grid-cols-[1.2fr_.55fr_.8fr_auto] lg:items-end">
          <label className="space-y-2"><span className="text-[8px] uppercase tracking-[.15em] text-black/25">Prompt</span><input value={prompt} onChange={(e) => setPrompt(e.target.value)} required placeholder="Why do you want to join ATTL?" className="h-11 w-full rounded-[14px] bg-white px-3 text-[10px] outline-none" /></label>
          <label className="space-y-2"><span className="text-[8px] uppercase tracking-[.15em] text-black/25">Type</span><select value={type} onChange={(e) => setType(e.target.value as Question["type"])} className="h-11 w-full rounded-[14px] bg-white px-3 text-[10px] outline-none">{types.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label className="space-y-2"><span className="text-[8px] uppercase tracking-[.15em] text-black/25">Options</span><textarea value={options} onChange={(e) => setOptions(e.target.value)} disabled={type === "text" || type === "textarea"} rows={1} placeholder="One option per line" className="w-full rounded-[14px] bg-white px-3 py-3 text-[10px] outline-none disabled:opacity-40" /></label>
          <div className="flex items-center gap-2"><label className="flex h-11 items-center gap-2 rounded-[14px] bg-black/[.03] px-3 text-[9px]"><input type="checkbox" checked={required} onChange={(e) => setRequired(e.target.checked)} /> Required</label><button disabled={busy === "create"} className="h-11 rounded-[14px] bg-black px-4 text-[9px] font-semibold text-white disabled:opacity-40">{busy === "create" ? "Adding..." : "Add"}</button></div>
        </form>
      </section>

      <section className="space-y-3">
        {questions.map((question, index) => (
          <article key={question.id} className="rounded-[26px] border border-white/80 bg-white/60 p-5 backdrop-blur-xl">
            <div className="grid gap-3 lg:grid-cols-[58px_1fr_.5fr_auto] lg:items-start">
              <div className="grid h-11 w-11 place-items-center rounded-[13px] bg-black text-[9px] font-semibold text-white">{index + 1}</div>
              <div className="space-y-2">
                <input defaultValue={question.prompt} onBlur={(e) => { if (e.target.value.trim() && e.target.value !== question.prompt) updateQuestion(question, { prompt: e.target.value.trim() }); }} className="h-10 w-full rounded-[13px] bg-white px-3 text-[10px] font-semibold outline-none" />
                {(question.type === "select" || question.type === "multiselect") && <textarea defaultValue={(question.options ?? []).join("\n")} onBlur={(e) => updateQuestion(question, { options: e.target.value.split("\n").map((v) => v.trim()).filter(Boolean) })} rows={3} className="w-full rounded-[13px] bg-white px-3 py-2 text-[9px] outline-none" />}
              </div>
              <div className="space-y-2">
                <select value={question.type} onChange={(e) => updateQuestion(question, { type: e.target.value as Question["type"] })} className="h-10 w-full rounded-[13px] bg-white px-3 text-[9px] outline-none">{types.map((item) => <option key={item}>{item}</option>)}</select>
                <label className="flex h-9 items-center gap-2 rounded-[13px] bg-black/[.03] px-3 text-[8px]"><input type="checkbox" checked={question.required} onChange={(e) => updateQuestion(question, { required: e.target.checked })} /> Required</label>
              </div>
              <div className="flex gap-2 lg:justify-end">
                <button type="button" disabled={busy === question.id} onClick={() => archive(question)} className="rounded-[13px] bg-red-500/10 px-3 py-2.5 text-[8px] font-semibold text-red-600">Archive</button>
              </div>
            </div>
          </article>
        ))}
        {questions.length === 0 && <div className="rounded-[24px] border border-dashed border-black/10 p-10 text-center text-[10px] text-black/30">No active application questions yet.</div>}
      </section>
    </div>
  );
}
