import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Challenges"
      title="Completed"
      description="Review completed challenge records."
      icon="✓"
      api="/api/challenges"
    />
  );
}
