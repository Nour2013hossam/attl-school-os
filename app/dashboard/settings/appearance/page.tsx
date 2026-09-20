"use client";
import{useEffect,useState}from"react";
import{usePreferences}from"@/components/providers/preferences-provider";

export default function AppearancePage(){
 const {theme,setTheme,language}=usePreferences(); const[compact,setCompact]=useState(false); const[motion,setMotion]=useState(true);
 useEffect(()=>{setCompact(localStorage.getItem("attl-compact")==="1");setMotion(localStorage.getItem("attl-motion")!=="0");},[]);
 useEffect(()=>{document.documentElement.classList.toggle("compact-ui",compact);localStorage.setItem("attl-compact",compact?"1":"0");},[compact]);
 useEffect(()=>{document.documentElement.classList.toggle("reduced-motion",!motion);localStorage.setItem("attl-motion",motion?"1":"0");},[motion]);
 const themes:[string,string,string][]=[["system","System","Follow your device preference"],["light","Light","Bright Liquid Glass"],["dark","Dark","Midnight Liquid Glass"]];
 return <div className="space-y-6">
  <section className="rounded-[34px] bg-black p-7 text-white shadow-[0_30px_90px_rgba(0,0,0,.18)]"><p className="text-[10px] uppercase tracking-[.2em] text-blue-400">Appearance</p><h1 className="mt-2 text-3xl font-semibold tracking-[-.05em]">{language==="ar"?"المظهر":"Your interface."}</h1><p className="mt-3 text-sm text-white/40">{language==="ar"?"تحكم في السمة والحركة وكثافة الواجهة.":"Customize theme, motion and navigation density."}</p></section>
  <section className="grid gap-4 md:grid-cols-3">{themes.map(([id,label,desc])=><button key={id} onClick={()=>setTheme(id as "system"|"light"|"dark")} className={"rounded-[26px] border p-5 text-left transition "+(theme===id?"border-blue-400 bg-white":"border-white/80 bg-white/60 hover:bg-white")}><div className={"h-24 rounded-[18px] "+(id==="dark"?"bg-gradient-to-br from-black via-slate-900 to-blue-950":"bg-gradient-to-br from-white via-blue-50 to-black/5")}/><p className="mt-4 text-sm font-semibold">{language==="ar"?(id==="system"?"النظام":id==="light"?"فاتح":"داكن"):label}</p><p className="mt-1 text-[9px] text-black/35">{desc}</p></button>)}</section>
  <section className="rounded-[28px] border border-white/80 bg-white/60 p-6 backdrop-blur-xl">{[["Compact navigation",compact,setCompact],["Motion effects",motion,setMotion]].map(([label,value,setter])=><div key={String(label)} className="flex items-center justify-between border-b border-black/5 py-5 last:border-0"><div><p className="text-sm font-medium">{String(label)}</p><p className="mt-1 text-[9px] text-black/30">Persisted on this device.</p></div><button type="button" onClick={()=> (setter as (v:boolean)=>void)(!(value as boolean))} className={"h-7 w-12 rounded-full p-1 "+((value as boolean)?"bg-black":"bg-black/10")}><span className={"block h-5 w-5 rounded-full bg-white transition "+((value as boolean)?"translate-x-5":"")}/></button></div>)}</section>
 </div>;
}
