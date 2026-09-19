import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Community"
      title="Discussions"
      description="Participate in structured student discussions."
      icon="◌"
      api="/api/community/feed"
    />
  );
}
