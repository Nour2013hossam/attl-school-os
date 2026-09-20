"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { usePreferences } from "@/components/providers/preferences-provider";

type User = { id: string; name: string; email: string; role: string; avatarUrl: string | null; gradeLevel: string | null; className: string | null };
type Thread = { id: string; title: string | null; updatedAt: string; participants: Array<{ user: { id: string; name: string; avatarUrl: string | null } }>; messages: Array<{ id: string; body: string; senderId: string; createdAt: string }> };
type FullThread = { id: string; title: string | null; participants: Array<{ user: User }>; messages: Array<{ id: string; body: string; senderId: string; createdAt: string }> };

export default function MessagesPage() {
  const { can, permissionsReady } = usePreferences();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [people, setPeople] = useState<User[]>([]);
  const [selected, setSelected] = useState<FullThread | null>(null);
  const [query, setQuery] = useState("");
  const [peopleQuery, setPeopleQuery] = useState("");
  const [compose, setCompose] = useState("");
  const [reply, setReply] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");

  async function loadThreads() {
    const r = await fetch("/api/messages", { cache: "no-store" });
    const d = await r.json();
    if (r.ok) setThreads(d.threads ?? []);
  }

  async function loadPeople(search = "") {
    const r = await fetch("/api/people?q=" + encodeURIComponent(search), { cache: "no-store" });
    const d = await r.json();
    if (r.ok) setPeople(d.users ?? []);
  }

  async function openThread(id: string) {
    setBusy("open");
    const r = await fetch("/api/messages/" + id, { cache: "no-store" });
    const d = await r.json();
    if (r.ok) setSelected(d.thread);
    else setMessage(d.error ?? "Could not open thread.");
    setBusy("");
  }

  useEffect(() => {
    if (!permissionsReady || !can("messages.read")) return;
    setLoading(true);
    Promise.all([loadThreads(), loadPeople()]).finally(() => setLoading(false));
  }, [permissionsReady]);

  useEffect(() => {
    if (!permissionsReady || !can("messages.read")) return;
    const timer = window.setInterval(() => {
      loadThreads();
      if (selected?.id) openThread(selected.id);
    }, 10000);
    return () => window.clearInterval(timer);
  }, [permissionsReady, selected?.id]);

  const filteredThreads = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return threads;
    return threads.filter((thread) => {
      const haystack = [
        thread.title ?? "",
        ...thread.participants.map((item) => item.user.name),
        ...thread.messages.map((item) => item.body),
      ].join(" ").toLowerCase();
      return haystack.includes(needle);
    });
  }, [threads, query]);

  async function sendNew(event: FormEvent, userId: string) {
    event.preventDefault();
    if (!compose.trim()) return;
    setBusy("send");
    const r = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, title: title.trim() || null, message: compose.trim() }),
    });
    const d = await r.json();
    if (r.ok) {
      setCompose("");
      setTitle("");
      await loadThreads();
      if (d.thread?.id) await openThread(d.thread.id);
      setMessage("Message sent.");
    } else setMessage(d.error ?? "Could not send message.");
    setBusy("");
  }

  async function sendReply(event: FormEvent) {
    event.preventDefault();
    if (!selected || !reply.trim()) return;
    setBusy("reply");
    const r = await fetch("/api/messages/" + selected.id, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: reply.trim() }),
    });
    const d = await r.json();
    if (r.ok) {
      setReply("");
      await openThread(selected.id);
      await loadThreads();
    } else setMessage(d.error ?? "Could not send reply.");
    setBusy("");
  }

  if (!permissionsReady) return <div className="rounded-[28px] border border-white/80 bg-white/60 p-8 text-sm text-black/40">Loading access…</div>;
  if (!can("messages.read")) return <div className="rounded-[28px] border border-dashed border-black/10 p-10 text-center text-sm text-black/40">Messaging is not available for this account.</div>;

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[34px] bg-black p-7 text-white shadow-[0_30px_90px_rgba(0,0,0,.16)] md:p-9">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/24 blur-[110px]" />
        <div className="relative flex items-end justify-between gap-5">
          <div><p className="text-[9px] uppercase tracking-[.22em] text-blue-300">Communication</p><h1 className="mt-3 text-4xl font-semibold tracking-[-.06em]">Messages.</h1><p className="mt-3 text-sm text-white/40">Private school communication, connected to roles and permissions.</p></div>
          <span className="hidden rounded-full border border-white/10 bg-white/[.06] px-3 py-2 text-[8px] text-white/40 md:block">Live</span>
        </div>
      </section>

      {message && <div className="rounded-[16px] bg-blue-500/10 px-4 py-3 text-[10px] text-blue-700">{message}</div>}

      <section className="grid gap-4 xl:grid-cols-[.72fr_1.28fr]">
        <div className="rounded-[28px] border border-white/80 bg-white/60 p-4 backdrop-blur-2xl">
          <div className="flex gap-2">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search conversations..." className="h-10 flex-1 rounded-[13px] bg-white/80 px-3 text-[9px] outline-none" />
            <button type="button" onClick={() => loadThreads()} className="rounded-[13px] bg-black px-3 text-[8px] font-semibold text-white">Refresh</button>
          </div>
          <div className="mt-4 space-y-2">
            {filteredThreads.map((thread) => {
              const others = thread.participants.map((item) => item.user.name).join(", ");
              const latest = thread.messages[0]?.body ?? "";
              return <button key={thread.id} type="button" onClick={() => openThread(thread.id)} className={"w-full rounded-[18px] p-4 text-left transition " + (selected?.id === thread.id ? "bg-black text-white" : "bg-white/70 hover:bg-white")}>
                <div className="flex items-center justify-between gap-3"><p className="truncate text-[10px] font-semibold">{thread.title || others}</p><span className={"text-[7px] " + (selected?.id === thread.id ? "text-white/35" : "text-black/25")}>{new Date(thread.updatedAt).toLocaleDateString()}</span></div>
                <p className={"mt-2 line-clamp-2 text-[8px] leading-4 " + (selected?.id === thread.id ? "text-white/35" : "text-black/35")}>{latest}</p>
              </button>;
            })}
            {!loading && filteredThreads.length === 0 && <p className="rounded-[18px] bg-black/[.025] p-6 text-center text-[9px] text-black/30">No conversations yet.</p>}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl">
          {selected ? (
            <>
              <div className="flex items-start justify-between gap-4 border-b border-black/5 pb-4">
                <div><p className="text-[8px] uppercase tracking-[.18em] text-black/25">Conversation</p><h2 className="mt-1 text-lg font-semibold">{selected.title || selected.participants.map((item) => item.user.name).join(", ")}</h2></div>
                <span className="rounded-full bg-black/[.04] px-3 py-1.5 text-[8px] text-black/30">{selected.messages.length} messages</span>
              </div>
              <div className="mt-4 max-h-[460px] space-y-2 overflow-y-auto pr-1">
                {selected.messages.map((item) => <div key={item.id} className="rounded-[18px] bg-black/[.025] p-4"><div className="flex items-center justify-between gap-3"><span className="text-[8px] font-semibold">{selected.participants.find((p) => p.user.id === item.senderId)?.user.name ?? "Member"}</span><span className="text-[7px] text-black/25">{new Date(item.createdAt).toLocaleString()}</span></div><p className="mt-2 whitespace-pre-wrap text-[10px] leading-5 text-black/55">{item.body}</p></div>)}
              </div>
              {can("messages.send") && <form onSubmit={sendReply} className="mt-4 flex gap-2 border-t border-black/5 pt-4"><input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write a reply..." className="h-11 flex-1 rounded-[14px] bg-white px-3 text-[10px] outline-none" /><button disabled={busy === "reply"} className="rounded-[14px] bg-black px-5 text-[9px] font-semibold text-white disabled:opacity-40">{busy === "reply" ? "Sending..." : "Send"}</button></form>}
            </>
          ) : (
            <div className="grid min-h-[520px] place-items-center">
              <div className="w-full max-w-md">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-black text-xl text-white">✉</div>
                <h2 className="mt-4 text-center text-xl font-semibold">Start a conversation.</h2>
                <p className="mt-2 text-center text-[10px] leading-5 text-black/35">Find a visible school member and send the first message.</p>
                {can("messages.send") ? <div className="mt-6 space-y-3"><input value={peopleQuery} onChange={(e) => { setPeopleQuery(e.target.value); loadPeople(e.target.value); }} placeholder="Search people..." className="h-11 w-full rounded-[14px] bg-white px-3 text-[10px] outline-none" />
                  <div className="max-h-56 space-y-2 overflow-y-auto">{people.slice(0, 8).map((person) => <div key={person.id} className="rounded-[18px] bg-black/[.025] p-3"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-full bg-black text-[8px] font-semibold text-white">{person.name.trim().charAt(0).toUpperCase()}</div><div className="min-w-0 flex-1"><p className="truncate text-[9px] font-semibold">{person.name}</p><p className="truncate text-[7px] text-black/30">{person.role}</p></div></div><input value={peopleQuery && compose ? compose : compose} onChange={(e) => setCompose(e.target.value)} placeholder="Message..." className="mt-3 h-9 w-full rounded-[12px] bg-white px-3 text-[9px] outline-none" /><form onSubmit={(e) => sendNew(e, person.id)} className="mt-2 flex gap-2"><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Optional subject" className="h-9 flex-1 rounded-[12px] bg-white px-3 text-[8px] outline-none" /><button disabled={busy === "send" || !compose.trim()} className="rounded-[12px] bg-black px-3 text-[8px] font-semibold text-white disabled:opacity-40">Send</button></form></div>)}</div>
                  {!peopleQuery && <p className="text-center text-[8px] text-black/25">Search by name or email to find someone.</p>}
                </div> : <p className="mt-5 rounded-[18px] bg-black/[.025] p-4 text-[9px] text-black/35">You can read messages, but sending is disabled for this account.</p>}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
