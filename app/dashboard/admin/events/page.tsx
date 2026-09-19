import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Admin OS"
      title="Events"
      description="Manage School OS events and registrations."
      icon="◷"
      api="/api/events"
    />
  );
}
