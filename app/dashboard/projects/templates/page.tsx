import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Projects"
      title="Templates"
      description="Start from structured project templates."
      icon="▤"
      api="/api/projects"
    />
  );
}
