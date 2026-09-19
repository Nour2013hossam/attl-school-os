import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Innovation"
      title="Competition Challenges"
      description="Competition-related challenge records."
      icon="△"
      api="/api/challenges"
    />
  );
}
