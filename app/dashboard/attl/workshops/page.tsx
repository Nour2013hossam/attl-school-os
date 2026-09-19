import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="ATTL"
      title="ATTL Workshops"
      description="Workshops and learning sessions connected to ATTL."
      icon="▤"
      api="/api/events"
    />
  );
}
