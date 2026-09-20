import { LiveWorkspace } from "@/components/shared/live-workspace";

export default function Page() {
  return (
    <LiveWorkspace
      eyebrow="Learning"
      title="Resources"
      description="Find learning resources connected to your School OS courses."
      icon="▤"
      api="/api/courses"
      actions={[{ label: "Bookmarks", href: "/dashboard/learning/bookmarks" }, { label: "My Courses", href: "/dashboard/learning/my-courses" }]}
    />
  );
}
