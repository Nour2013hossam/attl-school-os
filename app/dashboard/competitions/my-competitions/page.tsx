import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Competitions"
      title="My Competitions"
      description="Track competition records connected to your account."
      icon="★"
      api="/api/competitions/applications"
    />
  );
}
