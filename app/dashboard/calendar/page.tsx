import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Workspace"
      title="Calendar"
      description="Bring your academic and School OS schedule into one view."
      icon="⌂"
      api="/api/events"
    />
  );
}
