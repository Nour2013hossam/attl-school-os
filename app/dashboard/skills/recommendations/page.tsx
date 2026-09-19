import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Development"
      title="Recommendations"
      description="Explore skill directions based on your current profile."
      icon="★"
      api="/api/skills"
    />
  );
}
