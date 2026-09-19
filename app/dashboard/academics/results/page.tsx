import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Academics"
      title="Results"
      description="Published academic results with the School OS release lock."
      icon="◉"
      api="/api/grades"
    />
  );
}
