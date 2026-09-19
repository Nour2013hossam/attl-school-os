import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Settings"
      title="Integrations"
      description="Manage supported School OS integrations."
      icon="↗"
      api="/api/settings"
    />
  );
}
