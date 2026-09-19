import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="ATTL"
      title="Recruitment"
      description="Track the ATTL recruitment pipeline."
      icon="↗"
      api="/api/attl/applications"
    />
  );
}
