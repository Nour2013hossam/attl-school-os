import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Teacher OS"
      title="Students"
      description="Students connected to your taught subjects."
      icon="●"
      api="/api/teacher/students"
      actions={[{ label: "Classes", href: "/dashboard/teacher/classes" }, { label: "Gradebook", href: "/dashboard/teacher/gradebook" }, { label: "Attendance", href: "/dashboard/teacher/attendance" }]}
    />
  );
}
