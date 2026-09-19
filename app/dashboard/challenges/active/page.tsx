import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Challenges"
      title="Active"
      description="Track challenges currently available to you."
      icon="●"
      api="/api/challenges"
    />
  );
}
