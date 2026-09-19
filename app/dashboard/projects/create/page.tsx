"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function CreateProjectPage() {
  const [title,setTitle]=useState("");
  const [description,setDescription]=useState("");
  const [visibility,setVisibility]=useState("private");
  const [saving,setSaving]=useState(false);
  const [message,setMessage]=useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const response=await fetch("/api/projects",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title,description,visibility})});
    const data=await response.json();
    if(response.ok){setMessage("Project created.");setTitle("");setDescription("");}
    else setMessage(data.error ?? "Could not create project.");
    setSaving(false);
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[32px] bg-black p-6 text-white md:p-8">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/25 blur-[110px]" />
        <div className="relative">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[8px] uppercase tracking-[.2em] text-white/40">Projects</span>
          <h1 className="mt-5 text-3xl font-semibold tracking-[-.06em] md:text-5xl">Create a project.</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">Create a real School OS project workspace. Ownership and membership are stored in the database.</p>
        </div>
      </section>

      <section className="rounded-[30px] border border-white/80 bg-white/60 p-6 backdrop-blur-2xl md:p-8">
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="mb-2 block text-[9px] uppercase tracking-[.16em] text-black/30">Project title</label>
            <input value={title} onChange={e=>setTitle(e.target.value)} required maxLength={120} placeholder="My first project" className="h-12 w-full rounded-[16px] border border-black/5 bg-white/80 px-4 text-xs outline-none focus:border-blue-400/50" />
          </div>
          <div>
            <label className="mb-2 block text-[9px] uppercase tracking-[.16em] text-black/30">Description</label>
            <textarea value={description} onChange={e=>setDescription(e.target.value)} maxLength={5000} rows={6} placeholder="What are you building?" className="w-full rounded-[16px] border border-black/5 bg-white/80 px-4 py-3 text-xs outline-none focus:border-blue-400/50" />
          </div>
          <div>
            <label className="mb-2 block text-[9px] uppercase tracking-[.16em] text-black/30">Visibility</label>
            <select value={visibility} onChange={e=>setVisibility(e.target.value)} className="h-12 rounded-[16px] border border-black/5 bg-white/80 px-4 text-xs outline-none">
              <option value="private">Private</option>
              <option value="school">School</option>
              <option value="public">Public</option>
            </select>
          </div>
          {message && <div className="rounded-[16px] bg-black/[.03] px-4 py-3 text-[10px] text-black/55">{message}</div>}
          <div className="flex flex-wrap gap-2">
            <button disabled={saving} className="rounded-[15px] bg-black px-5 py-3 text-[9px] font-semibold text-white disabled:opacity-50">{saving ? "Creating..." : "Create project"}</button>
            <Link href="/dashboard/projects/my-projects" className="rounded-[15px] bg-black/[.04] px-5 py-3 text-[9px] font-semibold text-black/50">View projects</Link>
          </div>
        </form>
      </section>
    </div>
  );
}
