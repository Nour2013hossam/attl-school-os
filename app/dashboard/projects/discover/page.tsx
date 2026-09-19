import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Projects"
      title="Discover"
      description="Discover project workspaces and collaboration opportunities."
      icon="⌕"
      api="/api/projects"
    />
  );
}
