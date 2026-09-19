import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Settings"
      title="Language"
      description="Language preferences for the current English-first interface."
      icon="文"
      api="/api/settings"
    />
  );
}
