import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Projects"
      title="Teams"
      description="Explore project teams and collaboration."
      icon="♧"
      api="/api/projects"
    />
  );
}
