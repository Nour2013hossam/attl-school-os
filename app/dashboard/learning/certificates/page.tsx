import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Learning"
      title="Certificates"
      description="Track certificates earned from completed learning experiences."
      icon="✦"
      api="/api/courses"
    />
  );
}
