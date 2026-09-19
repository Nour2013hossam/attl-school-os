import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="ATTL"
      title="ATTL Showcase"
      description="Projects and work worth showcasing."
      icon="✦"
      api="/api/projects"
    />
  );
}
