import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Community"
      title="Announcements"
      description="Read important community announcements."
      icon="!"
      api="/api/community/feed"
    />
  );
}
