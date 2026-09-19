import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="ATTL"
      title="ATTL Projects"
      description="Projects connected to ATTL members."
      icon="▣"
      api="/api/projects"
    />
  );
}
