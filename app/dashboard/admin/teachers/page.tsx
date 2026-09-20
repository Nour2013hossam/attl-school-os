import { LiveWorkspace } from "@/components/shared/live-workspace";
export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Admin OS"
      title="Teachers"
      description="Live teacher directory with teaching activity and account state."
      icon="♙"
      api="/api/admin/teachers"
      actions={[{ label: "Users", href: "/dashboard/admin/users" }, { label: "Teacher reports", href: "/dashboard/teacher/reports" }]}
    />
  );
}
