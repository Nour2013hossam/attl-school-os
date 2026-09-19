import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Academics"
      title="Academic Reports"
      description="Reports built from your connected academic records."
      icon="▥"
      api="/api/me"
    />
  );
}
