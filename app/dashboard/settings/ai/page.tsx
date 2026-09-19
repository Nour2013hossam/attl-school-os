import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Settings"
      title="AI Settings"
      description="Configure the future AI learning layer."
      icon="⌘"
      api="/api/settings"
    />
  );
}
