import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { rateLimit } from "@/lib/rate-limit";

type ChatMessage = { role: "user" | "assistant"; content: string };

function isDataImage(value: unknown): value is string {
  return typeof value === "string" && /^data:image\/(png|jpe?g|webp|gif);base64,/i.test(value);
}

function extractText(output: any): string {
  if (typeof output?.output_text === "string") return output.output_text;
  return (output?.output ?? []).flatMap((item: any) => item?.content ?? [])
    .map((part: any) => part?.text ?? "").filter(Boolean).join("\n").trim();
}

function extractImage(output: any): string | null {
  for (const item of output?.output ?? []) {
    if (item?.type === "image_generation_call" && typeof item?.result === "string") {
      return `data:image/png;base64,${item.result}`;
    }
  }
  return null;
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rate = rateLimit(`ai:${session.user.id}`, 30, 60 * 60 * 1000);
  if (!rate.allowed) return NextResponse.json({ error: "Too many AI requests. Try again later." }, { status: 429 });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "OPENAI_API_KEY is not configured." }, { status: 503 });

  const body = await request.json() as {
    messages?: ChatMessage[];
    mode?: "chat" | "analyze" | "image";
    image?: string | null;
  };

  const messages = Array.isArray(body.messages) ? body.messages.slice(-16) : [];
  const mode = body.mode ?? "chat";
  const image = isDataImage(body.image) ? body.image : null;
  const latestUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

  if (!latestUser && !image) return NextResponse.json({ error: "Please send a message or image." }, { status: 400 });

  const developer = [
    "You are ATTL AI, the built-in assistant for ATTL School OS.",
    "Help students and school staff with learning, projects, coding, planning, writing, research and creative work.",
    "Prefer Arabic when the user writes Arabic. Be clear, age-appropriate and honest about uncertainty.",
    "Never claim to have changed grades, permissions, accounts or school records unless an explicit application tool did so.",
    mode === "analyze" ? "Analyze uploaded images carefully and distinguish visible facts from guesses." : "",
  ].filter(Boolean).join("\n");

  const inputContent: any[] = [
    { type: "input_text", text: latestUser || "Analyze this image." },
  ];
  if (image) inputContent.push({ type: "input_image", image_url: image, detail: "high" });

  const input: any[] = [
    { role: "developer", content: [{ type: "input_text", text: developer }] },
    ...messages.slice(0, -1).map((m) => ({ role: m.role, content: [{ type: "input_text", text: m.content.slice(0, 10000) }] })),
  ];
  if (latestUser || image) input.push({ role: "user", content: inputContent });

  const tools: any[] = [{ type: "web_search" }];
  if (mode === "image") tools.push({ type: "image_generation", action: "generate" });

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
        input,
        tools,
        max_output_tokens: 3000,
      }),
    });

    const data = await response.json();
    if (!response.ok) return NextResponse.json({ error: data?.error?.message || "OpenAI request failed." }, { status: response.status });

    return NextResponse.json({
      text: extractText(data) || "I couldn't produce a response.",
      image: extractImage(data),
    });
  } catch (error) {
    console.error("ATTL AI request failed", error);
    return NextResponse.json({ error: "AI service is temporarily unavailable." }, { status: 502 });
  }
}
