import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Admin OS"
      title="Roles"
      description="Manage the School OS role model."
      icon="◆"
      api="/api/admin/users"
    />
  );
}
