"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Track = { id: string; name: string; description: string | null };
type Question = { id: string; prompt: string; type: string; required: boolean; options?: string[] | null };
type Application = {
  id: string; status: string; reviewerNotes: string | null;
  user: { id: string; name: string; email: string };
  track: { name: string };
};

const statuses = ["NEW","UNDER_REVIEW","SHORTLISTED","INTERVIEW","ACCEPTED","REJECTED"];

export default function AttlApplicationsPage() {
  const [role,setRole] = useState("STUDENT");
  const [tracks,setTracks] = useState<Track[]>([]);
  const [questions,setQuestions] = useState<Question[]>([]);
  const [applications,setApplications] = useState<Application[]>([]);
  const [trackId,setTrackId] = useState("");
  const [answers,setAnswers] = useState<Record<string,string>>({});
  const [status,setStatus] = useState("");
  const [saving,setSaving] = useState(false);

  async function load() {
    const [me, tracksData, questionsData, applicationsData] = await Promise.all([
      fetch("/api/me",{cache:"no-store"}).then(r=>r.ok?r.json():null),
      fetch("/api/attl/tracks",{cache:"no-store"}).then(r=>r.json()),
      fetch("/api/attl/questions",{cache:"no-store"}).then(r=>r.json()),
      fetch("/api/attl/applications",{cache:"no-store"}).then(r=>r.json()),
    ]);
    setRole(me?.user?.role ?? "STUDENT");
    setTracks(tracksData.tracks ?? []);
    setQuestions(questionsData.questions ?? []);
    setApplications(applicationsData.applications ?? []);
  }

  useEffect(()=>{load();},[]);

  const reviewer = useMemo(
    () => ["ATTL_MEMBER","TRACK_LEAD","ADMIN","SUPER_ADMIN"].includes(role),
    [role]
  );

  async function submit(e:FormEvent) {
    e.preventDefault();
    setSaving(true); setStatus("");
    const res = await fetch("/api/attl/applications",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({trackId,answers}),
    });
    const data=await res.json();
    setStatus(res.ok?"Application submitted.":(data.error ?? "Could not submit application."));
    setSaving(false);
    if(res.ok) load();
  }

  async function review(id:string,nextStatus:string) {
    const res=await fetch(`/api/admin/attl/applications/${id}`,{
      method:"PATCH",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({status:nextStatus}),
    });
    if(res.ok) load();
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[32px] bg-black p-6 text-white md:p-8">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/25 blur-[110px]" />
        <div className="relative">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[8px] uppercase tracking-[.2em] text-white/40">
            ATTL Recruitment
          </span>
          <h1 className="mt-5 text-3xl font-semibold tracking-[-.06em] md:text-5xl">
            {reviewer ? "Application review." : "Join ATTL."}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
            {reviewer
              ? "Review incoming applications, move them through the workflow and keep reviewer actions audited."
              : "Choose a track and answer the current application questions."}
          </p>
        </div>
      </section>

      {!reviewer ? (
        <section className="rounded-[30px] border border-white/80 bg-white/60 p-6 backdrop-blur-2xl md:p-8">
          <form onSubmit={submit} className="space-y-6">
            <div>
              <label className="mb-2 block text-[9px] uppercase tracking-[.16em] text-black/30">Track</label>
              <select value={trackId} onChange={e=>setTrackId(e.target.value)} required className="h-12 w-full rounded-[16px] border border-black/5 bg-white/80 px-4 text-xs outline-none">
                <option value="">Select a track</option>
                {tracks.map(track=><option key={track.id} value={track.id}>{track.name}</option>)}
              </select>
            </div>

            {questions.map(question=>(
              <div key={question.id}>
                <label className="mb-2 block text-[9px] uppercase tracking-[.16em] text-black/30">
                  {question.prompt}{question.required ? " *" : ""}
                </label>
                {question.type === "textarea" ? (
                  <textarea
                    required={question.required}
                    rows={5}
                    value={answers[question.id] ?? ""}
                    onChange={e=>setAnswers(a=>({...a,[question.id]:e.target.value}))}
                    className="w-full rounded-[16px] border border-black/5 bg-white/80 px-4 py-3 text-xs outline-none"
                  />
                ) : question.type === "select" ? (
                  <select
                    required={question.required}
                    value={answers[question.id] ?? ""}
                    onChange={e=>setAnswers(a=>({...a,[question.id]:e.target.value}))}
                    className="h-12 w-full rounded-[16px] border border-black/5 bg-white/80 px-4 text-xs outline-none"
                  >
                    <option value="">Choose</option>
                    {(question.options ?? []).map(option=><option key={option}>{option}</option>)}
                  </select>
                ) : (
                  <input
                    required={question.required}
                    value={answers[question.id] ?? ""}
                    onChange={e=>setAnswers(a=>({...a,[question.id]:e.target.value}))}
                    className="h-12 w-full rounded-[16px] border border-black/5 bg-white/80 px-4 text-xs outline-none"
                  />
                )}
              </div>
            ))}

            {status && <div className="rounded-[16px] bg-black/[.03] px-4 py-3 text-[10px] text-black/55">{status}</div>}
            <button disabled={saving} className="rounded-[15px] bg-black px-5 py-3 text-[9px] font-semibold text-white disabled:opacity-50">
              {saving ? "Submitting..." : "Submit application"}
            </button>
          </form>
        </section>
      ) : (
        <section className="rounded-[30px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl md:p-7">
          <div className="space-y-3">
            {applications.map(app=>(
              <article key={app.id} className="rounded-[22px] border border-black/[.04] bg-white/70 p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold">{app.user.name}</p>
                    <p className="mt-1 text-[9px] text-black/30">{app.user.email} · {app.track.name}</p>
                  </div>
                  <select value={app.status} onChange={e=>review(app.id,e.target.value)} className="h-10 rounded-[13px] border border-black/5 bg-white px-3 text-[9px] outline-none">
                    {statuses.map(item=><option key={item}>{item}</option>)}
                  </select>
                </div>
                {app.reviewerNotes && <p className="mt-3 rounded-[15px] bg-black/[.03] p-3 text-[9px] text-black/40">{app.reviewerNotes}</p>}
              </article>
            ))}
            {applications.length===0 && <div className="rounded-[20px] bg-black/[.025] p-8 text-center text-[10px] text-black/30">No applications yet.</div>}
          </div>
        </section>
      )}
    </div>
  );
}
