"use client";

import { FormEvent,useState } from "react";
import Link from "next/link";
import { usePreferences } from "@/components/providers/preferences-provider";

export default function AdminGradesPage(){
 const { can, permissionsReady } = usePreferences();
 const [file,setFile]=useState<File|null>(null); const [result,setResult]=useState<any>(null); const [busy,setBusy]=useState(false);

 async function upload(mode:"preview"|"commit",e?:FormEvent){
  e?.preventDefault();
  if(!file)return;
  setBusy(true);
  const form=new FormData(); form.append("file",file);
  const res=await fetch(`/api/admin/grades/import?mode=${mode}`,{method:"POST",body:form});
  const data=await res.json(); setResult(data); setBusy(false);
 }

 return <div className="space-y-6">
  <section className="relative overflow-hidden rounded-[32px] bg-black p-7 text-white md:p-8"><div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/25 blur-[110px]"/><div className="relative"><p className="text-[9px] uppercase tracking-[.2em] text-white/30">Admin · Academic Records</p><h1 className="mt-2 text-3xl font-semibold tracking-[-.05em] md:text-5xl">Grade pipeline</h1><p className="mt-3 max-w-2xl text-sm text-white/40">Upload an Excel workbook, validate it server-side, preview errors, then commit the approved rows.</p></div></section>

  {permissionsReady && can("academics.grades.write") && <section className="rounded-[30px] border border-white/80 bg-white/60 p-6 backdrop-blur-2xl">
   <form onSubmit={e=>upload("preview",e)} className="space-y-5">
    <input type="file" accept=".xlsx,.xls" onChange={e=>setFile(e.target.files?.[0]??null)} className="block w-full rounded-[16px] border border-black/5 bg-white/80 p-3 text-[10px]"/>
    <div className="flex flex-wrap gap-2"><button disabled={!file||busy} className="rounded-[15px] bg-black px-5 py-3 text-[9px] font-semibold text-white disabled:opacity-40">{busy?"Processing...":"Preview & validate"}</button><button type="button" disabled={!file||busy} onClick={()=>upload("commit")} className="rounded-[15px] bg-blue-600 px-5 py-3 text-[9px] font-semibold text-white disabled:opacity-40">Commit valid rows</button><Link href="/dashboard/admin/audit-logs" className="rounded-[15px] bg-black/[.04] px-5 py-3 text-[9px] font-semibold text-black/50">Audit logs</Link></div>
   </form>
  </section>}

  {result&&<section className="rounded-[30px] border border-white/80 bg-white/60 p-6 backdrop-blur-2xl">
   <h2 className="text-xl font-semibold">Import result</h2>
   <pre className="mt-5 max-h-[420px] overflow-auto rounded-[18px] bg-black p-4 text-[9px] leading-5 text-white/70">{JSON.stringify(result,null,2)}</pre>
  </section>}
 </div>
}
