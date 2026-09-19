import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Teacher OS"
      title="Reports"
      description="Teaching and academic reporting workspace."
      icon="▥"
      api="/api/teacher/overview"
    />
  );
}
