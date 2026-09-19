import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Learning"
      title="Bookmarks"
      description="Keep important learning resources close at hand."
      icon="◇"
      api="/api/courses"
    />
  );
}
