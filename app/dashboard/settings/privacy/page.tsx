import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Settings"
      title="Privacy"
      description="Manage your profile visibility preferences."
      icon="◈"
      api="/api/settings"
    />
  );
}
