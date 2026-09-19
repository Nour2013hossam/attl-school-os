import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Admin OS"
      title="Security"
      description="Review protected system and account security surfaces."
      icon="◇"
      api="/api/admin/audit-logs"
    />
  );
}
