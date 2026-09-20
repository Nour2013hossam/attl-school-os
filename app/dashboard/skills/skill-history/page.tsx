import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Development"
      title="Skill History"
      description="Review the evolution of your skills."
      icon="◷"
      api="/api/skills"
      actions={[{ label: "Growth", href: "/dashboard/skills/growth" }, { label: "My Skills", href: "/dashboard/skills/my-skills" }]}
    />
  );
}
