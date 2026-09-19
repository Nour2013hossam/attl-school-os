"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

export default function SettingsAccountPage(){
 const [name,setName]=useState(""); const [bio,setBio]=useState(""); const [gradeLevel,setGradeLevel]=useState(""); const [className,setClassName]=useState(""); const [avatarUrl,setAvatarUrl]=useState(""); const [interests,setInterests]=useState(""); const [portfolioUrl,setPortfolioUrl]=useState(""); const [message,setMessage]=useState(""); const [saving,setSaving]=useState(false);

 useEffect(()=>{fetch("/api/profile",{cache:"no-store"}).then(r=>r.json()).then(data=>{const u=data.user;if(!u)return;setName(u.name??"");setBio(u.bio??"");setGradeLevel(u.gradeLevel??"");setClassName(u.className??"");setAvatarUrl(u.avatarUrl??"");setInterests((u.studentProfile?.interests??[]).join(", "));setPortfolioUrl(u.studentProfile?.portfolioUrl??"");});},[]);

 async function save(e:FormEvent){e.preventDefault();setSaving(true);setMessage("");const res=await fetch("/api/profile",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,bio,gradeLevel,className,avatarUrl,interests:interests.split(",").map(v=>v.trim()).filter(Boolean),portfolioUrl})});const data=await res.json();setMessage(res.ok?"Account updated.":(data.error??"Could not update account."));setSaving(false);}

 return <div className="space-y-6">
  <section className="rounded-[32px] bg-black p-7 text-white md:p-8"><p className="text-[9px] uppercase tracking-[.2em] text-white/30">Settings</p><h1 className="mt-2 text-3xl font-semibold tracking-[-.05em] md:text-5xl">Account</h1><p className="mt-3 max-w-xl text-sm text-white/40">Update the information used across your School OS profile.</p></section>
  <section className="rounded-[30px] border border-white/80 bg-white/60 p-6 backdrop-blur-2xl md:p-8"><form onSubmit={save} className="grid gap-5 md:grid-cols-2">
    <div><label className="mb-2 block text-[9px] uppercase tracking-[.16em] text-black/30">Full name</label><input value={name} onChange={e=>setName(e.target.value)} required maxLength={120} className="h-12 w-full rounded-[16px] border border-black/5 bg-white/80 px-4 text-xs outline-none"/></div>
    <div><label className="mb-2 block text-[9px] uppercase tracking-[.16em] text-black/30">Grade</label><input value={gradeLevel} onChange={e=>setGradeLevel(e.target.value)} maxLength={80} className="h-12 w-full rounded-[16px] border border-black/5 bg-white/80 px-4 text-xs outline-none"/></div>
    <div><label className="mb-2 block text-[9px] uppercase tracking-[.16em] text-black/30">Class</label><input value={className} onChange={e=>setClassName(e.target.value)} maxLength={80} className="h-12 w-full rounded-[16px] border border-black/5 bg-white/80 px-4 text-xs outline-none"/></div>
    <div><label className="mb-2 block text-[9px] uppercase tracking-[.16em] text-black/30">Avatar URL</label><input value={avatarUrl} onChange={e=>setAvatarUrl(e.target.value)} placeholder="https://..." className="h-12 w-full rounded-[16px] border border-black/5 bg-white/80 px-4 text-xs outline-none"/></div>
    <div className="md:col-span-2"><label className="mb-2 block text-[9px] uppercase tracking-[.16em] text-black/30">Bio</label><textarea value={bio} onChange={e=>setBio(e.target.value)} rows={5} maxLength={2000} className="w-full rounded-[16px] border border-black/5 bg-white/80 px-4 py-3 text-xs outline-none"/></div>
    <div><label className="mb-2 block text-[9px] uppercase tracking-[.16em] text-black/30">Interests</label><input value={interests} onChange={e=>setInterests(e.target.value)} placeholder="AI, robotics, web..." className="h-12 w-full rounded-[16px] border border-black/5 bg-white/80 px-4 text-xs outline-none"/></div>
    <div><label className="mb-2 block text-[9px] uppercase tracking-[.16em] text-black/30">Portfolio URL</label><input value={portfolioUrl} onChange={e=>setPortfolioUrl(e.target.value)} placeholder="https://..." className="h-12 w-full rounded-[16px] border border-black/5 bg-white/80 px-4 text-xs outline-none"/></div>
    {message&&<div className="md:col-span-2 rounded-[16px] bg-black/[.03] px-4 py-3 text-[10px] text-black/50">{message}</div>}
    <div className="md:col-span-2 flex gap-2"><button disabled={saving} className="rounded-[15px] bg-black px-5 py-3 text-[9px] font-semibold text-white disabled:opacity-50">{saving?"Saving...":"Save changes"}</button><Link href="/dashboard/student/profile" className="rounded-[15px] bg-black/[.04] px-5 py-3 text-[9px] font-semibold text-black/50">View profile</Link></div>
  </form></section>
 </div>
}
