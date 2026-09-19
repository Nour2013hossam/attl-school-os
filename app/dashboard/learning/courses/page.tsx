import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Learning"
      title="Courses"
      description="Browse published learning courses connected to the School OS."
      icon="▦"
      api="/api/courses"
    />
  );
}
