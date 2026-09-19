import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Teacher OS"
      title="Teacher Overview"
      description="A role-specific teacher command surface."
      icon="⌘"
      api="/api/teacher/overview"
    />
  );
}
