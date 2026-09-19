import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Learning"
      title="Progress"
      description="Monitor learning progress across your active courses."
      icon="◔"
      api="/api/courses"
    />
  );
}
