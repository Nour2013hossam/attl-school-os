import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Admin OS"
      title="Audit Logs"
      description="Inspect protected system activity recorded by School OS."
      icon="◌"
      api="/api/admin/audit-logs"
    />
  );
}
