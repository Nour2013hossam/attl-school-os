import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Competitions"
      title="Calendar"
      description="See competition dates and application deadlines."
      icon="□"
      api="/api/competitions"
    />
  );
}
