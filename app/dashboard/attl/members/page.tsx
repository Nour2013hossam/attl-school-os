import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="ATTL"
      title="ATTL Members"
      description="Current ATTL membership records."
      icon="●"
      api="/api/attl/applications"
    />
  );
}
