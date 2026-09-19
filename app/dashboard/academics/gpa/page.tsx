import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Academics"
      title="GPA"
      description="Term-level GPA calculated from published grades and subject credits."
      icon="↗"
      api="/api/gpa"
    />
  );
}
