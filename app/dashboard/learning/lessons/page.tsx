import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Learning"
      title="Lessons"
      description="Continue through structured lessons from your courses."
      icon="▦"
      api="/api/courses"
    />
  );
}
