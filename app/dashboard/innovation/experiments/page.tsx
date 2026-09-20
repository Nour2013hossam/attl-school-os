import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Innovation"
      title="Experiments"
      description="Track experiments connected to innovation work."
      icon="△"
      api="/api/ideas"
      actions={[{ label: "Browse ideas", href: "/dashboard/innovation/ideas" }, { label: "Submit idea", href: "/dashboard/innovation/submit" }]}
    />
  );
}
