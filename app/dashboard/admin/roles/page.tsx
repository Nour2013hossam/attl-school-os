"use client";

import {useEffect,useMemo,useState} from "react";

type Permission={key:string;name:string;category:string};
type Role={id:string;name:string;description:string|null;active:boolean;permissions:{permission:Permission}[];_count:{users:number}};
type BuiltIn={role:string;label:string;scope:string};

export default function RolesPage(){
 const{can,permissionsReady}=usePreferences();
 const[data,setData]=useState<{roles:BuiltIn[];customRoles:Role[];catalog:Permission[]}|null>(null);
 const[name,setName]=useState(""); const[description,setDescription]=useState(""); const[selected,setSelected]=useState<string[]>([]);
 const[message,setMessage]=useState(""); const[saving,setSaving]=useState(false); const[editing,setEditing]=useState<string|null>(null);
 async function load(){const r=await fetch("/api/admin/roles",{cache:"no-store"});const d=await r.json();if(r.ok)setData(d);else setMessage(d.error??"Unable to load roles.");}
 useEffect(()=>{load();},[]);
 const grouped=useMemo(()=>Object.entries((data?.catalog??[]).reduce((a,p)=>{(a[p.category]??=[]).push(p);return a;},{} as Record<string,Permission[]>)),[data]);
 function toggle(key:string){setSelected(v=>v.includes(key)?v.filter(x=>x!==key):[...v,key]);}
 async function save(){
   if(!name.trim())return;
   setSaving(true);setMessage("");
   const url=editing?"/api/admin/custom-roles/"+editing:"/api/admin/custom-roles";
   const method=editing?"PATCH":"POST";
   const r=await fetch(url,{method,headers:{"Content-Type":"application/json"},body:JSON.stringify({name,description:description||null,permissionKeys:selected})});
   const d=await r.json();setMessage(r.ok?(editing?"Custom role updated.":"Custom role created."):d.error??"Could not save role.");
   setSaving(false);if(r.ok){setName("");setDescription("");setSelected([]);setEditing(null);load();}
 }
 function edit(role:Role){setEditing(role.id);setName(role.name);setDescription(role.description??"");setSelected(role.permissions.map(p=>p.permission.key));}
 async function remove(id:string){const r=await fetch("/api/admin/custom-roles/"+id,{method:"DELETE"});const d=await r.json();setMessage(r.ok?"Custom role deleted.":d.error??"Could not delete role.");if(r.ok)load();}
 return <div className="space-y-6">
  <section className="rounded-[32px] bg-black p-7 text-white md:p-9"><p className="text-[9px] uppercase tracking-[.2em] text-blue-300">Admin OS</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.05em] md:text-5xl">Roles</h1><p className="mt-3 max-w-2xl text-sm text-white/40">Built-in roles plus custom roles with explicit permission sets.</p></section>
  {message&&<div className="rounded-[16px] bg-blue-500/10 px-4 py-3 text-[10px] text-blue-700">{message}</div>}
  <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{(data?.roles??[]).map(r=><article key={r.role} className="rounded-[26px] border border-white/80 bg-white/60 p-5 backdrop-blur-xl"><span className="rounded-full bg-blue-500/10 px-3 py-1 text-[8px] font-semibold uppercase tracking-[.12em] text-blue-600">{r.role}</span><h2 className="mt-4 text-base font-semibold">{r.label}</h2><p className="mt-2 text-[10px] leading-5 text-black/40">{r.scope}</p></article>)}</section>
  <section className="grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
   {permissionsReady&&can("roles.manage")&&<div className="rounded-[28px] border border-white/80 bg-white/60 p-6 backdrop-blur-xl">
    <div className="flex items-end justify-between"><div><p className="text-[8px] uppercase tracking-[.18em] text-black/25">Custom roles</p><h2 className="mt-1 text-xl font-semibold">{editing?"Edit custom role":"Create custom role"}</h2></div>{editing&&<button onClick={()=>{setEditing(null);setName("");setDescription("");setSelected([]);}} className="text-[9px] text-black/35">Cancel</button>}</div>
    <input value={name} onChange={e=>setName(e.target.value)} placeholder="Role name" className="mt-5 h-11 w-full rounded-[14px] border border-black/5 bg-white/80 px-3 text-[10px] outline-none"/>
    <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" rows={3} className="mt-2 w-full rounded-[14px] border border-black/5 bg-white/80 px-3 py-2 text-[10px] outline-none"/>
    <button disabled={saving||!name.trim()} onClick={save} className="mt-3 w-full rounded-[14px] bg-black py-3 text-[9px] font-semibold text-white disabled:opacity-40">{saving?"Saving...":editing?"Update role":"Create role"}</button>
    <div className="mt-6 space-y-3">{(data?.customRoles??[]).map(r=><div key={r.id} className="rounded-[18px] border border-black/5 bg-white/60 p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-semibold">{r.name}</p><p className="mt-1 text-[8px] text-black/30">{r._count.users} assigned · {r.permissions.length} permissions</p></div><span className={r.active?"text-[8px] text-green-600":"text-[8px] text-black/30"}>{r.active?"Active":"Inactive"}</span></div><div className="mt-3 flex gap-2"><button onClick={()=>edit(r)} className="rounded-[12px] bg-black/[.04] px-3 py-2 text-[8px]">Edit</button><button onClick={()=>remove(r.id)} disabled={r._count.users>0} className="rounded-[12px] bg-red-500/10 px-3 py-2 text-[8px] text-red-600 disabled:opacity-30">Delete</button></div></div>)}</div>
   </div>}
   <div className="rounded-[28px] border border-white/80 bg-white/60 p-6 backdrop-blur-xl"><p className="text-[8px] uppercase tracking-[.18em] text-black/25">Permission set</p><p className="mt-1 text-[10px] text-black/35">{selected.length} permissions selected</p><div className="mt-5 space-y-4">{grouped.map(([category,items])=><div key={category}><p className="text-[8px] font-semibold uppercase tracking-[.16em] text-black/30">{category}</p><div className="mt-2 grid gap-2 md:grid-cols-2">{items.map(p=><button type="button" key={p.key} onClick={()=>toggle(p.key)} className={"flex items-center justify-between rounded-[15px] border p-3 text-left "+(selected.includes(p.key)?"border-blue-500/20 bg-blue-500/[.06]":"border-black/5 bg-white/40")}><span><span className="block text-[9px] font-semibold">{p.name}</span><span className="mt-1 block text-[7px] text-black/30">{p.key}</span></span><span className={"h-5 w-9 rounded-full p-1 "+(selected.includes(p.key)?"bg-black":"bg-black/10")}><span className={"block h-3 w-3 rounded-full bg-white "+(selected.includes(p.key)?"translate-x-3":"")}/></span></button>{!can("roles.manage")&&<span className="pointer-events-none hidden" />}</div></div>)}</div></div>
  </section>
 </div>;
}
