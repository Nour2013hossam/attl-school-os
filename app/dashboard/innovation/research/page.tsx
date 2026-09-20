import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Innovation"
      title="Research"
      description="Organize research topics and innovation work."
      icon="⌕"
      api="/api/ideas"
      actions={[{ label: "Explore ideas", href: "/dashboard/innovation/ideas" }, { label: "Innovation lab", href: "/dashboard/innovation/lab" }]}
    />
  );
}
