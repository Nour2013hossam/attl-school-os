import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Events"
      title="History"
      description="Review past school events and participation."
      icon="↺"
      api="/api/events"
    />
  );
}
