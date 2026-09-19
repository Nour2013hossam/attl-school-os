import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Projects"
      title="My Projects"
      description="Manage projects you own or collaborate on."
      icon="▣"
      api="/api/projects"
    />
  );
}
