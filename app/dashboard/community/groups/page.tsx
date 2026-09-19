import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Community"
      title="Groups"
      description="Find student communities and groups."
      icon="♧"
      api="/api/community/feed"
    />
  );
}
