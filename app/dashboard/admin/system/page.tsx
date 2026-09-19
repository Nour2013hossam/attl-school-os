import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Admin OS"
      title="System"
      description="System status and connected backend surfaces."
      icon="⚙"
      api="/api/health"
    />
  );
}
