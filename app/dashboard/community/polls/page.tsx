import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Community"
      title="Polls"
      description="Participate in community polls."
      icon="◉"
      api="/api/community/feed"
    />
  );
}
