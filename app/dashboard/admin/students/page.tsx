import { LiveWorkspace } from "@/components/shared/live-workspace";
export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Admin OS"
      title="Students"
      description="Live student directory with class, ATTL, portfolio and participation signals."
      icon="●"
      api="/api/admin/students"
      actions={[{ label: "Users", href: "/dashboard/admin/users" }, { label: "Grades", href: "/dashboard/admin/grades" }]}
    />
  );
}
