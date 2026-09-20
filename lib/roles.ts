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
  TRACK_LEAD: ["profile:*", "academics:read", "learning:*", "projects:*", "competitions:*", "events:*", "community:*", "mentorship:*", "challenges:*", "attl:review", "attl:tracks", "attl.tracks.manage", "attl.team.manage"],
  TEACHER: ["profile:*", "academics:teaching", "academics:gradebook", "academics:attendance", "academics:assignments", "academics:exams", "learning:teaching", "messages:*"],
  ADMIN: ["users:*", "roles:*", "permissions:*", "results:*", "academics:*", "attl:*", "projects:*", "competitions:*", "events:*", "analytics:*", "audit:read", "security:manage", "system:manage"],
  SUPER_ADMIN: ["*"],
};


export const PERMISSION_CATALOG = [
  ["profile.read","View profile","Profile"],["profile.write","Edit profile","Profile"],
  ["academics.read","View academic records","Academics"],["academics.grades.write","Enter and update grades","Academics"],
  ["academics.attendance.write","Manage attendance","Academics"],["academics.assignments.manage","Manage assignments","Academics"],
  ["academics.exams.manage","Manage exams","Academics"],["results.release","Release academic results","Academics"],
  ["learning.read","Access learning content","Learning"],["learning.manage","Manage learning content","Learning"],
  ["projects.create","Create projects","Projects"],["projects.manage","Manage projects","Projects"],
  ["projects.tasks.manage","Manage project tasks","Projects"],["projects.members.manage","Manage project members","Projects"],
  ["competitions.apply","Apply to competitions","Competitions"],["competitions.manage","Manage competitions","Competitions"],
  ["events.register","Register for events","Events"],["events.manage","Manage events","Events"],
  ["attl.apply","Apply to ATTL","ATTL"],["attl.review","Review ATTL applications","ATTL"],
  ["attl.tracks.manage","Manage ATTL tracks","ATTL"],["attl.team.manage","Manage ATTL team","ATTL"],
  ["innovation.submit","Submit innovation ideas","Innovation"],["innovation.manage","Manage innovation workflows","Innovation"],
  ["community.participate","Use community","Community"],["community.moderate","Moderate community","Community"],
  ["mentorship.request","Request mentorship","Mentorship"],["mentorship.manage","Manage mentorship","Mentorship"],
  ["challenges.participate","Participate in challenges","Challenges"],["challenges.manage","Manage challenges","Challenges"],
  ["users.read","View users","Administration"],["users.manage","Manage users","Administration"],
  ["roles.read","View roles","Administration"],["roles.assign","Assign roles","Administration"],
  ["permissions.read","View permissions","Administration"],["permissions.manage","Manage user overrides","Administration"],
  ["audit.read","View audit logs","Administration"],["security.manage","Manage security","Administration"],
  ["system.manage","Manage system settings","Administration"],
] as const;
