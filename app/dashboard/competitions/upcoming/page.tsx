import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Competitions"
      title="Upcoming"
      description="See upcoming competition opportunities and deadlines."
      icon="◷"
      api="/api/competitions"
    />
  );
}
