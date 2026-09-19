import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Events"
      title="Upcoming"
      description="See your next school events and opportunities."
      icon="◷"
      api="/api/events"
    />
  );
}
