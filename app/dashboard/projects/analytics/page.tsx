import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Projects"
      title="Analytics"
      description="Review project activity and progress signals."
      icon="▥"
      api="/api/projects"
    />
  );
}
