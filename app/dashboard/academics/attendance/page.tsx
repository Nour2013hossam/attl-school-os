import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Academics"
      title="Attendance"
      description="Your attendance record across enrolled subjects."
      icon="✓"
      api="/api/attendance"
    />
  );
}
