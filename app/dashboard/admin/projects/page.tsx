import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Admin OS"
      title="Projects"
      description="Review School OS project activity."
      icon="▣"
      api="/api/projects"
    />
  );
}
