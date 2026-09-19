import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Learning"
      title="Explore"
      description="Discover courses and learning resources."
      icon="▦"
      api="/api/courses"
    />
  );
}
