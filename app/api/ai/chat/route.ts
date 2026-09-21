import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

type ChatMessage = { role: "user" | "assistant"; content: string };

function isDataImage(value: unknown): value is string {
  return typeof value === "string" && /^data:image\/(png|jpe?g|webp|gif);base64,/i.test(value);
}

function isBase64(value: unknown): value is string {
  return typeof value === "string" && /^[A-Za-z0-9+/=\s]+$/.test(value) && value.length > 16;
}

function extractText(output: any): string {
  if (typeof output?.output_text === "string") return output.output_text.trim();
  return (output?.output ?? [])
    .flatMap((item: any) => item?.content ?? [])
    .map((part: any) => part?.text ?? "")
    .filter(Boolean)
    .join("\n")
    .trim();
}

function extractImage(output: any): string | null {
  for (const item of output?.output ?? []) {
    if (item?.type === "image_generation_call" && typeof item?.result === "string") {
      return `data:image/png;base64,${item.result}`;
    }
  }
  return null;
}

function compactDate(value: Date | null | undefined) {
  return value ? value.toISOString().slice(0, 10) : null;
}

async function buildSchoolContext(userId: string) {
  const [user, grades, projects, enrollments, submissions, events] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        role: true,
        gradeLevel: true,
        className: true,
        xp: true,
        level: true,
        attlMembershipActive: true,
      },
    }),
    prisma.grade.findMany({
      where: { userId, published: true },
      orderBy: { updatedAt: "desc" },
      take: 12,
      select: {
        term: true,
        assessment: true,
        score: true,
        maxScore: true,
        subject: { select: { name: true, code: true } },
      },
    }),
    prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
      },
      orderBy: { updatedAt: "desc" },
      take: 8,
      select: {
        title: true,
        status: true,
        progress: true,
        updatedAt: true,
      },
    }),
    prisma.courseEnrollment.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 8,
      select: {
        status: true,
        progress: true,
        course: { select: { title: true, level: true } },
      },
    }),
    prisma.assignmentSubmission.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 8,
      select: {
        status: true,
        score: true,
        assignment: {
          select: {
            title: true,
            dueAt: true,
            subject: { select: { name: true } },
          },
        },
      },
    }),
    prisma.eventRegistration.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        event: { select: { title: true, startsAt: true, location: true } },
      },
    }),
  ]);

  return JSON.stringify({
    user,
    publishedGrades: grades.map((g) => ({
      subject: g.subject.name,
      code: g.subject.code,
      term: g.term,
      assessment: g.assessment,
      score: g.score,
      maxScore: g.maxScore,
    })),
    projects: projects.map((p) => ({
      title: p.title,
      status: p.status,
      progress: p.progress,
      updated: compactDate(p.updatedAt),
    })),
    courses: enrollments.map((e) => ({
      title: e.course.title,
      level: e.course.level,
      status: e.status,
      progress: e.progress,
    })),
    submissions: submissions.map((s) => ({
      title: s.assignment.title,
      subject: s.assignment.subject.name,
      due: compactDate(s.assignment.dueAt),
      status: s.status,
      score: s.score,
    })),
    registeredEvents: events.map((e) => ({
      title: e.event.title,
      startsAt: e.event.startsAt.toISOString(),
      location: e.event.location,
    })),
  });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rate = rateLimit(`ai:${session.user.id}`, 30, 60 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many AI requests. Try again later." },
      { status: 429 },
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured." },
      { status: 503 },
    );
  }

  let body: {
    messages?: ChatMessage[];
    mode?: "chat" | "analyze" | "image";
    image?: string | null;
    file?: { name?: string; mimeType?: string; data?: string } | null;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const messages = Array.isArray(body.messages)
    ? body.messages
        .filter(
          (message): message is ChatMessage =>
            (message?.role === "user" || message?.role === "assistant") &&
            typeof message.content === "string",
        )
        .slice(-16)
    : [];

  const mode = body.mode ?? "chat";
  const image = isDataImage(body.image) ? body.image : null;
  const fileName =
    typeof body.file?.name === "string" ? body.file.name.slice(0, 120) : null;
  const fileMime =
    typeof body.file?.mimeType === "string"
      ? body.file.mimeType.slice(0, 80)
      : null;
  const fileData =
    isBase64(body.file?.data) && body.file.data.length <= 4_500_000
      ? body.file.data.replace(/\s/g, "")
      : null;
  const latestUser =
    [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

  if (!latestUser && !image && !fileData) {
    return NextResponse.json(
      { error: "Please send a message or file." },
      { status: 400 },
    );
  }

  const schoolContext = await buildSchoolContext(session.user.id);

  const developer = [
    "You are ATTL AI, the built-in multimodal assistant for ATTL School OS.",
    "You help students and authorized school users with learning, projects, coding, planning, writing, research, image understanding and creative work.",
    "Prefer Arabic when the user writes Arabic; otherwise use English.",
    "Be clear, age-appropriate, practical and honest about uncertainty.",
    "You can use web search when current or external information is useful.",
    "Never claim to have changed grades, permissions, accounts, applications, XP, schedules or school records unless an explicit application tool actually performed that action.",
    "Only discuss academic results present in publishedGrades. Never infer or expose unpublished results.",
    "Treat the following school context as private account data. Use it only to personalize the current response and do not repeat unrelated personal details.",
    "Current account context:",
    schoolContext,
    mode === "analyze"
      ? "Analyze the supplied visual/file carefully. Clearly separate visible facts, extracted text and reasonable interpretation."
      : "",
    mode === "image"
      ? "Create the requested image. If the request is ambiguous, produce a polished school-safe visual interpretation."
      : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const inputContent: any[] = [
    {
      type: "input_text",
      text: latestUser || (image ? "Analyze this image." : "Analyze this file."),
    },
  ];

  if (image) {
    inputContent.push({ type: "input_image", image_url: image, detail: "high" });
  }

  if (fileData) {
    inputContent.push({
      type: "input_file",
      file_data: fileData,
      filename: fileName ?? "uploaded-file",
    });
  }

  const input: any[] = [
    {
      role: "developer",
      content: [{ type: "input_text", text: developer }],
    },
    ...messages.slice(0, -1).map((message) => ({
      role: message.role,
      content: [
        { type: "input_text", text: message.content.slice(0, 10000) },
      ],
    })),
  ];

  input.push({ role: "user", content: inputContent });

  const tools: any[] = [];
  if (body.mode !== "image") tools.push({ type: "web_search" });
  if (mode === "image") {
    tools.push({ type: "image_generation", action: "generate" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
        input,
        tools,
        max_output_tokens: 3500,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error?.message || "OpenAI request failed." },
        { status: response.status },
      );
    }

    return NextResponse.json({
      text: extractText(data) || "I couldn't produce a response.",
      image: extractImage(data),
      remaining: rate.remaining,
    });
  } catch (error) {
    console.error("ATTL AI request failed", error);
    return NextResponse.json(
      { error: "AI service is temporarily unavailable." },
      { status: 502 },
    );
  }
}
