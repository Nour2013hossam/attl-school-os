import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Development"
      title="My Skills"
      description="Your current skill profile and development record."
      icon="◇"
      api="/api/skills"
    />
  );
}
