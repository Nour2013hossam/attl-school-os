"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { usePreferences, translateLabel } from "@/components/providers/preferences-provider";
import { permissionForRoute } from "@/lib/permission-routes";

const sections = [
  {
    label: "Workspace",
    items: [
      { label: "Overview", href: "/dashboard", icon: "⌂" },
      { label: "My Profile", href: "/dashboard/student/profile", icon: "●" },
      { label: "Identity", href: "/dashboard/student/identity", icon: "◇" },
      { label: "Timeline", href: "/dashboard/student/timeline", icon: "◷" },
      { label: "Activity", href: "/dashboard/student/activity", icon: "↗" },
      { label: "Achievements", href: "/dashboard/student/achievements", icon: "★" },
      { label: "XP", href: "/dashboard/student/xp", icon: "✦" },
      { label: "Level", href: "/dashboard/student/level", icon: "↑" },
      { label: "Goals", href: "/dashboard/student/goals", icon: "◎" },
      { label: "Interests", href: "/dashboard/student/interests", icon: "♡" },
      { label: "Portfolio", href: "/dashboard/student/portfolio", icon: "▣" },
      { label: "Notifications", href: "/dashboard/notifications", icon: "●" },
      { label: "Messages", href: "/dashboard/messages", icon: "✉" },
      { label: "Search", href: "/dashboard/search", icon: "⌕" },
      { label: "Calendar", href: "/dashboard/calendar", icon: "□" },
    ],
  },
  {
    label: "Academic",
    items: [
      { label: "Academic Overview", href: "/dashboard/academics/overview", icon: "⌘" },
      { label: "Grades", href: "/dashboard/academics/grades", icon: "◆" },
      { label: "Subjects", href: "/dashboard/academics/subjects", icon: "▤" },
      { label: "Schedule", href: "/dashboard/academics/schedule", icon: "◷" },
      { label: "Exams", href: "/dashboard/academics/exams", icon: "△" },
      { label: "Attendance", href: "/dashboard/academics/attendance", icon: "✓" },
      { label: "Results", href: "/dashboard/academics/results", icon: "◉" },
      { label: "Transcript", href: "/dashboard/academics/transcript", icon: "▧" },
      { label: "GPA", href: "/dashboard/academics/gpa", icon: "↗" },
      { label: "Assignments", href: "/dashboard/academics/assignments", icon: "□" },
      { label: "Deadlines", href: "/dashboard/academics/deadlines", icon: "!" },
      { label: "Teachers", href: "/dashboard/academics/teachers", icon: "♙" },
      { label: "Academic Calendar", href: "/dashboard/academics/calendar", icon: "□" },
      { label: "Reports", href: "/dashboard/academics/reports", icon: "▥" },
    ],
  },
  {
    label: "Learning",
    items: [
      { label: "Courses", href: "/dashboard/learning/courses", icon: "▦" },
      { label: "My Courses", href: "/dashboard/learning/my-courses", icon: "▣" },
      { label: "Explore", href: "/dashboard/learning/explore", icon: "⌕" },
      { label: "Lessons", href: "/dashboard/learning/lessons", icon: "▶" },
      { label: "Resources", href: "/dashboard/learning/resources", icon: "▤" },
      { label: "Roadmaps", href: "/dashboard/learning/roadmaps", icon: "↗" },
      { label: "Progress", href: "/dashboard/learning/progress", icon: "◔" },
      { label: "Bookmarks", href: "/dashboard/learning/bookmarks", icon: "◇" },
      { label: "Certificates", href: "/dashboard/learning/certificates", icon: "✦" },
      { label: "Library", href: "/dashboard/learning/library", icon: "▥" },
      { label: "Course Studio", href: "/dashboard/learning/studio", icon: "✦" },
    ],
  },
  {
    label: "Development",
    items: [
      { label: "Skill Map", href: "/dashboard/skills/skill-map", icon: "✧" },
      { label: "My Skills", href: "/dashboard/skills/my-skills", icon: "◇" },
      { label: "Assessments", href: "/dashboard/skills/assessments", icon: "✓" },
      { label: "Growth", href: "/dashboard/skills/growth", icon: "↗" },
      { label: "Recommendations", href: "/dashboard/skills/recommendations", icon: "★" },
      { label: "Technical Skills", href: "/dashboard/skills/technical", icon: "⌘" },
      { label: "Soft Skills", href: "/dashboard/skills/soft-skills", icon: "♡" },
      { label: "Skill History", href: "/dashboard/skills/skill-history", icon: "◷" },
    ],
  },
  {
    label: "Projects",
    items: [
      { label: "All Projects", href: "/dashboard/projects/all", icon: "▦" },
      { label: "My Projects", href: "/dashboard/projects/my-projects", icon: "▣" },
      { label: "Create Project", href: "/dashboard/projects/create", icon: "+" },
      { label: "Discover", href: "/dashboard/projects/discover", icon: "⌕" },
      { label: "Templates", href: "/dashboard/projects/templates", icon: "▤" },
      { label: "Teams", href: "/dashboard/projects/teams", icon: "♧" },
      { label: "Tasks", href: "/dashboard/projects/tasks", icon: "✓" },
      { label: "Milestones", href: "/dashboard/projects/milestones", icon: "◆" },
      { label: "Showcase", href: "/dashboard/projects/showcase", icon: "✦" },
      { label: "Analytics", href: "/dashboard/projects/analytics", icon: "▥" },
    ],
  },
  {
    label: "Competitions",
    items: [
      { label: "Explore", href: "/dashboard/competitions/explore", icon: "⌕" },
      { label: "Upcoming", href: "/dashboard/competitions/upcoming", icon: "◷" },
      { label: "My Competitions", href: "/dashboard/competitions/my-competitions", icon: "★" },
      { label: "Applications", href: "/dashboard/competitions/applications", icon: "□" },
      { label: "Results", href: "/dashboard/competitions/results", icon: "◆" },
      { label: "Challenges", href: "/dashboard/competitions/challenges", icon: "△" },
      { label: "Calendar", href: "/dashboard/competitions/calendar", icon: "□" },
      { label: "Archives", href: "/dashboard/competitions/archives", icon: "▥" },
    ],
  },
  {
    label: "ATTL",
    items: [
      { label: "ATTL Overview", href: "/dashboard/attl/overview", icon: "A" },
      { label: "Command Center", href: "/dashboard/attl/command-center", icon: "⌘" },
      { label: "Team", href: "/dashboard/attl/team", icon: "♧" },
      { label: "Members", href: "/dashboard/attl/members", icon: "●" },
      { label: "Tracks", href: "/dashboard/attl/tracks", icon: "◇" },
      { label: "Applications", href: "/dashboard/attl/applications", icon: "□" },
      { label: "Recruitment", href: "/dashboard/attl/recruitment", icon: "↗" },
      { label: "Projects", href: "/dashboard/attl/projects", icon: "▣" },
      { label: "Events", href: "/dashboard/attl/events", icon: "◷" },
      { label: "Workshops", href: "/dashboard/attl/workshops", icon: "▤" },
      { label: "Resources", href: "/dashboard/attl/resources", icon: "▥" },
      { label: "Showcase", href: "/dashboard/attl/showcase", icon: "✦" },
    ],
  },
  {
    label: "Innovation",
    items: [
      { label: "Ideas", href: "/dashboard/innovation/ideas", icon: "✦" },
      { label: "Submit Idea", href: "/dashboard/innovation/submit", icon: "+" },
      { label: "Experiments", href: "/dashboard/innovation/experiments", icon: "△" },
      { label: "Research", href: "/dashboard/innovation/research", icon: "⌕" },
      { label: "Innovation Lab", href: "/dashboard/innovation/lab", icon: "◇" },
      { label: "Showcase", href: "/dashboard/innovation/showcase", icon: "★" },
      { label: "Challenges", href: "/dashboard/innovation/challenges", icon: "◆" },
    ],
  },
  {
    label: "Community",
    items: [
      { label: "Feed", href: "/dashboard/community/feed", icon: "⌂" },
      { label: "Discussions", href: "/dashboard/community/discussions", icon: "◌" },
      { label: "Groups", href: "/dashboard/community/groups", icon: "♧" },
      { label: "People", href: "/dashboard/community/people", icon: "●" },
      { label: "Messages", href: "/dashboard/community/messages", icon: "✉" },
      { label: "Announcements", href: "/dashboard/community/announcements", icon: "!" },
      { label: "Polls", href: "/dashboard/community/polls", icon: "◉" },
    ],
  },
  {
    label: "Mentorship",
    items: [
      { label: "Mentors", href: "/dashboard/mentorship/mentors", icon: "♙" },
      { label: "Requests", href: "/dashboard/mentorship/requests", icon: "↗" },
      { label: "Sessions", href: "/dashboard/mentorship/sessions", icon: "◷" },
      { label: "Progress", href: "/dashboard/mentorship/progress", icon: "◔" },
      { label: "Resources", href: "/dashboard/mentorship/resources", icon: "▤" },
    ],
  },
  {
    label: "Events",
    items: [
      { label: "Calendar", href: "/dashboard/events/calendar", icon: "□" },
      { label: "Discover", href: "/dashboard/events/discover", icon: "⌕" },
      { label: "Upcoming", href: "/dashboard/events/upcoming", icon: "◷" },
      { label: "My Events", href: "/dashboard/events/my-events", icon: "★" },
      { label: "History", href: "/dashboard/events/history", icon: "↺" },
    ],
  },
  {
    label: "Challenges",
    items: [
      { label: "Explore", href: "/dashboard/challenges/explore", icon: "⌕" },
      { label: "Active", href: "/dashboard/challenges/active", icon: "●" },
      { label: "My Challenges", href: "/dashboard/challenges/my-challenges", icon: "◆" },
      { label: "Completed", href: "/dashboard/challenges/completed", icon: "✓" },
      { label: "Leaderboard", href: "/dashboard/challenges/leaderboard", icon: "★" },
      { label: "Create Challenge", href: "/dashboard/challenges/create", icon: "+" },
    ],
  },
  {
    label: "Teacher",
    items: [
      { label: "Teacher Overview", href: "/dashboard/teacher/overview", icon: "⌘" },
      { label: "Schedule", href: "/dashboard/teacher/schedule", icon: "◷" },
      { label: "Classes", href: "/dashboard/teacher/classes", icon: "▤" },
      { label: "Students", href: "/dashboard/teacher/students", icon: "●" },
      { label: "Gradebook", href: "/dashboard/teacher/gradebook", icon: "◆" },
      { label: "Attendance", href: "/dashboard/teacher/attendance", icon: "✓" },
      { label: "Assignments", href: "/dashboard/teacher/assignments", icon: "□" },
      { label: "Exams", href: "/dashboard/teacher/exams", icon: "△" },
      { label: "Reports", href: "/dashboard/teacher/reports", icon: "▥" },
      { label: "Messages", href: "/dashboard/teacher/messages", icon: "✉" },
    ],
  },
  {
    label: "Admin",
    items: [
      { label: "Overview", href: "/dashboard/admin/overview", icon: "⌘" },
      { label: "Users", href: "/dashboard/admin/users", icon: "●" },
      { label: "Students", href: "/dashboard/admin/students", icon: "♙" },
      { label: "Teachers", href: "/dashboard/admin/teachers", icon: "♙" },
      { label: "School", href: "/dashboard/admin/school", icon: "⌂" },
      { label: "Roles", href: "/dashboard/admin/roles", icon: "◇" },
      { label: "Permissions", href: "/dashboard/admin/permissions", icon: "◈" },
      { label: "Applications", href: "/dashboard/admin/applications", icon: "□" },
      { label: "Grades", href: "/dashboard/admin/grades", icon: "◆" },
      { label: "Result Release", href: "/dashboard/admin/results-release", icon: "◉" },
      { label: "Projects", href: "/dashboard/admin/projects", icon: "▣" },
      { label: "Competitions", href: "/dashboard/admin/competitions", icon: "★" },
      { label: "Events", href: "/dashboard/admin/events", icon: "◷" },
      { label: "Analytics", href: "/dashboard/admin/analytics", icon: "▥" },
      { label: "Audit Logs", href: "/dashboard/admin/audit-logs", icon: "◌" },
      { label: "Security", href: "/dashboard/admin/security", icon: "◇" },
      { label: "School Control", href: "/dashboard/admin/school", icon: "⌂" },
      { label: "System", href: "/dashboard/admin/system", icon: "⚙" },
    ],
  },
  {
    label: "Settings",
    items: [
      { label: "Account", href: "/dashboard/settings/account", icon: "●" },
      { label: "Security", href: "/dashboard/settings/security", icon: "◇" },
      { label: "Appearance", href: "/dashboard/settings/appearance", icon: "◐" },
      { label: "Language", href: "/dashboard/settings/language", icon: "文" },
      { label: "Notifications", href: "/dashboard/settings/notifications", icon: "●" },
      { label: "Privacy", href: "/dashboard/settings/privacy", icon: "◈" },
      { label: "Academic", href: "/dashboard/settings/academic", icon: "◆" },
      { label: "ATTL", href: "/dashboard/settings/attl", icon: "A" },
      { label: "Gamification", href: "/dashboard/settings/gamification", icon: "✦" },
      { label: "AI", href: "/dashboard/settings/ai", icon: "⌘" },
      { label: "Files", href: "/dashboard/settings/files", icon: "▤" },
      { label: "Integrations", href: "/dashboard/settings/integrations", icon: "↗" },
    ],
  },
];

export function DashboardNav({}: { role?: string }) {
  const pathname = usePathname();
  const { language, permissions, permissionsReady } = usePreferences();
  const requiredPermission = (href: string) => permissionForRoute(href);

  const isAllowed = (item: { href: string }) => {
    const permission = requiredPermission(item.href);
    if (!permission) return true;
    return permissionsReady && permissions[permission] === true;
  };

  const visibleSections = sections
    .map((section) => ({
      ...section,
      items: section.items.filter(isAllowed),
    }))
    .filter((section) => section.items.length > 0);
  const [openSections, setOpenSections] = useState<string[]>([]);

  useEffect(() => {
    const activeSection = sections.find((section) =>
      section.items.some(
        (item) =>
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href))
      )
    );

    if (activeSection) {
      setOpenSections((current) =>
        current.includes(activeSection.label)
          ? current
          : [...current, activeSection.label]
      );
    }
  }, [pathname]);

  const toggleSection = (label: string) => {
    setOpenSections((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label]
    );
  };

  return (
    <nav className="h-full min-h-0 overflow-y-auto pr-1 overscroll-contain dashboard-sidebar-scroll">
      <div className="space-y-2 pb-8">

        {visibleSections.map((section) => {
          const open = openSections.includes(section.label);

          const hasActiveItem = section.items.some(
            (item) =>
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                pathname.startsWith(item.href))
          );

          return (
            <div key={section.label} className="overflow-hidden rounded-[17px]">

              <button
                type="button"
                onClick={() => toggleSection(section.label)}
                className={`group flex w-full items-center gap-2 rounded-[15px] px-3 py-2.5 text-left transition-all duration-300 ${
                  hasActiveItem
                    ? "bg-white/65 text-black shadow-[0_8px_25px_rgba(20,30,50,0.05)]"
                    : "text-black/45 hover:bg-white/45 hover:text-black/70"
                }`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[10px] bg-black/[0.035] text-[10px] text-black/40">
                  {section.label === "Workspace" ? "⌂" :
                   section.label === "Academic" ? "◆" :
                   section.label === "Learning" ? "▦" :
                   section.label === "Development" ? "✧" :
                   section.label === "Projects" ? "▣" :
                   section.label === "Competitions" ? "★" :
                   section.label === "ATTL" ? "A" :
                   section.label === "Innovation" ? "✦" :
                   section.label === "Community" ? "●" :
                   section.label === "Mentorship" ? "♙" :
                   section.label === "Events" ? "◷" :
                   section.label === "Challenges" ? "△" :
                   "⚙"}
                </span>

                <span className="flex-1 text-[9px] font-semibold uppercase tracking-[0.16em]">
                  {translateLabel(section.label, language)}
                </span>

                <span
                  className={`text-[10px] text-black/25 transition-transform duration-300 ${
                    open ? "rotate-90" : ""
                  }`}
                >
                  →
                </span>
              </button>

              <div
                className={`grid transition-all duration-300 ease-out ${
                  open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="min-h-0 overflow-hidden pt-1">
                  <div className="space-y-1 pl-2">
                    {section.items.map((item) => {
                      const active =
                        pathname === item.href ||
                        (item.href !== "/dashboard" &&
                          pathname.startsWith(item.href));

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`group relative flex h-9 items-center gap-3 overflow-hidden rounded-[14px] px-3 transition-all duration-300 ${
                            active
                              ? "text-black"
                              : "text-black/40 hover:bg-white/50 hover:text-black/70"
                          }`}
                        >
                          {active && (
                            <span className="absolute inset-0 rounded-[14px] border border-white/90 bg-white/75 shadow-[0_8px_25px_rgba(20,30,50,0.08),inset_0_1px_0_white] backdrop-blur-xl" />
                          )}

                          {active && (
                            <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-blue-500 shadow-[0_0_14px_rgba(59,130,246,.65)]" />
                          )}

                          <span
                            className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-[9px] text-[9px] ${
                              active
                                ? "bg-black text-white shadow-lg"
                                : "bg-black/[0.035] text-black/35 group-hover:bg-white group-hover:text-black"
                            }`}
                          >
                            {item.icon}
                          </span>

                          <span className="relative z-10 flex-1 text-[9px] font-medium">
                            {translateLabel(item.label, language)}
                          </span>

                          {active && (
                            <span className="relative z-10 h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,.65)]" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

      </div>
    </nav>
  );
}
