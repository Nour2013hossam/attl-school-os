import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Learning"
      title="Roadmaps"
      description="Plan a learning path from foundations to real projects."
      icon="↗"
      api="/api/courses"
    />
  );
}
