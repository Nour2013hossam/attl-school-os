"use client";

import { useEffect, useMemo, useState } from "react";
import { usePreferences } from "@/components/providers/preferences-provider";

type Permission = { key: string; name: string; category: string };
type Role = {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  permissions: { permission: Permission }[];
  _count: { users: number };
};
type BuiltIn = { role: string; label: string; scope: string };

export default function RolesPage() {
  const { can, permissionsReady } = usePreferences();
  const canRead = permissionsReady && (can("roles.read") || can("permissions.read"));
  const canManage = permissionsReady && can("roles.manage");

  const [data, setData] = useState<{ roles: BuiltIn[]; customRoles: Role[]; catalog: Permission[] } | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  async function load() {
    const response = await fetch("/api/admin/roles", { cache: "no-store" });
    const payload = await response.json();
    if (response.ok) setData(payload);
    else setMessage(payload.error ?? "Unable to load roles.");
  }

  useEffect(() => {
    if (canRead) load();
  }, [canRead]);

  const grouped = useMemo(
    () =>
      Object.entries(
        (data?.catalog ?? []).reduce((acc, item) => {
          (acc[item.category] ??= []).push(item);
          return acc;
        }, {} as Record<string, Permission[]>)
      ),
    [data]
  );

  function toggle(key: string) {
    if (!canManage) return;
    setSelected((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]);
  }

  function edit(role: Role) {
    if (!canManage) return;
    setEditing(role.id);
    setName(role.name);
    setDescription(role.description ?? "");
    setSelected(role.permissions.map((item) => item.permission.key));
  }

  async function save() {
    if (!canManage || !name.trim()) return;
    setSaving(true);
    setMessage("");
    const response = await fetch(editing ? "/api/admin/custom-roles/" + editing : "/api/admin/custom-roles", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description: description || null, permissionKeys: selected }),
    });
    const payload = await response.json();
    setMessage(response.ok ? (editing ? "Custom role updated." : "Custom role created.") : (payload.error ?? "Could not save role."));
    if (response.ok) {
      setName("");
      setDescription("");
      setSelected([]);
      setEditing(null);
      await load();
    }
    setSaving(false);
  }

  async function remove(id: string) {
    if (!canManage) return;
    const response = await fetch("/api/admin/custom-roles/" + id, { method: "DELETE" });
    const payload = await response.json();
    setMessage(response.ok ? "Custom role deleted." : (payload.error ?? "Could not delete role."));
    if (response.ok) await load();
  }

  if (!permissionsReady) return <div className="rounded-[28px] bg-black p-8 text-[10px] text-white/40">Loading roles…</div>;
  if (!canRead) return <div className="rounded-[28px] border border-dashed border-black/10 p-10 text-center text-[10px] text-black/35">Roles are not available for this account.</div>;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[32px] bg-black p-7 text-white md:p-9">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/25 blur-[110px]" />
        <div className="relative">
          <p className="text-[9px] uppercase tracking-[.22em] text-blue-300">Admin OS</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-.05em] md:text-5xl">Roles</h1>
          <p className="mt-3 max-w-2xl text-sm text-white/40">Built-in roles and custom permission sets for School OS.</p>
        </div>
      </section>

      {message && <div className="rounded-[16px] bg-blue-500/10 px-4 py-3 text-[10px] text-blue-700">{message}</div>}

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {(data?.roles ?? []).map((role) => (
          <article key={role.role} className="rounded-[26px] border border-white/80 bg-white/60 p-5 backdrop-blur-xl">
            <span className="rounded-full bg-blue-500/10 px-3 py-1 text-[8px] font-semibold text-blue-600">{role.role}</span>
            <h2 className="mt-4 text-base font-semibold">{role.label}</h2>
            <p className="mt-2 text-[10px] leading-5 text-black/40">{role.scope}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
        {canManage && (
          <div className="rounded-[28px] border border-white/80 bg-white/60 p-6 backdrop-blur-xl">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[8px] uppercase tracking-[.18em] text-black/25">Custom roles</p>
                <h2 className="mt-1 text-xl font-semibold">{editing ? "Edit custom role" : "Create custom role"}</h2>
              </div>
              {editing && <button type="button" onClick={() => { setEditing(null); setName(""); setDescription(""); setSelected([]); }} className="text-[9px] text-black/35">Cancel</button>}
            </div>
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Role name" className="mt-5 h-11 w-full rounded-[14px] border border-black/5 bg-white/80 px-3 text-[10px] outline-none" />
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description" rows={3} className="mt-2 w-full rounded-[14px] border border-black/5 bg-white/80 px-3 py-2 text-[10px] outline-none" />
            <button type="button" disabled={saving || !name.trim()} onClick={save} className="mt-3 w-full rounded-[14px] bg-black py-3 text-[9px] font-semibold text-white disabled:opacity-40">{saving ? "Saving..." : editing ? "Update role" : "Create role"}</button>
            <div className="mt-6 space-y-3">
              {(data?.customRoles ?? []).map((role) => (
                <div key={role.id} className="rounded-[18px] border border-black/5 bg-white/60 p-4">
                  <div className="flex items-start justify-between gap-3"><div><p className="text-[10px] font-semibold">{role.name}</p><p className="mt-1 text-[8px] text-black/30">{role._count.users} assigned · {role.permissions.length} permissions</p></div><span className={role.active ? "text-[8px] text-green-600" : "text-[8px] text-black/30"}>{role.active ? "Active" : "Inactive"}</span></div>
                  <div className="mt-3 flex gap-2">
                    <button type="button" onClick={() => edit(role)} className="rounded-[12px] bg-black/[.04] px-3 py-2 text-[8px]">Edit</button>
                    <button type="button" onClick={() => remove(role.id)} disabled={role._count.users > 0} className="rounded-[12px] bg-red-500/10 px-3 py-2 text-[8px] text-red-600 disabled:opacity-30">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-[28px] border border-white/80 bg-white/60 p-6 backdrop-blur-xl">
          <p className="text-[8px] uppercase tracking-[.18em] text-black/25">Permission catalog</p>
          <p className="mt-1 text-[10px] text-black/35">{canManage ? selected.length + " permissions selected" : "Built-in permission definitions"}</p>
          <div className="mt-5 space-y-4">
            {grouped.map(([category, items]) => (
              <div key={category}>
                <p className="text-[8px] font-semibold uppercase tracking-[.16em] text-black/30">{category}</p>
                <div className="mt-2 grid gap-2 md:grid-cols-2">
                  {items.map((permission) => {
                    const active = selected.includes(permission.key);
                    if (!canManage) {
                      return <div key={permission.key} className="rounded-[15px] border border-black/5 bg-white/40 p-3"><p className="text-[9px] font-semibold">{permission.name}</p><p className="mt-1 text-[7px] text-black/30">{permission.key}</p></div>;
                    }
                    return (
                      <button type="button" key={permission.key} onClick={() => toggle(permission.key)} className={"flex items-center justify-between rounded-[15px] border p-3 text-left " + (active ? "border-blue-500/20 bg-blue-500/[.06]" : "border-black/5 bg-white/40")}>
                        <span><span className="block text-[9px] font-semibold">{permission.name}</span><span className="mt-1 block text-[7px] text-black/30">{permission.key}</span></span>
                        <span className={"h-5 w-9 rounded-full p-1 " + (active ? "bg-black" : "bg-black/10")}><span className={"block h-3 w-3 rounded-full bg-white " + (active ? "translate-x-3" : "")} /></span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
