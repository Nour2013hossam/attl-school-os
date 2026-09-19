import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Workspace"
      title="Notifications"
      description="Your system, academic, project and ATTL notifications."
      icon="⌂"
      api="/api/notifications"
    />
  );
}
