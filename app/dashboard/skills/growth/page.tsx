import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Development"
      title="Growth"
      description="Track how your skills develop over time."
      icon="↗"
      api="/api/skills"
      actions={[{ label: "Skill Map", href: "/dashboard/skills/skill-map" }, { label: "History", href: "/dashboard/skills/skill-history" }]}
    />
  );
}
