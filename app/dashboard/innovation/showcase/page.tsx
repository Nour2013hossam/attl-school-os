import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Innovation"
      title="Innovation Showcase"
      description="Present ideas and experiments."
      icon="★"
      api="/api/projects"
      actions={[{ label: "Project showcase", href: "/dashboard/projects/showcase" }, { label: "Innovation lab", href: "/dashboard/innovation/lab" }]}
    />
  );
}
