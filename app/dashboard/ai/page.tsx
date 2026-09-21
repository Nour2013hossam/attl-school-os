import AttlAiChat from "@/components/ai/attl-ai-chat";

type AiMode = "chat" | "analyze" | "image";

export default async function AiPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const params = await searchParams;
  const mode: AiMode =
    params.mode === "analyze" || params.mode === "image" ? params.mode : "chat";

  return <AttlAiChat initialMode={mode} />;
}
