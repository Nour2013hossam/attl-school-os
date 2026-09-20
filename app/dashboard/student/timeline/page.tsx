import { LiveWorkspace } from "@/components/shared/live-workspace";
export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Student Journey"
      title="Your timeline."
      description="A live chronological view built from your School OS activity, projects, goals, achievements and certificates."
      icon="◷"
      api="/api/student/timeline"
      actions={[{ label: "Activity", href: "/dashboard/student/activity" }, { label: "Portfolio", href: "/dashboard/student/portfolio" }]}
    />
  );
}
