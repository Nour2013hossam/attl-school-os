"use client";

import {FormEvent,useEffect,useState} from "react";
import { usePreferences } from "@/components/providers/preferences-provider";

type Release={id:string;term:string;releaseAt:string;locked:boolean};
export default function ResultsReleasePage(){
 const { can, permissionsReady } = usePreferences();
 const [items,setItems]=useState<Release[]>([]);
 const [term,setTerm]=useState("2026-2027");
 const [releaseAt,setReleaseAt]=useState("");
 const [locked,setLocked]=useState(true);
 const [message,setMessage]=useState(""); const[saving,setSaving]=useState(false);
 async function load(){const r=await fetch("/api/admin/results/release",{cache:"no-store"});const d=await r.json();setItems(d.releases??[]);}
 useEffect(()=>{load();},[]);
 async function save(e:FormEvent){e.preventDefault();setSaving(true);setMessage("");const r=await fetch("/api/admin/results/release",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({term,releaseAt:new Date(releaseAt).toISOString(),locked})});const d=await r.json();setMessage(r.ok?"Release schedule saved.":d.error??"Could not save schedule.");setSaving(false);if(r.ok)load();}
 return <div className="space-y-6"><section className="rounded-[32px] bg-black p-7 text-white md:p-9"><p className="text-[9px] uppercase tracking-[.2em] text-blue-300">Admin OS · Results</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.05em] md:text-5xl">Result release control</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">Schedule result releases and keep the student results locked until the configured time.</p></section>
 {permissionsReady&&can("results.release")&&<section className="rounded-[28px] border border-white/80 bg-white/60 p-6 backdrop-blur-xl md:p-8"><h2 className="text-xl font-semibold">Create or update schedule</h2><form onSubmit={save} className="mt-5 grid gap-4 md:grid-cols-3"><input required value={term} onChange={e=>setTerm(e.target.value)} placeholder="Term" className="h-11 rounded-[14px] border border-black/5 bg-white px-3 text-[10px] outline-none"/><input required type="datetime-local" value={releaseAt} onChange={e=>setReleaseAt(e.target.value)} className="h-11 rounded-[14px] border border-black/5 bg-white px-3 text-[10px] outline-none"/><label className="flex h-11 items-center gap-2 rounded-[14px] bg-black/[.03] px-3 text-[10px] text-black/50"><input type="checkbox" checked={locked} onChange={e=>setLocked(e.target.checked)}/> Keep results locked</label><div className="md:col-span-3 flex items-center gap-3"><button disabled={saving||!releaseAt} className="rounded-[14px] bg-black px-5 py-3 text-[9px] font-semibold text-white disabled:opacity-40">{saving?"Saving...":"Save release schedule"}</button>{message&&<span className="text-[10px] text-black/40">{message}</span>}</div></form></section>}
 <section className="space-y-3">{items.map(r=><article key={r.id} className="rounded-[25px] border border-white/80 bg-white/60 p-5 backdrop-blur-xl"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[10px] uppercase tracking-[.12em] text-blue-600">{r.term}</p><h2 className="mt-1 text-base font-semibold">{new Date(r.releaseAt).toLocaleString()}</h2></div><span className="rounded-full bg-black/[.05] px-3 py-1.5 text-[8px] text-black/40">{r.locked?"Locked until release":"Unlocked"}</span></div></article>)}{items.length===0&&<div className="rounded-[24px] border border-dashed border-black/10 p-10 text-center text-[10px] text-black/30">No result release schedules yet.</div>}</section></div>
}