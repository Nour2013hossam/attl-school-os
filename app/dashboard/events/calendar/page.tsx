import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Events"
      title="Calendar"
      description="Plan around School OS events and activities."
      icon="□"
      api="/api/events"
    />
  );
}
