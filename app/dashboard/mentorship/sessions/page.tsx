import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Mentorship"
      title="Sessions"
      description="Review mentorship sessions connected to your requests."
      icon="◷"
      api="/api/mentorship/requests"
    />
  );
}
