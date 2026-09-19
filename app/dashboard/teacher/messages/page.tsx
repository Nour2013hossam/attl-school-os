import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Teacher OS"
      title="Messages"
      description="Teacher communication workspace."
      icon="✉"
      api="/api/mentorship/requests"
    />
  );
}
