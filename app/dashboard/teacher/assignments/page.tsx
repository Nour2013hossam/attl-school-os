import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Teacher OS"
      title="Assignments"
      description="Assignments and submission signals across your subjects."
      icon="□"
      api="/api/teacher/assignments"
    />
  );
}
