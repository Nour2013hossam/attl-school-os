import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Challenges"
      title="Explore"
      description="Discover active School OS challenges."
      icon="⌕"
      api="/api/challenges"
    />
  );
}
