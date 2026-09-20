"use client";
import Link from "next/link";
import {useEffect,useMemo,useState} from "react";

type Permission={key:string;name:string;category:string};
type Payload={user:{id:string;name:string;email:string;role:string};catalog:Permission[];effective:Record<string,boolean>;overrides:Array<{key:string;granted:boolean}>};

export default function UserPermissionsPage({params}:{params:Promise<{id:string}>}){
 const[id,setId]=useState(""); const[data,setData]=useState<Payload|null>(null); const[values,setValues]=useState<Record<string,boolean>>({}); const[saving,setSaving]=useState(false); const[message,setMessage]=useState("");
 useEffect(()=>{params.then(p=>setId(p.id));},[params]);
 async function load(){if(!id)return;const r=await fetch("/api/admin/users/"+id+"/permissions",{cache:"no-store"});const d=await r.json();if(r.ok){setData(d);setValues(d.effective??{});}else setMessage(d.error??"Could not load permissions.");}
 useEffect(()=>{load();},[id]);
 const groups=useMemo(()=>Object.entries((data?.catalog??[]).reduce((acc,p)=>{(acc[p.category]??=[]).push(p);return acc;},{} as Record<string,Permission[]>)),[data]);
 function toggle(key:string){setValues(v=>({...v,[key]:!v[key]}));}
 async function save(){if(!data)return;setSaving(true);setMessage("");const updates=data.catalog.map(p=>({key:p.key,granted:Boolean(values[p.key])}));const r=await fetch("/api/admin/users/"+data.user.id+"/permissions",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({updates})});const d=await r.json();setMessage(r.ok?"Access policy saved.":d.error??"Could not save access policy.");setSaving(false);if(r.ok)load();}
 return <div className="space-y-6"><section className="rounded-[34px] bg-black p-7 text-white md:p-9"><Link href="/dashboard/admin/users" className="text-[9px] uppercase tracking-[.18em] text-white/35">← Users</Link><p className="mt-5 text-[9px] uppercase tracking-[.2em] text-blue-300">Access Control</p><h1 className="mt-2 text-3xl font-semibold md:text-5xl">{data?.user.name??"User permissions"}</h1><p className="mt-3 text-sm text-white/40">{data?.user.email??""} · {data?.user.role??""}</p></section>
 {message&&<div className="rounded-[16px] bg-blue-500/10 px-4 py-3 text-[10px] text-blue-700">{message}</div>}
 <section className="space-y-4">{groups.map(([category,items])=><div key={category} className="rounded-[28px] border border-white/80 bg-white/60 p-5 backdrop-blur-xl md:p-7"><div className="flex items-end justify-between"><div><p className="text-[8px] uppercase tracking-[.18em] text-black/25">{category}</p><h2 className="mt-1 text-xl font-semibold">Permissions</h2></div><span className="text-[9px] text-black/30">{items.filter(p=>values[p.key]).length}/{items.length} enabled</span></div><div className="mt-5 grid gap-2 md:grid-cols-2">{items.map(p=><button type="button" key={p.key} onClick={()=>toggle(p.key)} className={"flex items-center justify-between rounded-[17px] border p-4 text-left transition "+(values[p.key]?"border-blue-500/20 bg-blue-500/[.07]":"border-black/5 bg-white/50")}><div><p className="text-[10px] font-semibold">{p.name}</p><p className="mt-1 text-[8px] text-black/30">{p.key}</p></div><span className={"h-6 w-10 rounded-full p-1 "+(values[p.key]?"bg-black":"bg-black/10")}><span className={"block h-4 w-4 rounded-full bg-white transition "+(values[p.key]?"translate-x-4":"")}/></span></button>)}</div></div>)}</section>
 <div className="sticky bottom-4 flex justify-end"><button onClick={save} disabled={saving||!data} className="rounded-[16px] bg-black px-6 py-3 text-[9px] font-semibold text-white shadow-2xl disabled:opacity-40">{saving?"Saving...":"Save access policy"}</button></div>
 </div>;
}
