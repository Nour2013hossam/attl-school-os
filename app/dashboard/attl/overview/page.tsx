import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="ATTL"
      title="ATTL Overview"
      description="ATTL operations, tracks, membership and activity."
      icon="A"
      api="/api/attl/overview"
    />
  );
}
