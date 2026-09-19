import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Admin OS"
      title="Permissions"
      description="Review role-driven access controls."
      icon="◈"
      api="/api/admin/users"
    />
  );
}
