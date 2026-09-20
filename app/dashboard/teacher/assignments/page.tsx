"use client";

import { FormEvent, useEffect, useState } from "react";

type Subject={id:string;code:string;name:string};
type Assignment={id:string;title:string;description:string|null;dueAt:string;maxScore:number;subject:Subject;submissions:Array<{status:string;score:number|null;submittedAt:string|null}>};

export default function TeacherAssignmentsPage(){
 const [subjects,setSubjects]=useState<Subject[]>([]); const [items,setItems]=useState<Assignment[]>([]);
 const [form,setForm]=useState({subjectId:"",title:"",description:"",dueAt:"",maxScore:"100"}); const [message,setMessage]=useState(""); const [saving,setSaving]=useState(false);
 async function load(){const data=await fetch("/api/teacher/assignments",{cache:"no-store"}).then(r=>r.json());setItems(data.assignments??[]);setSubjects(data.subjects??[]);if(!form.subjectId&&data.subjects?.[0])setForm(f=>({...f,subjectId:data.subjects[0].id}));}
 useEffect(()=>{load();},[]);
 async function create(e:FormEvent){e.preventDefault();setSaving(true);setMessage("");const res=await fetch("/api/teacher/assignments",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,maxScore:Number(form.maxScore),dueAt:new Date(form.dueAt).toISOString()})});const data=await res.json();setMessage(res.ok?"Assignment created.":data.error??"Could not create assignment.");setSaving(false);if(res.ok){setForm(f=>({...f,title:"",description:"",dueAt:"",maxScore:"100"}));load();}}
 return <div className="space-y-6">
  <section className="rounded-[32px] bg-black p-7 text-white md:p-9"><p className="text-[9px] uppercase tracking-[.2em] text-blue-300">Teacher OS</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.05em] md:text-5xl">Assignments</h1><p className="mt-3 max-w-2xl text-sm text-white/40">Create assignments and monitor submission signals across your subjects.</p></section>
  <section className="rounded-[28px] border border-white/80 bg-white/65 p-5 backdrop-blur-2xl md:p-7"><h2 className="text-xl font-semibold">Create assignment</h2><form onSubmit={create} className="mt-5 grid gap-4 md:grid-cols-2">
   <select required value={form.subjectId} onChange={e=>setForm(f=>({...f,subjectId:e.target.value}))} className="h-11 rounded-[14px] border border-black/5 bg-white px-3 text-[10px] outline-none"><option value="">Subject</option>{subjects.map(s=><option key={s.id} value={s.id}>{s.code} · {s.name}</option>)}</select>
   <input required value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Assignment title" className="h-11 rounded-[14px] border border-black/5 bg-white px-3 text-[10px] outline-none"/>
   <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Description" rows={4} className="rounded-[14px] border border-black/5 bg-white px-3 py-3 text-[10px] outline-none"/>
   <div className="space-y-3"><input required type="datetime-local" value={form.dueAt} onChange={e=>setForm(f=>({...f,dueAt:e.target.value}))} className="h-11 w-full rounded-[14px] border border-black/5 bg-white px-3 text-[10px] outline-none"/><input required type="number" min="1" value={form.maxScore} onChange={e=>setForm(f=>({...f,maxScore:e.target.value}))} placeholder="Max score" className="h-11 w-full rounded-[14px] border border-black/5 bg-white px-3 text-[10px] outline-none"/></div>
   <div className="md:col-span-2 flex items-center gap-3"><button disabled={saving} className="rounded-[14px] bg-black px-5 py-3 text-[9px] font-semibold text-white disabled:opacity-40">{saving?"Creating...":"Create assignment"}</button>{message&&<span className="text-[10px] text-black/40">{message}</span>}</div>
  </form></section>
  <section className="rounded-[28px] border border-white/80 bg-white/65 p-5 backdrop-blur-2xl md:p-7"><p className="text-[8px] uppercase tracking-[.18em] text-black/25">Teacher assignments</p><h2 className="mt-1 text-xl font-semibold">{items.length} assignments</h2><div className="mt-5 space-y-2">{items.map(a=><div key={a.id} className="rounded-[18px] bg-black/[.025] p-4"><div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[10px] font-semibold">{a.title}</p><p className="mt-1 text-[9px] text-black/35">{a.subject.code} · due {new Date(a.dueAt).toLocaleString()}</p></div><span className="rounded-full bg-white px-3 py-1.5 text-[8px] text-black/45">{a.submissions.length} submissions</span></div></div>)}</div></section>
 </div>;
}
