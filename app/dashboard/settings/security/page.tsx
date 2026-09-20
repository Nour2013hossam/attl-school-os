"use client";

import { FormEvent, useState } from "react";

export default function SecurityPage() {
  const [currentPassword,setCurrentPassword]=useState("");
  const [newPassword,setNewPassword]=useState("");
  const [confirm,setConfirm]=useState("");
  const [message,setMessage]=useState("");
  const [saving,setSaving]=useState(false);

  async function changePassword(e:FormEvent){
    e.preventDefault();
    setMessage("");
    if(newPassword!==confirm){setMessage("New passwords do not match.");return;}
    setSaving(true);
    const r=await fetch("/api/account/password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({currentPassword,newPassword})});
    const d=await r.json();
    setMessage(r.ok?"Password changed successfully.":d.error??"Could not change password.");
    setSaving(false);
    if(r.ok){setCurrentPassword("");setNewPassword("");setConfirm("");}
  }

  return <div className="space-y-6">
    <section className="rounded-[34px] border border-white/80 bg-white/65 p-7 backdrop-blur-[30px]">
      <p className="text-[10px] uppercase tracking-[.2em] text-blue-500">Security</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-[-.05em]">Protect your account.</h1>
      <p className="mt-3 text-sm text-black/40">Manage your password and review the security features currently available in School OS.</p>
    </section>

    <section className="rounded-[28px] border border-white/80 bg-white/60 p-6 backdrop-blur-xl md:p-8">
      <div><p className="text-[8px] uppercase tracking-[.18em] text-black/25">Credentials</p><h2 className="mt-1 text-xl font-semibold">Change password</h2><p className="mt-2 text-[10px] leading-5 text-black/35">Use a strong password with at least 8 characters.</p></div>
      <form onSubmit={changePassword} className="mt-6 grid gap-4 max-w-2xl">
        <input required type="password" value={currentPassword} onChange={e=>setCurrentPassword(e.target.value)} placeholder="Current password" className="h-12 rounded-[16px] border border-black/5 bg-white px-4 text-xs outline-none"/>
        <input required minLength={8} type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} placeholder="New password" className="h-12 rounded-[16px] border border-black/5 bg-white px-4 text-xs outline-none"/>
        <input required minLength={8} type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Confirm new password" className="h-12 rounded-[16px] border border-black/5 bg-white px-4 text-xs outline-none"/>
        {message&&<div className="rounded-[15px] bg-black/[.03] px-4 py-3 text-[10px] text-black/50">{message}</div>}
        <button disabled={saving} className="w-fit rounded-[14px] bg-black px-5 py-3 text-[9px] font-semibold text-white disabled:opacity-40">{saving?"Changing...":"Change password"}</button>
      </form>
    </section>

    <section className="grid gap-4 md:grid-cols-3">
      {[
        ["Two-factor authentication","Not available yet","The current build does not expose an MFA setup flow."],
        ["Session management","JWT session","Sessions are protected by Auth.js and expire after the configured lifetime."],
        ["Audit trail","Enabled","Security-sensitive admin actions are recorded in Audit Logs."],
      ].map(([title,status,body])=><article key={title} className="rounded-[26px] border border-white/80 bg-white/60 p-6 backdrop-blur-xl"><div className="flex items-start justify-between"><h2 className="text-sm font-semibold">{title}</h2><span className="text-[8px] text-black/30">{status}</span></div><p className="mt-3 text-[10px] leading-5 text-black/35">{body}</p></article>)}
    </section>
  </div>;
}
