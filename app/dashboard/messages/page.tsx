import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Communication"
      title="Messages"
      description="Authenticated message threads and direct communication inside School OS."
      icon="✉"
      api="/api/messages"
    />
  );
}
