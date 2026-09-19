import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Admin OS"
      title="Analytics"
      description="Review aggregate School OS activity."
      icon="▥"
      api="/api/dashboard"
    />
  );
}
