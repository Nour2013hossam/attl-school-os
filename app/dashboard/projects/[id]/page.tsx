"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Project = {
  id: string; title: string; description: string | null; status: string; visibility: string; progress: number;
  owner: { id: string; name: string; avatarUrl: string | null };
  members: Array<{ id: string; role: string; user: { id: string; name: string; email: string; avatarUrl: string | null } }>;
  tasks: Array<{ id: string; title: string; description: string | null; status: string; dueAt: string | null; assignee: { id: string; name: string; avatarUrl: string | null } | null }>;
};
type User = { id:string; name:string; email:string };

export default function ProjectDetailPage({ params }: { params: Promise<{ id:string }> }) {
  const [id,setId]=useState(""); const [project,setProject]=useState<Project|null>(null); const [users,setUsers]=useState<User[]>([]);
  const [title,setTitle]=useState(""); const [description,setDescription]=useState(""); const [assigneeId,setAssigneeId]=useState(""); const [dueAt,setDueAt]=useState("");
  const [message,setMessage]=useState(""); const [saving,setSaving]=useState(false);

  useEffect(()=>{ params.then(p=>setId(p.id)); },[params]);

  async function load(){
    if(!id)return;
    const [p,u]=await Promise.all([
      fetch("/api/projects/"+id,{cache:"no-store"}).then(r=>r.json()),
      fetch("/api/projects/"+id+"/members",{cache:"no-store"}).then(r=>r.json()).catch(()=>({users:[]})),
    ]);
    setProject(p.project??null);
    setUsers(u.users??[]);
  }
  useEffect(()=>{if(id)load();},[id]);

  const memberIds=useMemo(()=>new Set((project?.members??[]).map(m=>m.user.id)),[project]);

  async function createTask(e:FormEvent){
    e.preventDefault();setSaving(true);setMessage("");
    const res=await fetch("/api/projects/"+id+"/tasks",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
      title,description,assigneeId:assigneeId||null,status:"Todo",dueAt:dueAt?new Date(dueAt).toISOString():null
    })});
    const data=await res.json();setMessage(res.ok?"Task created.":data.error??"Could not create task.");setSaving(false);
    if(res.ok){setTitle("");setDescription("");setAssigneeId("");setDueAt("");load();}
  }

  async function updateTask(taskId:string,status:string){
    const res=await fetch("/api/projects/"+id+"/tasks/"+taskId,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({status})});
    if(res.ok)load();
  }

  if(!project)return <div className="rounded-[28px] border border-white/80 bg-white/60 p-8 text-center text-sm text-black/40">Loading project...</div>;

  const manageableUsers=users.filter(u=>memberIds.has(u.id)||u.id===project.owner.id);
  const columns=["Todo","In Progress","Done"];

  return <div className="space-y-6">
    <section className="relative overflow-hidden rounded-[34px] bg-black p-7 text-white md:p-9">
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-500/25 blur-[100px]"/>
      <div className="relative">
        <Link href="/dashboard/projects/all" className="text-[9px] uppercase tracking-[.18em] text-white/35">← Projects</Link>
        <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div><span className="rounded-full bg-white/10 px-3 py-1.5 text-[8px] uppercase tracking-[.12em] text-white/45">{project.status}</span><h1 className="mt-3 text-3xl font-semibold tracking-[-.05em] md:text-5xl">{project.title}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">{project.description??"No project description."}</p></div>
          <div className="rounded-[20px] bg-white/5 p-4"><p className="text-[8px] uppercase tracking-[.15em] text-white/30">Progress</p><p className="mt-1 text-2xl font-semibold">{project.progress}%</p></div>
        </div>
      </div>
    </section>

    {message&&<div className="rounded-[16px] bg-blue-500/10 px-4 py-3 text-[10px] text-blue-700">{message}</div>}

    <section className="grid gap-4 lg:grid-cols-[1.25fr_.75fr]">
      <div className="rounded-[28px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl md:p-7">
        <div className="flex items-end justify-between"><div><p className="text-[8px] uppercase tracking-[.18em] text-black/25">Project board</p><h2 className="mt-1 text-xl font-semibold">{project.tasks.length} tasks</h2></div></div>
        <div className="mt-6 grid gap-3 xl:grid-cols-3">
          {columns.map(column=><div key={column} className="rounded-[22px] bg-black/[.025] p-3"><div className="flex items-center justify-between px-2 py-1"><p className="text-[9px] font-semibold uppercase tracking-[.14em]">{column}</p><span className="text-[8px] text-black/25">{project.tasks.filter(t=>(column==="Done"?t.status==="Done":column==="In Progress"?t.status==="In Progress":!["Done","In Progress"].includes(t.status))).length}</span></div><div className="mt-2 space-y-2">{project.tasks.filter(t=>(column==="Done"?t.status==="Done":column==="In Progress"?t.status==="In Progress":!["Done","In Progress"].includes(t.status))).map(t=><article key={t.id} className="rounded-[16px] bg-white/80 p-3"><p className="text-[10px] font-semibold">{t.title}</p><p className="mt-1 line-clamp-2 text-[8px] leading-4 text-black/35">{t.description??""}</p><p className="mt-2 text-[8px] text-black/25">{t.assignee?.name??"Unassigned"}{t.dueAt?" · due "+new Date(t.dueAt).toLocaleDateString():""}</p><select value={t.status} onChange={e=>updateTask(t.id,e.target.value)} className="mt-3 h-8 w-full rounded-[10px] border border-black/5 bg-white px-2 text-[8px] outline-none"><option>Todo</option><option>In Progress</option><option>Done</option></select></article>)}</div></div>)}
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-[28px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl md:p-7"><p className="text-[8px] uppercase tracking-[.18em] text-black/25">New task</p><h2 className="mt-1 text-xl font-semibold">Add work</h2><form onSubmit={createTask} className="mt-5 space-y-3"><input required value={title} onChange={e=>setTitle(e.target.value)} placeholder="Task title" className="h-11 w-full rounded-[14px] border border-black/5 bg-white px-3 text-[10px] outline-none"/><textarea value={description} onChange={e=>setDescription(e.target.value)} rows={4} placeholder="Description" className="w-full rounded-[14px] border border-black/5 bg-white px-3 py-3 text-[10px] outline-none"/><select value={assigneeId} onChange={e=>setAssigneeId(e.target.value)} className="h-11 w-full rounded-[14px] border border-black/5 bg-white px-3 text-[10px] outline-none"><option value="">Unassigned</option>{manageableUsers.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}</select><input type="datetime-local" value={dueAt} onChange={e=>setDueAt(e.target.value)} className="h-11 w-full rounded-[14px] border border-black/5 bg-white px-3 text-[10px] outline-none"/><button disabled={saving} className="w-full rounded-[14px] bg-black px-4 py-3 text-[9px] font-semibold text-white disabled:opacity-40">{saving?"Creating...":"Create task"}</button></form></div>
        <div className="rounded-[28px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl md:p-7"><p className="text-[8px] uppercase tracking-[.18em] text-black/25">Team</p><h2 className="mt-1 text-xl font-semibold">{project.members.length} members</h2><div className="mt-4 space-y-2">{project.members.map(m=><div key={m.id} className="flex items-center gap-3 rounded-[15px] bg-black/[.025] p-3"><div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-black text-[9px] text-white">{m.user.avatarUrl?<img src={m.user.avatarUrl} alt="" className="h-full w-full object-cover"/>:m.user.name.slice(0,1)}</div><div><p className="text-[9px] font-semibold">{m.user.name}</p><p className="text-[8px] text-black/30">{m.role}</p></div></div>)}</div></div>
      </div>
    </section>
  </div>;
}
