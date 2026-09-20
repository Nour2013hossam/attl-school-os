"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePreferences } from "@/components/providers/preferences-provider";

type Lesson={id:string;title:string;content:string|null;duration:number|null;position:number};
type Course={id:string;title:string;description:string|null;level:string|null;subject:{code:string;name:string;description:string|null}|null;lessons:Lesson[];resources:Array<{id:string;title:string;description:string|null;type:string;url:string|null}>};
type Enrollment={progress:number;status:string};
type Asset={id:string;fileName:string;mimeType:string;sizeBytes:number;createdAt:string;owner:{id:string;name:string}};

export default function CourseDetailPage({params}:{params:Promise<{id:string}>}){
 const {can,permissionsReady}=usePreferences();
 const[id,setId]=useState("");const[c,setC]=useState<Course|null>(null);const[e,setE]=useState<Enrollment|null>(null);
 const[completed,setCompleted]=useState<Record<string,boolean>>({});const[bookmarked,setBookmarked]=useState<Record<string,boolean>>({});const[files,setFiles]=useState<Asset[]>([]);
 const[busy,setBusy]=useState("");const[msg,setMsg]=useState("");

 useEffect(()=>{params.then(p=>setId(p.id));},[params]);

 async function load(){
  if(!id)return;
  const r=await fetch("/api/courses/"+id,{cache:"no-store"});const d=await r.json();if(r.ok)setC(d.course??null);
  const my=await fetch("/api/courses/"+id+"/enroll",{cache:"no-store"});if(my.ok){const ed=await my.json();setE(ed.enrollment??null);}
  const marks=await fetch("/api/learning/bookmarks",{cache:"no-store"});if(marks.ok){const md=await marks.json();const bm:Record<string,boolean>={};for(const b of md.bookmarks??[]){if(b.lesson?.id)bm[b.lesson.id]=true;}setBookmarked(bm);}
  const pr=await fetch("/api/learning/lessons/progress?courseId="+id,{cache:"no-store"});if(pr.ok){const pd=await pr.json();const map:Record<string,boolean>={};for(const x of pd.progress??[]){map[x.lessonId]=x.completed;}setCompleted(map);setE(pd.enrollment??null);}
  const fr=await fetch("/api/uploads?entityType=course&entityId="+encodeURIComponent(id),{cache:"no-store"});if(fr.ok){const fd=await fr.json();setFiles(fd.files??[]);}
 }
 useEffect(()=>{load();},[id]);

 async function enroll(){
  setBusy("enroll");const r=await fetch("/api/courses/"+id+"/enroll",{method:"POST"});const d=await r.json();
  setMsg(r.ok?"Enrolled successfully.":d.error??"Could not enroll.");setBusy("");if(r.ok)setE(d.enrollment);
 }

 async function toggleBookmark(lessonId:string){
  const r=await fetch("/api/learning/bookmarks",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({lessonId})});const d=await r.json();
  setMsg(r.ok?(d.bookmarked?"Lesson bookmarked.":"Bookmark removed."):d.error??"Could not update bookmark.");
  if(r.ok)setBookmarked(v=>({...v,[lessonId]:Boolean(d.bookmarked)}));
 }

 async function toggleLesson(lessonId:string){
  if(!e){setMsg("Enroll in the course first.");return;}
  setBusy(lessonId);const next=!completed[lessonId];
  const r=await fetch("/api/learning/lessons/"+lessonId+"/progress",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({completed:next})});const d=await r.json();
  setBusy("");if(r.ok){setCompleted(v=>({...v,[lessonId]:next}));setE(d.enrollment);setMsg(next?(d.rewardGranted?"Lesson completed.":"Lesson completed."):"Lesson marked incomplete.");}else setMsg(d.error??"Could not update progress.");
 }

 if(!c)return <div className="rounded-[28px] border border-white/80 bg-white/60 p-10 text-center text-sm text-black/40">Loading course...</div>;

 return <div className="space-y-6">
  <section className="relative overflow-hidden rounded-[34px] bg-black p-7 text-white md:p-9">
   <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/20 blur-[100px]"/>
   <Link href="/dashboard/learning/explore" className="relative text-[9px] uppercase tracking-[.18em] text-white/35">← Learning</Link>
   <div className="relative mt-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
    <div><span className="inline-flex rounded-full bg-white/10 px-3 py-1.5 text-[8px] uppercase tracking-[.12em] text-white/40">{c.level??"Course"}</span><h1 className="mt-4 text-3xl font-semibold tracking-[-.05em] md:text-5xl">{c.title}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">{c.description??"No description provided."}</p></div>
    {e ? (
      <div className="min-w-[210px] rounded-[21px] border border-white/10 bg-white/[.06] p-4">
       <div className="flex justify-between text-[9px] text-white/40"><span>Progress</span><span>{e.progress}%</span></div>
       <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-white" style={{width:e.progress+"%"}}/></div>
       <p className="mt-2 text-[8px] text-white/25">{e.status}</p>
      </div>
    ) : permissionsReady && can("learning.enroll") ? (
      <button onClick={enroll} disabled={busy==="enroll"} className="rounded-[16px] bg-white px-5 py-3 text-[9px] font-semibold text-black disabled:opacity-40">{busy==="enroll"?"Enrolling...":"Enroll in course"}</button>
    ) : null}
   </div>
  </section>

  {msg&&<div className="rounded-[16px] bg-blue-500/10 px-4 py-3 text-[9px] text-blue-700">{msg}</div>}

  <section className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
   <div className="rounded-[28px] border border-white/80 bg-white/60 p-6 backdrop-blur-xl">
    <p className="text-[8px] uppercase tracking-[.18em] text-black/25">Course content</p>
    <h2 className="mt-1 text-xl font-semibold">{c.lessons.length} lessons</h2>
    <div className="mt-5 space-y-2">
     {c.lessons.map((l,i)=><article key={l.id} className={"rounded-[19px] border p-4 transition "+(completed[l.id]?"border-green-500/15 bg-green-500/[.035]":"border-black/5 bg-white/40")}>
      <div className="flex items-center gap-3">
       {e ? <button onClick={()=>toggleLesson(l.id)} disabled={busy===l.id} className={"flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold "+(completed[l.id]?"bg-green-600 text-white":"bg-black text-white")}>{completed[l.id]?"✓":i+1}</button> : <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/10 text-[9px] font-semibold">{i+1}</span>}
       <div className="min-w-0 flex-1"><p className="text-[10px] font-semibold">{l.title}</p><p className="mt-1 text-[8px] text-black/30">{l.duration?l.duration+" min":"Self-paced"}</p></div>
       <div className="flex items-center gap-2"><span className="text-[8px] text-black/25">{completed[l.id]?"Completed":"Not started"}</span>{permissionsReady&&can("learning.read")&&<button onClick={()=>toggleBookmark(l.id)} className="rounded-[10px] bg-black/[.04] px-2 py-1 text-[8px]">{bookmarked[l.id]?"★":"☆"}</button>}</div>
      </div>
      {l.content&&<p className="mt-3 whitespace-pre-line text-[10px] leading-5 text-black/40">{l.content}</p>}
     </article>)}
    </div>
   </div>

   <div className="space-y-4">
    <div className="rounded-[28px] border border-white/80 bg-white/60 p-6 backdrop-blur-xl"><p className="text-[8px] uppercase tracking-[.18em] text-black/25">Subject</p><h2 className="mt-2 text-lg font-semibold">{c.subject?.code??"—"}</h2><p className="mt-1 text-[10px] text-black/35">{c.subject?.name??"Independent course"}</p></div>
    <div className="rounded-[28px] border border-white/80 bg-white/60 p-6 backdrop-blur-xl"><div className="flex items-end justify-between"><p className="text-[8px] uppercase tracking-[.18em] text-black/25">Resources</p><span className="text-[8px] text-black/25">{c.resources.length}</span></div><div className="mt-4 space-y-2">{c.resources.map(r=><a key={r.id} href={r.url??"#"} target="_blank" rel="noreferrer" className="block rounded-[15px] bg-black/[.025] p-3 transition hover:bg-white"><p className="text-[9px] font-semibold">{r.title}</p><p className="mt-1 text-[8px] text-black/30">{r.type}</p></a>)}{c.resources.length===0&&<p className="text-[10px] text-black/30">No resources attached yet.</p>}</div></div>
   </div>
    <div className="rounded-[28px] border border-white/80 bg-white/60 p-6 backdrop-blur-xl">
      <div className="flex items-end justify-between"><p className="text-[8px] uppercase tracking-[.18em] text-black/25">Files</p><span className="text-[8px] text-black/25">{files.length}</span></div>
      <div className="mt-4 space-y-2">
        {files.map(file=><a key={file.id} href={"/api/uploads/"+file.id} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-[15px] bg-black/[.025] p-3 transition hover:bg-white"><div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-black text-[7px] font-semibold text-white">FILE</div><div className="min-w-0 flex-1"><p className="truncate text-[9px] font-semibold">{file.fileName}</p><p className="mt-1 text-[8px] text-black/30">{(file.sizeBytes/1024/1024).toFixed(1)} MB</p></div><span className="text-[8px] text-blue-600">Open</span></a>)}
        {files.length===0&&<p className="text-[10px] text-black/30">No downloadable files attached.</p>}
      </div>
    </div>
  </section>
 </div>;
}