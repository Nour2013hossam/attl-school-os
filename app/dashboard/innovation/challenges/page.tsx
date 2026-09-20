import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Innovation"
      title="Innovation Challenges"
      description="Innovation challenges and problem spaces."
      icon="◆"
      api="/api/challenges"
      actions={[{ label: "Explore challenges", href: "/dashboard/challenges/explore" }, { label: "Leaderboard", href: "/dashboard/challenges/leaderboard" }]}
    />
  );
}
