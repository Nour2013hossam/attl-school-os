import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Settings"
      title="Gamification"
      description="XP, levels and achievement preferences."
      icon="✦"
      api="/api/settings"
    />
  );
}
