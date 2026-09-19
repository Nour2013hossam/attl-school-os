import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Academics"
      title="Academic Calendar"
      description="Academic schedule and school events in one workspace."
      icon="□"
      api="/api/events"
    />
  );
}
