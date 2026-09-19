import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Projects"
      title="Tasks"
      description="Track project work items and assignments."
      icon="✓"
      api="/api/projects"
    />
  );
}
