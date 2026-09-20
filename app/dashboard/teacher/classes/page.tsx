import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Teacher OS"
      title="Classes"
      description="Classes and teaching blocks assigned to you."
      icon="▤"
      api="/api/teacher/classes"
      actions={[{ label: "Students", href: "/dashboard/teacher/students" }, { label: "Assignments", href: "/dashboard/teacher/assignments" }, { label: "Reports", href: "/dashboard/teacher/reports" }]}
    />
  );
}
