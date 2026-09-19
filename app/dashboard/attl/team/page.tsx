import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="ATTL"
      title="ATTL Team"
      description="Team members and ATTL role structure."
      icon="♧"
      api="/api/attl/overview"
    />
  );
}
