import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Learning"
      title="Library"
      description="Your shared School OS learning library."
      icon="▥"
      api="/api/courses"
    />
  );
}
