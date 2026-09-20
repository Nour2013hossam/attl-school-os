"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { usePreferences } from "@/components/providers/preferences-provider";

type Event = {
  id: string;
  title: string;
  description: string | null;
  startsAt: string;
  endsAt: string;
  location: string | null;
  capacity: number | null;
};

export default function AdminEventEditPage() {
  const params = useParams<{ id: string }>();
  const { can, permissionsReady } = usePreferences();
  const [event, setEvent] = useState<Event | null>(null);
  const [form, setForm] = useState({ title: "", description: "", startsAt: "", endsAt: "", location: "", capacity: "" });
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    fetch("/api/events/" + params.id, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data?.event) return;
        const value = data.event as Event;
        setEvent(value);
        setForm({
          title: value.title,
          description: value.description ?? "",
          startsAt: value.startsAt.slice(0, 16),
          endsAt: value.endsAt.slice(0, 16),
          location: value.location ?? "",
          capacity: value.capacity ? String(value.capacity) : "",
        });
      });
  }, [params.id]);

  async function save() {
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/events/" + params.id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        description: form.description || null,
        startsAt: form.startsAt,
        endsAt: form.endsAt,
        location: form.location || null,
        capacity: form.capacity ? Number(form.capacity) : null,
      }),
    });
    const data = await response.json();
    setMessage(response.ok ? "Event updated." : (data.error ?? "Could not update event."));
    if (response.ok && data.event) setEvent(data.event);
    setSaving(false);
  }

  if (!permissionsReady) return <div className="rounded-[26px] bg-white/60 p-8 text-sm text-black/40">Loading access…</div>;
  if (!can("events.manage")) return <div className="rounded-[26px] bg-white/60 p-8 text-sm text-black/40">You do not have permission to manage events.</div>;

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] bg-black p-7 text-white md:p-9">
        <p className="text-[9px] uppercase tracking-[.2em] text-blue-300">Admin OS · Events</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-.05em] md:text-5xl">Edit event.</h1>
        <p className="mt-3 text-sm text-white/40">{event?.title ?? "Loading event..."}</p>
      </section>

      <section className="rounded-[30px] border border-white/80 bg-white/60 p-6 backdrop-blur-2xl md:p-8">
        <div className="grid gap-4 md:grid-cols-2">
          <input value={form.title} onChange={(e) => setForm((x) => ({ ...x, title: e.target.value }))} placeholder="Event title" className="h-11 rounded-[14px] bg-white/80 px-3 text-[10px] outline-none" />
          <input value={form.location} onChange={(e) => setForm((x) => ({ ...x, location: e.target.value }))} placeholder="Location" className="h-11 rounded-[14px] bg-white/80 px-3 text-[10px] outline-none" />
          <textarea value={form.description} onChange={(e) => setForm((x) => ({ ...x, description: e.target.value }))} rows={4} placeholder="Description" className="rounded-[14px] bg-white/80 px-3 py-3 text-[10px] outline-none md:col-span-2" />
          <input type="datetime-local" value={form.startsAt} onChange={(e) => setForm((x) => ({ ...x, startsAt: e.target.value }))} className="h-11 rounded-[14px] bg-white/80 px-3 text-[10px] outline-none" />
          <input type="datetime-local" value={form.endsAt} onChange={(e) => setForm((x) => ({ ...x, endsAt: e.target.value }))} className="h-11 rounded-[14px] bg-white/80 px-3 text-[10px] outline-none" />
          <input type="number" min="1" value={form.capacity} onChange={(e) => setForm((x) => ({ ...x, capacity: e.target.value }))} placeholder="Capacity" className="h-11 rounded-[14px] bg-white/80 px-3 text-[10px] outline-none" />
        </div>
        {message && <div className="mt-4 rounded-[14px] bg-blue-500/10 px-4 py-3 text-[9px] text-blue-700">{message}</div>}
        <div className="mt-5 flex flex-wrap gap-2">
          <button onClick={save} disabled={saving} className="rounded-[14px] bg-black px-5 py-3 text-[9px] font-semibold text-white disabled:opacity-40">{saving ? "Saving..." : "Save changes"}</button>
          <Link href="/dashboard/admin/events" className="rounded-[14px] bg-black/[.04] px-5 py-3 text-[9px] font-semibold text-black/50">Back to events</Link>
        </div>
      </section>
    </div>
  );
}
