import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Admin OS"
      title="Students"
      description="Manage student accounts and academic records."
      icon="●"
      api="/api/admin/users"
    />
  );
}
