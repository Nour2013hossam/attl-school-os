import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Mentorship"
      title="Requests"
      description="Track mentorship requests you made or received."
      icon="↗"
      api="/api/mentorship/requests"
    />
  );
}
