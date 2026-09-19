import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Learning"
      title="My Courses"
      description="Track the courses you are currently learning."
      icon="▦"
      api="/api/courses"
    />
  );
}
