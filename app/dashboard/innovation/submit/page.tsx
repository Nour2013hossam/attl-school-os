"use client";

import { FormEvent,useState } from "react";
import Link from "next/link";

export default function SubmitIdeaPage(){
 const [title,setTitle]=useState("");
 const [description,setDescription]=useState("");
 const [status,setStatus]=useState("");
 const [saving,setSaving]=useState(false);

 async function submit(e:FormEvent){
  e.preventDefault(); setSaving(true); setStatus("");
  const res=await fetch("/api/ideas",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title,description})});
  const data=await res.json();
  setStatus(res.ok ? "Idea submitted to the innovation workspace." : (data.error ?? "Could not submit idea."));
  if(res.ok){setTitle("");setDescription("");}
  setSaving(false);
 }

 return <div className="space-y-6">
  <section className="relative overflow-hidden rounded-[32px] bg-black p-6 text-white md:p-8">
   <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/25 blur-[110px]" />
   <div className="relative">
    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[8px] uppercase tracking-[.2em] text-white/40">Innovation</span>
    <h1 className="mt-5 text-3xl font-semibold tracking-[-.06em] md:text-5xl">Submit an idea.</h1>
    <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">Turn a problem or concept into a tracked innovation record.</p>
   </div>
  </section>
  <section className="rounded-[30px] border border-white/80 bg-white/60 p-6 backdrop-blur-2xl md:p-8">
   <form onSubmit={submit} className="space-y-5">
    <input value={title} onChange={e=>setTitle(e.target.value)} required maxLength={140} placeholder="Idea title" className="h-12 w-full rounded-[16px] border border-black/5 bg-white/80 px-4 text-xs outline-none" />
    <textarea value={description} onChange={e=>setDescription(e.target.value)} required maxLength={5000} rows={7} placeholder="Describe the problem and the idea..." className="w-full rounded-[16px] border border-black/5 bg-white/80 px-4 py-3 text-xs outline-none" />
    {status && <div className="rounded-[16px] bg-black/[.03] px-4 py-3 text-[10px] text-black/55">{status}</div>}
    <div className="flex gap-2">
      <button disabled={saving} className="rounded-[15px] bg-black px-5 py-3 text-[9px] font-semibold text-white">{saving ? "Submitting..." : "Submit idea"}</button>
      <Link href="/dashboard/innovation/ideas" className="rounded-[15px] bg-black/[.04] px-5 py-3 text-[9px] font-semibold text-black/50">Back to ideas</Link>
    </div>
   </form>
  </section>
 </div>
}
