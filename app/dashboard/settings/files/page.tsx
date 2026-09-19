import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Settings"
      title="Files"
      description="Manage School OS file preferences."
      icon="▤"
      api="/api/settings"
    />
  );
}
