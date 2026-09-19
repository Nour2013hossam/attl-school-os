import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Teacher OS"
      title="Attendance"
      description="Attendance records for your classes."
      icon="✓"
      api="/api/teacher/attendance"
    />
  );
}
