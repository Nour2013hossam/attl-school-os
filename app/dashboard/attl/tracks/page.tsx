import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="ATTL"
      title="ATTL Tracks"
      description="Active ATTL tracks available to members and applicants."
      icon="◇"
      api="/api/attl/tracks"
    />
  );
}
