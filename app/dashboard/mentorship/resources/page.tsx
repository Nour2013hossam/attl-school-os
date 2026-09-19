import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Mentorship"
      title="Resources"
      description="Access resources shared through mentorship."
      icon="▤"
      api="/api/mentorship/requests"
    />
  );
}
