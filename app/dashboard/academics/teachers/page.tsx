import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Academics"
      title="Teachers"
      description="Teacher information connected to your academic workspace."
      icon="♙"
      api="/api/teachers"
    />
  );
}
