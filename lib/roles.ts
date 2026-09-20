export const ROLE_DEFINITIONS = [
  { role: "STUDENT", label: "Student", scope: "Personal academics, learning, projects and community." },
  { role: "ATTL_MEMBER", label: "ATTL Member", scope: "ATTL operations plus student access." },
  { role: "TRACK_LEAD", label: "Track Lead", scope: "ATTL recruitment, review and track operations." },
  { role: "TEACHER", label: "Teacher", scope: "Teaching, gradebook, attendance, exams and assignments." },
  { role: "ADMIN", label: "Admin", scope: "School-wide operational and administrative management." },
  { role: "SUPER_ADMIN", label: "Super Admin", scope: "Full system administration." },
] as const;

export const PERMISSION_MATRIX: Record<string, string[]> = {
  STUDENT: ["profile:read", "profile:write", "academics:read", "learning:read", "projects:create", "projects:participate", "competitions:apply", "events:register", "community:participate", "mentorship:request", "challenges:participate", "attl:apply"],
  ATTL_MEMBER: ["profile:*", "academics:read", "learning:read", "projects:*", "competitions:apply", "events:*", "community:*", "mentorship:*", "challenges:*", "attl:operations"],
  TRACK_LEAD: ["profile:*", "academics:read", "learning:*", "projects:*", "competitions:*", "events:*", "community:*", "mentorship:*", "challenges:*", "attl:review", "attl:tracks"],
  TEACHER: ["profile:*", "academics:teaching", "academics:gradebook", "academics:attendance", "academics:assignments", "academics:exams", "learning:teaching", "messages:*"],
  ADMIN: ["users:*", "roles:manage", "permissions:manage", "academics:*", "attl:*", "projects:*", "competitions:*", "events:*", "analytics:*", "audit:read", "security:manage", "system:manage"],
  SUPER_ADMIN: ["*"],
};
