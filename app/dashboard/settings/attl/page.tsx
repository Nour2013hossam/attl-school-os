import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Settings"
      title="ATTL Settings"
      description="Configure your ATTL experience."
      icon="A"
      api="/api/settings"
    />
  );
}
