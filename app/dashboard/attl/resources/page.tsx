import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="ATTL"
      title="ATTL Resources"
      description="Shared resources for ATTL members."
      icon="▥"
      api="/api/courses"
    />
  );
}
