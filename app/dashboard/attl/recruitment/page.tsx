import { PageShell } from "@/components/shared/page-shell";

export default function Page() {
  return (
    <PageShell
      eyebrow="Attl"
      title="Recruitment"
      description="A dedicated workspace inside ATTL School OS for managing your Recruitment experience."
      icon="○"
      stats={[
        { label: "Progress", value: "68%" },
        { label: "Active", value: "12" },
        { label: "Completed", value: "24" },
        { label: "XP", value: "1,240" },
      ]}
      cards={[
        {
          title: "Overview",
          description: "Get a clear view of your current progress and important information.",
          icon: "◈",
        },
        {
          title: "Continue",
          description: "Pick up where you left off and continue your current journey.",
          icon: "→",
        },
        {
          title: "Explore",
          description: "Discover new opportunities, resources, projects and activities.",
          icon: "✦",
        },
        {
          title: "Recent Activity",
          description: "Review the latest activity connected to this section.",
          icon: "◌",
        },
        {
          title: "Progress",
          description: "Track development, milestones and achievements over time.",
          icon: "↗",
        },
        {
          title: "Insights",
          description: "Understand patterns and useful insights from your activity.",
          icon: "◎",
        },
      ]}
    />
  );
}
