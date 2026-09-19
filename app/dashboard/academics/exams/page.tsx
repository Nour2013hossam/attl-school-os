import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Academics"
      title="Exams"
      description="Your upcoming published exams and exam schedule."
      icon="△"
      api="/api/exams"
    />
  );
}
