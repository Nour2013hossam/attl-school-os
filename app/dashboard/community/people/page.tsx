import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Community"
      title="People"
      description="Discover students and school community members."
      icon="●"
      api="/api/community/feed"
    />
  );
}
