import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Teacher OS"
      title="Teacher Overview"
      description="A role-specific teacher command surface."
      icon="⌘"
      api="/api/teacher/overview"
      actions={[{ label: "Gradebook", href: "/dashboard/teacher/gradebook" }, { label: "Assignments", href: "/dashboard/teacher/assignments" }, { label: "Exams", href: "/dashboard/teacher/exams" }, { label: "Reports", href: "/dashboard/teacher/reports" }]}
    />
  );
}
