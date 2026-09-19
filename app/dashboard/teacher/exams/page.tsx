import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Teacher OS"
      title="Exams"
      description="Exam records connected to your teaching schedule."
      icon="△"
      api="/api/exams"
    />
  );
}
