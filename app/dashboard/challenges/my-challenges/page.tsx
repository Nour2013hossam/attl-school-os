import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Innovation"
      title="My Challenges"
      description="Challenges connected to your account."
      icon="◆"
      api="/api/challenges"
    />
  );
}
