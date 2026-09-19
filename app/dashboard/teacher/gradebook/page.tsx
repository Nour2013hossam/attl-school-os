import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Teacher OS"
      title="Gradebook"
      description="Grade records for the subjects you teach."
      icon="◆"
      api="/api/teacher/gradebook"
    />
  );
}
