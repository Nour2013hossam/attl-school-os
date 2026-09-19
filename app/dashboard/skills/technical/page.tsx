import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Development"
      title="Technical Skills"
      description="Your technical skill development workspace."
      icon="⌘"
      api="/api/skills"
    />
  );
}
