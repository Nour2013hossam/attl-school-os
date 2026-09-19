import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Admin OS"
      title="Competitions"
      description="Manage competition records and opportunities."
      icon="★"
      api="/api/competitions"
    />
  );
}
