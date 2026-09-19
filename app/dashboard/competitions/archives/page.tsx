import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Competitions"
      title="Archives"
      description="Explore archived competition records."
      icon="▥"
      api="/api/competitions"
    />
  );
}
