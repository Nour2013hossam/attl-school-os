"use client";

import { useEffect, useMemo, useState } from "react";
import { usePreferences } from "@/components/providers/preferences-provider";

type User = {
  id:string; name:string; email:string; role:string; isActive:boolean; gradeLevel:string|null; className:string|null; schoolId:string|null; xp:number; level:number; customRole?:{id:string;name:string}|null;
};

const roles=["STUDENT","ATTL_MEMBER","TRACK_LEAD","TEACHER","ADMIN","SUPER_ADMIN"];

export default function AdminUsersPage(){
 const { can, permissionsReady } = usePreferences();
 const [users,setUsers]=useState<User[]>([]);
 const [customRoles,setCustomRoles]=useState<{id:string;name:string;active?:boolean}[]>([]);
 const [query,setQuery]=useState("");
 const [busy,setBusy]=useState("");
 const [message,setMessage]=useState("");
 const [myRole,setMyRole]=useState("STUDENT");

 async function load(){const res=await fetch("/api/admin/users",{cache:"no-store"});const data=await res.json();if(res.ok)setUsers(data.users??[]);else setMessage(data.error??"Unable to load users.");}
 useEffect(()=>{load(); fetch("/api/me/permissions",{cache:"no-store"}).then(r=>r.json()).then(d=>setMyRole(d.role??"STUDENT")); fetch("/api/admin/roles",{cache:"no-store"}).then(r=>r.json()).then(d=>setCustomRoles((d.customRoles??[]).filter((r:{active?:boolean})=>r.active!==false)));},[]);

 const filtered=useMemo(()=>users.filter(u=>[u.name,u.email,u.role,u.schoolId??""].join(" ").toLowerCase().includes(query.toLowerCase())),[users,query]);

 async function update(id:string, patch:Partial<User>){
  setBusy(id);setMessage("");
  const res=await fetch(`/api/admin/users/${id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(patch)});
  const data=await res.json();setMessage(res.ok?"User updated.":(data.error??"Could not update user."));
  if(res.ok) await load(); setBusy("");
 }

 return <div className="space-y-6">
  <section className="relative overflow-hidden rounded-[32px] bg-black p-7 text-white md:p-8"><div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/25 blur-[110px]"/><div className="relative"><p className="text-[9px] uppercase tracking-[.2em] text-white/35">Administration</p><h1 className="mt-2 text-3xl font-semibold tracking-[-.05em] md:text-5xl">Users</h1><p className="mt-3 max-w-xl text-sm text-white/40">Manage accounts, roles and active status from the protected Admin OS.</p></div></section>

  <section className="rounded-[30px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl">
   <div className="flex flex-col gap-3 md:flex-row"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search name, email or role..." className="h-11 flex-1 rounded-[14px] border border-black/5 bg-white/75 px-4 text-xs outline-none"/><span className="rounded-[14px] bg-black px-4 py-3 text-center text-[9px] font-semibold text-white">{filtered.length} users</span></div>
   {message&&<div className="mt-3 rounded-[14px] bg-black/[.03] px-4 py-3 text-[10px] text-black/50">{message}</div>}
   <div className="mt-5 space-y-2">
    {filtered.map(user=><article key={user.id} className="rounded-[20px] border border-black/[.04] bg-white/60 p-4">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_.7fr_.5fr_.7fr] lg:items-center">
       <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">{user.name.trim().charAt(0).toUpperCase()}</div><div><p className="text-xs font-semibold">{user.name}</p><p className="mt-1 text-[9px] text-black/30">{user.email}</p></div></div>
       <div className="space-y-2">
        {permissionsReady && can("roles.assign") && <select value={user.role} disabled={busy===user.id} onChange={e=>update(user.id,{role:e.target.value})} className="h-10 w-full rounded-[13px] border border-black/5 bg-white px-3 text-[9px] outline-none">{roles.map(role=><option key={role}>{role}</option>)}</select>}
        {permissionsReady && can("roles.assign") && <select value={user.customRole?.id??""} disabled={busy===user.id} onChange={async e=>{setBusy(user.id);setMessage("");const res=await fetch("/api/admin/users/"+user.id+"/custom-role",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({customRoleId:e.target.value||null})});const d=await res.json();setMessage(res.ok?"Custom role updated.":(d.error??"Could not update custom role."));if(res.ok)await load();setBusy("");}} className="h-10 w-full rounded-[13px] border border-blue-500/10 bg-blue-500/[.04] px-3 text-[9px] outline-none"><option value="">No custom role</option>{customRoles.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}</select>}
       </div>
       <span className={user.isActive?"rounded-full bg-green-500/10 px-3 py-2 text-center text-[8px] font-semibold text-green-600":"rounded-full bg-black/[.04] px-3 py-2 text-center text-[8px] text-black/35"}>{user.isActive?"Active":"Disabled"}</span>
       <div className="flex gap-2">
        {permissionsReady && can("permissions.manage") && <a href={"/dashboard/admin/users/"+user.id+"/permissions"} className="rounded-[13px] bg-blue-500/10 px-3 py-2.5 text-[9px] font-semibold text-blue-600">Access</a>}
        {permissionsReady && can("users.manage") && <button disabled={busy===user.id} onClick={()=>update(user.id,{isActive:!user.isActive})} className="rounded-[13px] bg-black/[.04] px-3 py-2.5 text-[9px] font-semibold text-black/50 transition hover:bg-black hover:text-white disabled:opacity-40">{busy===user.id?"Saving...":user.isActive?"Disable":"Activate"}</button>}
       </div>
      </div>
    </article>)}
   </div>
  </section>
 </div>
}
