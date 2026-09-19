import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="ATTL"
      title="ATTL Events"
      description="Events organized through ATTL."
      icon="◷"
      api="/api/events"
    />
  );
}
