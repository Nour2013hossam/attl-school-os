"use client";
import{useEffect,useState}from"react";
import{usePreferences}from"@/components/providers/preferences-provider";

export default function LanguagePage(){
 const {language,setLanguage}=usePreferences(); const[message,setMessage]=useState("");
 useEffect(()=>{setMessage(language==="ar"?"العربية مفعلة.":"English is active.");},[language]);
 return <div className="space-y-6">
  <section className="rounded-[34px] bg-black p-7 text-white md:p-9"><p className="text-[10px] uppercase tracking-[.2em] text-blue-400">Settings</p><h1 className="mt-2 text-3xl font-semibold tracking-[-.05em]">{language==="ar"?"اللغة":"Language"}</h1><p className="mt-3 max-w-2xl text-sm text-white/40">{language==="ar"?"اختر لغة واجهة النظام واتجاهها.":"Choose the interface language and text direction."}</p></section>
  <section className="grid gap-4 md:grid-cols-2">
   {[["en","English","Left-to-right interface"],["ar","العربية","واجهة من اليمين إلى اليسار"]].map(([code,label,desc])=><button key={code} onClick={()=>setLanguage(code as "en"|"ar")} className={"rounded-[28px] border p-6 text-left transition "+(language===code?"border-blue-400 bg-blue-500/[.06]":"border-white/80 bg-white/60")}><div className="flex items-center justify-between"><h2 className="text-lg font-semibold">{label}</h2><span className={"h-6 w-6 rounded-full border p-1 "+(language===code?"border-blue-500":"border-black/10")}><span className={"block h-full w-full rounded-full "+(language===code?"bg-blue-500":"bg-transparent")}/></span></div><p className="mt-3 text-[10px] text-black/40">{desc}</p></button>)}
  </section>
  <div className="rounded-[18px] bg-black/[.035] px-4 py-3 text-[10px] text-black/45">{message}</div>
 </div>;
}
