import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Teacher OS"
      title="Teaching Schedule"
      description="Your assigned teaching timetable."
      icon="◷"
      api="/api/teacher/classes"
      actions={[{ label: "Gradebook", href: "/dashboard/teacher/gradebook" }, { label: "Attendance", href: "/dashboard/teacher/attendance" }, { label: "Exams", href: "/dashboard/teacher/exams" }]}
    />
  );
}
