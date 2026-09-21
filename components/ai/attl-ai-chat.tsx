"use client";

import { useRef, useState } from "react";
import { usePreferences } from "@/components/providers/preferences-provider";

type Message = { id: string; role: "user" | "assistant"; content: string; image?: string | null };

const id = () => Math.random().toString(36).slice(2);

async function compressImage(file: File) {
  const bitmap = await createImageBitmap(file);
  const max = 1600;
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Image processing is not supported.");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.82);
}

export default function AttlAiChat() {
  const { language } = usePreferences();
  const ar = language === "ar";
  const fileRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [mode, setMode] = useState<"chat" | "analyze" | "image">("chat");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function send(prompt = input) {
    if (busy || (!prompt.trim() && !image)) return;
    const user: Message = { id: id(), role: "user", content: prompt.trim() || (ar ? "حلل الصورة دي." : "Analyze this image."), image };
    const next = [...messages, user];
    setMessages(next); setInput(""); setError(""); setBusy(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, image, messages: next.map(({ role, content }) => ({ role, content })) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "AI request failed.");
      setMessages((current) => [...current, { id: id(), role: "assistant", content: data.text || "", image: data.image || null }]);
      setImage(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally { setBusy(false); }
  }

  const quick = ar
    ? ["اشرحلي الدرس ده ببساطة", "حلل الصورة دي", "اديني فكرة مشروع ATTL", "اعمل صورة لوجو لـ ATTL"]
    : ["Explain this lesson simply", "Analyze this image", "Give me an ATTL project idea", "Create an ATTL logo"];

  return (
    <div className="grid min-h-[calc(100vh-150px)] gap-4 xl:grid-cols-[1fr_300px]">
      <section className="flex min-h-[680px] flex-col overflow-hidden rounded-[32px] border border-white/70 bg-white/55 shadow-[0_30px_100px_rgba(20,30,50,.08)] backdrop-blur-2xl">
        <header className="border-b border-black/5 px-5 py-4 md:px-7">
          <p className="text-[8px] font-semibold uppercase tracking-[.2em] text-blue-600">ATTL AI</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-[-.05em]">{ar ? "مساعدك الذكي داخل School OS" : "Your AI workspace inside School OS"}</h1>
          <p className="mt-1 text-[10px] text-black/35">{ar ? "اسأل، حلّل، ابحث، أو أنشئ صور." : "Ask, analyze, search, or create images."}</p>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto p-4 md:p-7">
          {messages.length === 0 && (
            <div className="mx-auto flex min-h-[500px] max-w-2xl flex-col items-center justify-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-black text-3xl text-white shadow-2xl">✦</div>
              <h2 className="mt-6 text-3xl font-semibold tracking-[-.06em]">{ar ? "أهلاً بيك في ATTL AI" : "Welcome to ATTL AI"}</h2>
              <p className="mt-3 max-w-lg text-xs leading-6 text-black/40">{ar ? "مساعد واحد للتعلم، المشاريع، البرمجة، تحليل الصور، البحث، والأفكار الإبداعية." : "One assistant for learning, projects, coding, image analysis, research, and creative work."}</p>
              <div className="mt-7 flex flex-wrap justify-center gap-2">
                {quick.map((item) => <button key={item} onClick={() => void send(item)} className="rounded-full border border-black/5 bg-white/70 px-4 py-2.5 text-[9px] font-medium text-black/55 transition hover:-translate-y-0.5 hover:bg-white">{item}</button>)}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={message.role === "user" ? "flex justify-end" : "flex justify-start"}>
              <div className={`max-w-[88%] rounded-[24px] px-4 py-3 md:max-w-[75%] ${message.role === "user" ? "bg-black text-white" : "border border-black/5 bg-white/80 text-black"}`}>
                {message.image && <img src={message.image} alt="" className="mb-3 max-h-[420px] w-full rounded-[16px] object-contain" />}
                <p className="whitespace-pre-wrap text-[11px] leading-6">{message.content}</p>
              </div>
            </div>
          ))}
          {busy && <div className="flex justify-start"><div className="rounded-[22px] border border-black/5 bg-white/80 px-4 py-3 text-[10px] text-black/35">{ar ? "ATTL AI بيفكر..." : "ATTL AI is thinking..."}</div></div>}
        </div>

        <div className="border-t border-black/5 p-4 md:p-5">
          {image && <div className="mb-3 flex items-center gap-3 rounded-[18px] bg-black/[.035] p-2"><img src={image} alt="" className="h-14 w-14 rounded-[13px] object-cover" /><div className="flex-1 text-[9px] text-black/45">{ar ? "الصورة جاهزة للتحليل" : "Image ready for analysis"}</div><button onClick={() => setImage(null)} className="rounded-full px-3 py-1 text-[9px] text-black/40 hover:bg-white">{ar ? "إزالة" : "Remove"}</button></div>}
          {error && <div className="mb-3 rounded-[15px] bg-red-500/10 px-3 py-2 text-[9px] text-red-700">{error}</div>}

          <div className="mb-3 flex flex-wrap gap-2">
            {([["chat", ar ? "محادثة" : "Chat"], ["analyze", ar ? "تحليل صورة" : "Analyze"], ["image", ar ? "إنشاء صورة" : "Create image"]] as const).map(([value, label]) => (
              <button key={value} onClick={() => setMode(value)} className={`rounded-full px-3 py-1.5 text-[8px] font-semibold ${mode === value ? "bg-black text-white" : "bg-black/[.035] text-black/40"}`}>{label}</button>
            ))}
          </div>

          <div className="flex items-end gap-2 rounded-[24px] border border-black/5 bg-white/75 p-2 shadow-inner">
            <button onClick={() => fileRef.current?.click()} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[17px] bg-black/[.04] text-lg text-black/50 hover:bg-black/[.08]">＋</button>
            <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; try { setImage(await compressImage(file)); setMode("analyze"); setError(""); } catch { setError(ar ? "مش قادر أقرأ الصورة دي." : "I couldn't process that image."); } }} />
            <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(); } }} placeholder={mode === "image" ? (ar ? "اوصف الصورة اللي عايزها..." : "Describe the image you want...") : (ar ? "اكتب رسالتك..." : "Message ATTL AI...")} className="min-h-11 flex-1 resize-none bg-transparent px-2 py-3 text-[11px] outline-none placeholder:text-black/25" rows={1} />
            <button onClick={() => void send()} disabled={busy || (!input.trim() && !image)} className="h-11 rounded-[17px] bg-black px-5 text-[9px] font-semibold text-white transition disabled:opacity-30">{busy ? "…" : ar ? "إرسال" : "Send"}</button>
          </div>
        </div>
      </section>

      <aside className="glass h-fit rounded-[28px] p-5">
        <p className="text-[8px] font-semibold uppercase tracking-[.2em] text-black/30">{ar ? "قدرات" : "Capabilities"}</p>
        <div className="mt-4 space-y-2">
          {(ar
            ? [["✦", "محادثة وشرح", "تعلم وبرمجة وكتابة"], ["◉", "تحليل الصور", "صور وأسئلة وواجبات"], ["⌕", "بحث ويب", "معلومات حديثة"], ["▧", "إنشاء صور", "أفكار، بوسترات، لوجوهات"]]
            : [["✦", "Chat & explain", "Learning, coding, writing"], ["◉", "Vision", "Analyze uploaded images"], ["⌕", "Web search", "Current information"], ["▧", "Image generation", "Ideas, posters, logos"]]
          ).map(([icon, title, text]) => <div key={title} className="rounded-[19px] bg-black/[.025] p-4"><div className="flex h-8 w-8 items-center justify-center rounded-[11px] bg-black text-xs text-white">{icon}</div><p className="mt-3 text-[10px] font-semibold">{title}</p><p className="mt-1 text-[8px] leading-4 text-black/35">{text}</p></div>)}
        </div>
      </aside>
    </div>
  );
}
