import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Admin OS"
      title="Teachers"
      description="Manage teacher accounts and assignments."
      icon="♙"
      api="/api/admin/users"
    />
  );
}
