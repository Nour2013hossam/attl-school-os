import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Mentorship"
      title="Progress"
      description="Track progress across your mentorship journey."
      icon="◔"
      api="/api/mentorship/requests"
    />
  );
}
