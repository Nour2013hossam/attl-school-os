import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Projects"
      title="Showcase"
      description="Present project work as a School OS portfolio."
      icon="✦"
      api="/api/projects"
    />
  );
}
