import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Academics"
      title="Deadlines"
      description="Academic work ordered around upcoming deadlines."
      icon="!"
      api="/api/assignments"
    />
  );
}
