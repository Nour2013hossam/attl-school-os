import { LiveWorkspace } from "@/components/shared/live-workspace";
export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Student Workspace"
      title="Activity"
      description="Your latest notifications, project changes, learning progress and achievements."
      icon="↗"
      api="/api/student/activity"
      actions={[{ label: "Timeline", href: "/dashboard/student/timeline" }, { label: "Notifications", href: "/dashboard/notifications" }]}
    />
  );
}
