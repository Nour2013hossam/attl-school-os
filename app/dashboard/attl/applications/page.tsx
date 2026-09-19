"use client";

import { FormEvent,useEffect,useState } from "react";
import Link from "next/link";

type Track={id:string;name:string;description:string|null};
type Question={id:string;prompt:string;type:string;required:boolean;options?:string[]};

export default function AttlApplicationsPage(){
 const [tracks,setTracks]=useState<Track[]>([]); const [questions,setQuestions]=useState<Question[]>([]);
 const [trackId,setTrackId]=useState(""); const [answers,setAnswers]=useState<Record<string,string| string[]>>({});
 const [status,setStatus]=useState(""); const [saving,setSaving]=useState(false);

 useEffect(()=>{Promise.all([fetch("/api/attl/tracks").then(r=>r.json()),fetch("/api/attl/questions").then(r=>r.json())]).then(([t,q])=>{setTracks(t.tracks??[]);setQuestions(q.questions??[]);});},[]);

 function setAnswer(id:string,value:string|string[]){setAnswers(a=>({...a,[id]:value}));}

 async function submit(e:FormEvent){e.preventDefault();setSaving(true);setStatus("");const res=await fetch("/api/attl/applications",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({trackId,answers})});const data=await res.json();setStatus(res.ok?"Application submitted.":(data.error??"Could not submit application."));setSaving(false);}

 return <div className="space-y-6">
  <section className="relative overflow-hidden rounded-[32px] bg-black p-6 text-white md:p-8"><div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/25 blur-[110px]" /><div className="relative"><span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[8px] uppercase tracking-[.2em] text-white/40">ATTL Recruitment</span><h1 className="mt-5 text-3xl font-semibold tracking-[-.06em] md:text-5xl">Join ATTL.</h1><p className="mt-3 max-w-xl text-sm leading-6 text-white/40">Choose a track and answer the current application questions. Questions are configurable by ATTL reviewers.</p></div></section>
  <section className="rounded-[30px] border border-white/80 bg-white/60 p-6 backdrop-blur-2xl md:p-8">
   <form onSubmit={submit} className="space-y-6">
    <div><label className="mb-2 block text-[9px] uppercase tracking-[.16em] text-black/30">Track</label><select value={trackId} onChange={e=>setTrackId(e.target.value)} required className="h-12 w-full rounded-[16px] border border-black/5 bg-white/80 px-4 text-xs outline-none"><option value="">Select a track</option>{tracks.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></div>
    {questions.map(q=><div key={q.id}><label className="mb-2 block text-[9px] uppercase tracking-[.16em] text-black/30">{q.prompt}{q.required?" *":""}</label>{q.type==="textarea"?<textarea required={q.required} rows={5} value={String(answers[q.id]??"")} onChange={e=>setAnswer(q.id,e.target.value)} className="w-full rounded-[16px] border border-black/5 bg-white/80 px-4 py-3 text-xs outline-none" />:<input required={q.required} value={String(answers[q.id]??"")} onChange={e=>setAnswer(q.id,e.target.value)} className="h-12 w-full rounded-[16px] border border-black/5 bg-white/80 px-4 text-xs outline-none" />}</div>)}
    {status&&<div className="rounded-[16px] bg-black/[.03] px-4 py-3 text-[10px] text-black/55">{status}</div>}
    <div className="flex gap-2"><button disabled={saving} className="rounded-[15px] bg-black px-5 py-3 text-[9px] font-semibold text-white">{saving?"Submitting...":"Submit application"}</button><Link href="/dashboard/attl/overview" className="rounded-[15px] bg-black/[.04] px-5 py-3 text-[9px] font-semibold text-black/50">ATTL overview</Link></div>
   </form>
  </section>
 </div>
}
