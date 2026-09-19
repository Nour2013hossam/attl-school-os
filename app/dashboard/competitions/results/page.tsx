import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Competitions"
      title="Results"
      description="Review published competition information and outcomes."
      icon="◆"
      api="/api/competitions"
    />
  );
}
