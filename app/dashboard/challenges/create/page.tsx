"use client";

import { FormEvent,useState } from "react";
import { usePreferences } from "@/components/providers/preferences-provider";
import Link from "next/link";

export default function CreateChallengePage(){
 const { can, permissionsReady } = usePreferences();
 const [title,setTitle]=useState(""); const [description,setDescription]=useState(""); const [xpReward,setXpReward]=useState("100"); const [message,setMessage]=useState(""); const [saving,setSaving]=useState(false);
 async function submit(e:FormEvent){e.preventDefault();setSaving(true);const res=await fetch("/api/challenges",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title,description,xpReward:Number(xpReward)})});const data=await res.json();setMessage(res.ok?"Challenge saved as draft.":(data.error??"Could not create challenge."));setSaving(false);}
 return <div className="space-y-6">
  <section className="rounded-[32px] bg-black p-6 text-white md:p-8">
   <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[8px] uppercase tracking-[.2em] text-white/40">Challenges</span>
   <h1 className="mt-5 text-3xl font-semibold tracking-[-.06em] md:text-5xl">Create a challenge.</h1>
   <p className="mt-3 max-w-xl text-sm text-white/40">Create a challenge record and configure its reward before publishing.</p>
  </section>
  {permissionsReady && can("challenges.manage") && <section className="rounded-[30px] border border-white/80 bg-white/60 p-6 backdrop-blur-2xl md:p-8">
   <form onSubmit={submit} className="space-y-5">
    <input value={title} onChange={e=>setTitle(e.target.value)} required maxLength={140} placeholder="Challenge title" className="h-12 w-full rounded-[16px] border border-black/5 bg-white/80 px-4 text-xs outline-none" />
    <textarea value={description} onChange={e=>setDescription(e.target.value)} maxLength={5000} rows={6} placeholder="Challenge description" className="w-full rounded-[16px] border border-black/5 bg-white/80 px-4 py-3 text-xs outline-none" />
    <input type="number" min={0} max={100000} value={xpReward} onChange={e=>setXpReward(e.target.value)} placeholder="XP reward" className="h-12 rounded-[16px] border border-black/5 bg-white/80 px-4 text-xs outline-none" />
    {message && <div className="rounded-[16px] bg-black/[.03] px-4 py-3 text-[10px] text-black/55">{message}</div>}
    <div className="flex gap-2">
     <button disabled={saving} className="rounded-[15px] bg-black px-5 py-3 text-[9px] font-semibold text-white">{saving?"Saving...":"Create challenge"}</button>
     <Link href="/dashboard/challenges/explore" className="rounded-[15px] bg-black/[.04] px-5 py-3 text-[9px] font-semibold text-black/50">Back</Link>
    </div>
   </form>
  </section>}
 </div>
}
