"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePreferences } from "@/components/providers/preferences-provider";

type Mode = "chat" | "analyze" | "image";
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  image?: string | null;
  fileName?: string | null;
};
type Attachment = {
  name: string;
  mimeType: string;
  base64: string;
  preview: string | null;
};

const STORAGE_KEY = "attl-ai-history-v2";
const MAX_FILE_BYTES = 3 * 1024 * 1024;
const makeId = () => Math.random().toString(36).slice(2);

async function compressImage(file: File) {
  const bitmap = await createImageBitmap(file);
  const max = 1600;
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Image processing is not supported.");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.82);
}

function dataUrlToBase64(dataUrl: string) {
  return dataUrl.split(",")[1] ?? "";
}

async function readAttachment(file: File): Promise<Attachment> {
  if (file.size > MAX_FILE_BYTES) {
    throw new Error("FILE_TOO_LARGE");
  }

  if (file.type.startsWith("image/")) {
    const preview = await compressImage(file);
    return {
      name: file.name,
      mimeType: "image/jpeg",
      base64: dataUrlToBase64(preview),
      preview,
    };
  }

  const supported =
    file.type === "application/pdf" ||
    file.type === "text/plain" ||
    file.type === "text/csv" ||
    file.type === "application/json";

  if (!supported) throw new Error("FILE_TYPE");

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("FILE_READ"));
    reader.readAsDataURL(file);
  });

  return {
    name: file.name,
    mimeType: file.type || "application/octet-stream",
    base64: dataUrlToBase64(dataUrl),
    preview: null,
  };
}

export default function AttlAiChat({
  initialMode = "chat",
}: {
  initialMode?: Mode;
}) {
  const { language } = usePreferences();
  const ar = language === "ar";
  const fileRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [mode, setMode] = useState<Mode>(initialMode);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setMessages(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    const compactHistory = messages.slice(-30).map((message) => ({
      ...message,
      image: null,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(compactHistory));
  }, [messages]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  async function send(prompt = input) {
    if (busy || (!prompt.trim() && !attachment)) return;

    const user: Message = {
      id: makeId(),
      role: "user",
      content:
        prompt.trim() ||
        (ar
          ? attachment?.mimeType.startsWith("image/")
            ? "حلل الصورة دي."
            : "حلل الملف ده."
          : attachment?.mimeType.startsWith("image/")
            ? "Analyze this image."
            : "Analyze this file."),
      image: attachment?.preview,
      fileName: attachment?.name ?? null,
    };

    const next = [...messages, user];
    setMessages(next);
    setInput("");
    setError("");
    setBusy(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          messages: next.map(({ role, content }) => ({ role, content })),
          image: attachment?.preview ?? null,
          file: attachment
            ? {
                name: attachment.name,
                mimeType: attachment.mimeType,
                data: attachment.base64,
              }
            : null,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "AI request failed.");

      setMessages((current) => [
        ...current,
        {
          id: makeId(),
          role: "assistant",
          content: data.text || "",
          image: data.image || null,
        },
      ]);
      setAttachment(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (e) {
      const message = e instanceof Error ? e.message : "";
      const friendly =
        message === "FILE_TOO_LARGE"
          ? ar
            ? "الملف كبير. استخدم ملف أقل من 3MB."
            : "That file is too large. Use a file under 3MB."
          : message === "FILE_TYPE"
            ? ar
              ? "الأنواع المدعومة: صور، PDF، TXT، CSV، JSON."
              : "Supported: images, PDF, TXT, CSV, JSON."
            : e instanceof Error
              ? e.message
              : ar
                ? "حصل خطأ غير متوقع."
                : "Something went wrong.";
      setError(friendly);
    } finally {
      setBusy(false);
    }
  }

  function clearChat() {
    setMessages([]);
    setError("");
    setAttachment(null);
    localStorage.removeItem(STORAGE_KEY);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function copyMessage(message: Message) {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedId(message.id);
      window.setTimeout(() => setCopiedId(null), 1200);
    } catch {}
  }

  const quick = ar
    ? [
        "اشرحلي الدرس ده ببساطة",
        "حلل الملف ده",
        "اديني فكرة مشروع ATTL",
        "ساعدني أعمل خطة مذاكرة",
      ]
    : [
        "Explain this lesson simply",
        "Analyze this file",
        "Give me an ATTL project idea",
        "Help me make a study plan",
      ];

  const modeOptions: Array<[Mode, string]> = [
    ["chat", ar ? "محادثة" : "Chat"],
    ["analyze", ar ? "تحليل" : "Analyze"],
    ["image", ar ? "إنشاء صورة" : "Create image"],
  ];

  return (
    <div className="grid min-h-[calc(100vh-150px)] gap-4 xl:grid-cols-[minmax(0,1fr)_310px]">
      <section className="relative flex min-h-[680px] min-w-0 flex-col overflow-hidden rounded-[32px] border border-white/70 bg-white/55 shadow-[0_30px_100px_rgba(20,30,50,.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-black/20">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-blue-400/10 to-transparent" />

        <header className="relative flex items-center justify-between border-b border-black/5 px-5 py-4 dark:border-white/10 md:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-black text-white shadow-xl">
              <span className="relative text-lg">✦</span>
            </div>
            <div>
              <p className="text-[8px] font-semibold uppercase tracking-[.22em] text-blue-600">
                ATTL AI
              </p>
              <h1 className="mt-1 text-lg font-semibold tracking-[-.04em] md:text-xl">
                {ar ? "المساعد الذكي داخل School OS" : "AI inside School OS"}
              </h1>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="rounded-full bg-black/[.035] px-3 py-2 text-[8px] font-semibold text-black/45 hover:bg-black/[.07] dark:bg-white/5 dark:text-white/45 dark:hover:bg-white/10"
          >
            {ar ? "محادثة جديدة" : "New chat"}
          </button>
        </header>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4 md:p-7">
          {messages.length === 0 && (
            <div className="mx-auto flex min-h-[500px] max-w-2xl flex-col items-center justify-center text-center">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-[31px] border border-white/80 bg-white/75 shadow-[0_25px_80px_rgba(30,80,180,.12)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/10">
                <div className="flex h-16 w-16 items-center justify-center rounded-[21px] bg-black text-2xl text-white shadow-2xl">
                  ✦
                </div>
                <div className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-4 border-[#eef2f7] bg-blue-500 shadow-[0_0_16px_rgba(59,130,246,.8)] dark:border-[#090b0f]" />
              </div>

              <h2 className="mt-7 text-3xl font-semibold tracking-[-.06em]">
                {ar ? "أهلاً بيك في ATTL AI" : "Welcome to ATTL AI"}
              </h2>
              <p className="mt-3 max-w-lg text-xs leading-6 text-black/40 dark:text-white/40">
                {ar
                  ? "تعلم، برمجة، مشاريع، تحليل صور وملفات، بحث على الويب، وإنشاء صور — في مكان واحد."
                  : "Learning, coding, projects, image and file analysis, web research, and image creation — all in one place."}
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-2">
                {quick.map((item) => (
                  <button
                    key={item}
                    onClick={() => void send(item)}
                    className="rounded-full border border-black/5 bg-white/70 px-4 py-2.5 text-[9px] font-medium text-black/55 transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white/55 dark:hover:bg-white/10"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={message.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <div className="flex max-w-[92%] items-end gap-2 md:max-w-[78%]">
                {message.role === "assistant" && (
                  <div className="mb-1 hidden h-7 w-7 shrink-0 items-center justify-center rounded-[10px] bg-black text-[10px] text-white shadow md:flex">
                    ✦
                  </div>
                )}
                <div
                  className={[
                    "group rounded-[24px] px-4 py-3",
                    message.role === "user"
                      ? "bg-black text-white shadow-xl"
                      : "border border-black/5 bg-white/80 text-black dark:border-white/10 dark:bg-white/5 dark:text-white",
                  ].join(" ")}
                >
                  {message.image && (
                    <img
                      src={message.image}
                      alt=""
                      className="mb-3 max-h-[420px] w-full rounded-[16px] object-contain"
                    />
                  )}
                  {message.fileName && !message.image && (
                    <div className="mb-2 rounded-[13px] bg-black/[.04] px-3 py-2 text-[8px] text-black/45 dark:bg-white/5 dark:text-white/45">
                      ⌁ {message.fileName}
                    </div>
                  )}
                  <p className="whitespace-pre-wrap text-[11px] leading-6">
                    {message.content}
                  </p>
                  {message.role === "assistant" && (
                    <button
                      onClick={() => void copyMessage(message)}
                      className="mt-2 text-[8px] text-black/25 opacity-0 transition group-hover:opacity-100 dark:text-white/25"
                    >
                      {copiedId === message.id ? (ar ? "تم النسخ" : "Copied") : ar ? "نسخ" : "Copy"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {busy && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-[22px] border border-black/5 bg-white/80 px-4 py-3 text-[10px] text-black/35 dark:border-white/10 dark:bg-white/5 dark:text-white/35">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
                {ar ? "ATTL AI بيفكر..." : "ATTL AI is thinking..."}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-black/5 p-4 dark:border-white/10 md:p-5">
          {attachment && (
            <div className="mb-3 flex items-center gap-3 rounded-[18px] border border-black/5 bg-white/65 p-2 dark:border-white/10 dark:bg-white/5">
              {attachment.preview ? (
                <img
                  src={attachment.preview}
                  alt=""
                  className="h-14 w-14 rounded-[13px] object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-[13px] bg-black text-[9px] font-bold text-white">
                  {attachment.mimeType === "application/pdf" ? "PDF" : "FILE"}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-[9px] font-semibold">{attachment.name}</p>
                <p className="mt-1 text-[8px] text-black/35 dark:text-white/35">
                  {ar ? "جاهز للإرسال والتحليل" : "Ready for analysis"}
                </p>
              </div>
              <button
                onClick={() => setAttachment(null)}
                className="rounded-full px-3 py-1 text-[9px] text-black/40 hover:bg-black/[.04] dark:text-white/40 dark:hover:bg-white/5"
              >
                {ar ? "إزالة" : "Remove"}
              </button>
            </div>
          )}

          {error && (
            <div className="mb-3 rounded-[15px] border border-red-500/10 bg-red-500/10 px-3 py-2 text-[9px] text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              {modeOptions.map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setMode(value)}
                  className={[
                    "rounded-full px-3 py-1.5 text-[8px] font-semibold",
                    mode === value
                      ? "bg-black text-white shadow-md"
                      : "bg-black/[.035] text-black/40 dark:bg-white/5 dark:text-white/40",
                  ].join(" ")}
                >
                  {label}
                </button>
              ))}
            </div>

            <Link
              href="/dashboard/ai"
              className="hidden rounded-full px-2 py-1 text-[8px] text-black/30 hover:bg-black/[.03] dark:text-white/30 dark:hover:bg-white/5 sm:block"
            >
              {ar ? "Full workspace ↗" : "Full workspace ↗"}
            </Link>
          </div>

          <div className="flex items-end gap-2 rounded-[24px] border border-white/80 bg-white/75 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,.9),0_10px_30px_rgba(20,30,50,.06)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
            <button
              onClick={() => fileRef.current?.click()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[17px] bg-black/[.04] text-lg text-black/50 hover:bg-black/[.08] dark:bg-white/5 dark:text-white/55 dark:hover:bg-white/10"
              aria-label={ar ? "إرفاق ملف" : "Attach file"}
            >
              ＋
            </button>

            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,application/pdf,text/plain,text/csv,application/json"
              className="hidden"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                try {
                  setAttachment(await readAttachment(file));
                  setMode(file.type.startsWith("image/") ? "analyze" : "analyze");
                  setError("");
                } catch (e) {
                  const code = e instanceof Error ? e.message : "";
                  setError(
                    code === "FILE_TOO_LARGE"
                      ? ar
                        ? "الملف لازم يكون أقل من 3MB."
                        : "The file must be under 3MB."
                      : ar
                        ? "الملف غير مدعوم."
                        : "Unsupported file.",
                  );
                  event.target.value = "";
                }
              }}
            />

            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void send();
                }
              }}
              placeholder={
                mode === "image"
                  ? ar
                    ? "اوصف الصورة اللي عايزها..."
                    : "Describe the image you want..."
                  : ar
                    ? "اكتب رسالتك..."
                    : "Message ATTL AI..."
              }
              className="min-h-11 flex-1 resize-none bg-transparent px-2 py-3 text-[11px] outline-none placeholder:text-black/25"
              rows={1}
            />

            <button
              onClick={() => void send()}
              disabled={busy || (!input.trim() && !attachment)}
              className="h-11 rounded-[17px] bg-black px-5 text-[9px] font-semibold text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-30"
            >
              {busy ? "…" : ar ? "إرسال" : "Send"}
            </button>
          </div>
          <p className="mt-2 px-2 text-[8px] text-black/25 dark:text-white/25">
            {ar
              ? "يمكنه البحث في الويب عند الحاجة، وتحليل الملفات والصور، وإنشاء الصور."
              : "Can search the web when useful, analyze files and images, and create images."}
          </p>
        </div>
      </section>

      <aside className="glass h-fit rounded-[28px] p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[8px] font-semibold uppercase tracking-[.2em] text-black/30 dark:text-white/30">
              {ar ? "قدرات ATTL AI" : "ATTL AI capabilities"}
            </p>
            <p className="mt-1 text-[10px] text-black/40 dark:text-white/40">
              {ar ? "مساعد واحد لكل مساحة العمل" : "One assistant for your workspace"}
            </p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-black text-white">
            ✦
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {(ar
            ? [
                ["✦", "محادثة وشرح", "تعلم وبرمجة وكتابة"],
                ["◉", "تحليل الصور", "صور وأسئلة وواجبات"],
                ["⌁", "تحليل الملفات", "PDF وTXT وCSV وJSON"],
                ["⌕", "بحث ويب", "معلومات حديثة عند الحاجة"],
                ["▧", "إنشاء صور", "أفكار، بوسترات، لوجوهات"],
                ["◎", "سياق School OS", "يعرف بياناتك الدراسية المنشورة ومشاريعك ودوراتك"],
              ]
            : [
                ["✦", "Chat & explain", "Learning, coding, writing"],
                ["◉", "Vision", "Analyze uploaded images"],
                ["⌁", "File analysis", "PDF, TXT, CSV, JSON"],
                ["⌕", "Web search", "Current information when useful"],
                ["▧", "Image generation", "Ideas, posters, logos"],
                ["◎", "School OS context", "Uses your published academic and workspace context"],
              ]
          ).map(([icon, title, text]) => (
            <div
              key={title}
              className="rounded-[19px] border border-black/5 bg-black/[.025] p-4 dark:border-white/10 dark:bg-white/[.03]"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-[11px] bg-black text-xs text-white">
                {icon}
              </div>
              <p className="mt-3 text-[10px] font-semibold">{title}</p>
              <p className="mt-1 text-[8px] leading-4 text-black/35 dark:text-white/35">
                {text}
              </p>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
