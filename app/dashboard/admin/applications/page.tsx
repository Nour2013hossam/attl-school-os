import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Admin OS"
      title="ATTL Applications"
      description="Review incoming ATTL applications and their current workflow state."
      icon="◎"
      api="/api/attl/applications"
    />
  );
}
