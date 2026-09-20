import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Development"
      title="Recommendations"
      description="Explore skill directions based on your current profile."
      icon="★"
      api="/api/skills"
      actions={[{ label: "My Skills", href: "/dashboard/skills/my-skills" }, { label: "Technical", href: "/dashboard/skills/technical" }, { label: "Soft Skills", href: "/dashboard/skills/soft-skills" }]}
    />
  );
}
