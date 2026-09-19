import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Settings"
      title="Notifications"
      description="Manage your notification preferences."
      icon="●"
      api="/api/settings"
    />
  );
}
