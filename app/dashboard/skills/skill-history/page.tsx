import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Development"
      title="Skill History"
      description="Review the evolution of your skills."
      icon="◷"
      api="/api/skills"
    />
  );
}
