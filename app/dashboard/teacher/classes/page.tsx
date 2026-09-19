import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Teacher OS"
      title="Classes"
      description="Classes and teaching blocks assigned to you."
      icon="▤"
      api="/api/teacher/classes"
    />
  );
}
