import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Innovation"
      title="Innovation Lab"
      description="Your innovation workspace."
      icon="◇"
      api="/api/ideas"
    />
  );
}
