import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Academics"
      title="Transcript"
      description="Your published academic transcript across terms."
      icon="▧"
      api="/api/transcript"
    />
  );
}
