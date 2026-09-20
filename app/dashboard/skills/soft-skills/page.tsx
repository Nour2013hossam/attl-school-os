import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Development"
      title="Soft Skills"
      description="Your communication, teamwork and personal development workspace."
      icon="♡"
      api="/api/skills"
      actions={[{ label: "Skill Map", href: "/dashboard/skills/skill-map" }, { label: "Growth", href: "/dashboard/skills/growth" }]}
    />
  );
}
