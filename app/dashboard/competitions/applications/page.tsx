import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Competitions"
      title="My Applications"
      description="Track your competition applications and their current status."
      icon="□"
      api="/api/competitions/applications"
    />
  );
}
