import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Settings"
      title="Academic Settings"
      description="Configure academic experience preferences."
      icon="◆"
      api="/api/settings"
    />
  );
}
