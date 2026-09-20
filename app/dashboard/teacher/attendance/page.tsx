"use client";

import { FormEvent, useEffect, useState } from "react";

type Subject={id:string;code:string;name:string};
type Student={user:{id:string;name:string;schoolId:string|null};subject:Subject};
type RecordRow={id:string;date:string;status:string;note:string|null;user:{id:string;name:string;schoolId:string|null};subject:Subject};

export default function AttendancePage(){
 const [subjects,setSubjects]=useState<Subject[]>([]); const [students,setStudents]=useState<Student[]>([]); const [records,setRecords]=useState<RecordRow[]>([]);
 const [form,setForm]=useState({userId:"",subjectId:"",date:new Date().toISOString().slice(0,10),status:"PRESENT",note:""}); const [message,setMessage]=useState(""); const [saving,setSaving]=useState(false);
 async function load(){const [a,s]=await Promise.all([fetch("/api/teacher/attendance",{cache:"no-store"}).then(r=>r.json()),fetch("/api/teacher/students",{cache:"no-store"}).then(r=>r.json())]);setRecords(a.records??[]);setSubjects(a.subjects??[]);setStudents(s.students??[]);if(!form.subjectId&&a.subjects?.[0])setForm(f=>({...f,subjectId:a.subjects[0].id}));}
 useEffect(()=>{load();},[]);
 async function save(e:FormEvent){e.preventDefault();setSaving(true);setMessage("");const res=await fetch("/api/teacher/attendance",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});const data=await res.json();setMessage(res.ok?"Attendance saved.":data.error??"Could not save attendance.");setSaving(false);if(res.ok)load();}
 return <div className="space-y-6">
  <section className="rounded-[32px] bg-black p-7 text-white md:p-9"><p className="text-[9px] uppercase tracking-[.2em] text-blue-300">Teacher OS</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.05em] md:text-5xl">Attendance</h1><p className="mt-3 max-w-2xl text-sm text-white/40">Record daily attendance for the classes you teach.</p></section>
  <section className="rounded-[28px] border border-white/80 bg-white/65 p-5 backdrop-blur-2xl md:p-7"><h2 className="text-xl font-semibold">Mark attendance</h2><form onSubmit={save} className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
   <select required value={form.userId} onChange={e=>setForm(f=>({...f,userId:e.target.value}))} className="h-11 rounded-[14px] border border-black/5 bg-white px-3 text-[10px] outline-none"><option value="">Student</option>{students.map(s=><option key={s.user.id} value={s.user.id}>{s.user.name}</option>)}</select>
   <select required value={form.subjectId} onChange={e=>setForm(f=>({...f,subjectId:e.target.value}))} className="h-11 rounded-[14px] border border-black/5 bg-white px-3 text-[10px] outline-none"><option value="">Subject</option>{subjects.map(s=><option key={s.id} value={s.id}>{s.code}</option>)}</select>
   <input type="date" required value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} className="h-11 rounded-[14px] border border-black/5 bg-white px-3 text-[10px] outline-none"/>
   <select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))} className="h-11 rounded-[14px] border border-black/5 bg-white px-3 text-[10px] outline-none">{["PRESENT","ABSENT","LATE","EXCUSED"].map(s=><option key={s}>{s}</option>)}</select>
   <input value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))} placeholder="Note" className="h-11 rounded-[14px] border border-black/5 bg-white px-3 text-[10px] outline-none"/>
   <div className="md:col-span-2 xl:col-span-5 flex items-center gap-3"><button disabled={saving} className="rounded-[14px] bg-black px-5 py-3 text-[9px] font-semibold text-white disabled:opacity-40">{saving?"Saving...":"Save attendance"}</button>{message&&<span className="text-[10px] text-black/40">{message}</span>}</div>
  </form></section>
  <section className="rounded-[28px] border border-white/80 bg-white/65 p-5 backdrop-blur-2xl md:p-7"><p className="text-[8px] uppercase tracking-[.18em] text-black/25">Live records</p><h2 className="mt-1 text-xl font-semibold">{records.length} attendance records</h2><div className="mt-5 space-y-2">{records.slice(0,100).map(r=><div key={r.id} className="flex flex-col gap-2 rounded-[18px] bg-black/[.025] p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[10px] font-semibold">{r.user.name} · {r.subject.code}</p><p className="mt-1 text-[9px] text-black/35">{new Date(r.date).toLocaleDateString()}</p></div><span className="rounded-full bg-white px-3 py-1.5 text-[8px] font-semibold">{r.status}</span></div>)}</div></section>
 </div>;
}
