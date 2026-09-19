import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Projects"
      title="Milestones"
      description="Track project milestones and delivery progress."
      icon="◆"
      api="/api/projects"
    />
  );
}
