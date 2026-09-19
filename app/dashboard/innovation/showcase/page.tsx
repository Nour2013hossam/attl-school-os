import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Innovation"
      title="Innovation Showcase"
      description="Present ideas and experiments."
      icon="★"
      api="/api/ideas"
    />
  );
}
