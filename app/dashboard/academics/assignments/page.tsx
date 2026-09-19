import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Academics"
      title="Assignments"
      description="Your assignments, deadlines and submission status."
      icon="□"
      api="/api/assignments"
    />
  );
}
