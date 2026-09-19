import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Events"
      title="My Events"
      description="See the school events you are registered for."
      icon="★"
      api="/api/events/my"
    />
  );
}
