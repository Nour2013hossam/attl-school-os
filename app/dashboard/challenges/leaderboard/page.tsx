import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Challenges"
      title="Leaderboard"
      description="Explore challenge participation and progress."
      icon="★"
      api="/api/challenges"
    />
  );
}
