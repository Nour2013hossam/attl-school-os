import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Development"
      title="Assessments"
      description="Measure and update your skills with structured assessments."
      icon="✓"
      api="/api/skills"
      actions={[{ label: "My Skills", href: "/dashboard/skills/my-skills" }, { label: "Growth", href: "/dashboard/skills/growth" }]}
    />
  );
}
