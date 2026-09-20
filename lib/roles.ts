export const ROLE_DEFINITIONS = [
  { role: "STUDENT", label: "Student", scope: "Personal academics, learning, projects and community." },
  { role: "ATTL_MEMBER", label: "ATTL Member", scope: "ATTL operations plus student access." },
  { role: "TRACK_LEAD", label: "Track Lead", scope: "ATTL recruitment, review and track operations." },
  { role: "TEACHER", label: "Teacher", scope: "Teaching, gradebook, attendance, exams and assignments." },
  { role: "ADMIN", label: "Admin", scope: "School-wide operational and administrative management." },
  { role: "SUPER_ADMIN", label: "Super Admin", scope: "Full system administration." },
] as const;

export const PERMISSION_MATRIX: Record<string, string[]> = {
  STUDENT: ["profile:read", "profile:write", "academics:read", "academics.assignments.submit", "learning:read", "learning:enroll", "skills:read", "projects:read", "projects:create", "projects:participate", "competitions:read", "competitions:apply", "events:read", "events:register", "community:read", "community:participate", "mentorship:request", "challenges:read", "challenges:participate", "attl:apply", "goals.manage", "notifications:read", "notifications:manage", "files:read"],
  ATTL_MEMBER: ["profile:*", "academics:read", "academics.assignments.submit", "learning:read", "learning:enroll", "skills:read", "projects:*", "competitions:read", "competitions:apply", "events:*", "community:*", "mentorship:*", "challenges:*", "attl:read", "attl:operations", "goals.manage", "notifications:read", "notifications:manage", "files:read"],
  TRACK_LEAD: ["profile:*", "academics:read", "academics.assignments.submit", "learning:*", "learning:enroll", "projects:*", "competitions:*", "events:*", "community:*", "mentorship:*", "challenges:*", "attl:read", "attl:review", "attl:tracks", "attl.tracks.manage", "attl.team.manage", "goals.manage", "notifications:read", "notifications:manage", "files:read"],
  TEACHER: ["profile:*", "academics:read", "skills:read", "academics:teaching", "academics:gradebook", "academics:attendance", "academics:assignments", "academics:assignments.submit", "academics:exams", "learning:read", "learning:manage", "learning:teaching", "messages:*", "mentorship:*", "goals.manage", "notifications:read", "notifications:manage", "files:read"],
  ADMIN: ["admin.access", "school.manage", "files:*", "users:*", "roles:*", "permissions:*", "results:*", "academics:*", "learning:*", "skills:read", "attl:*", "projects:*", "competitions:*", "events:*", "innovation:*", "community:*", "mentorship:*", "challenges:*", "messages:*", "analytics:*", "audit:read", "security:manage", "system:manage"],
  SUPER_ADMIN: ["*"],
};


export const PERMISSION_CATALOG = [
  ["admin.access","Access school administration","Administration"],["profile.read","View profile","Profile"],["profile.write","Edit profile","Profile"],
  ["academics.read","View academic records","Academics"],["academics.grades.write","Enter and update grades","Academics"],
  ["academics.attendance.write","Manage attendance","Academics"],["academics.assignments.manage","Manage assignments","Academics"],
  ["academics.exams.manage","Manage exams","Academics"],["results.release","Release academic results","Academics"],
  ["learning.read","Access learning content","Learning"],["skills.read","View skills workspace","Development"],["learning.manage","Manage learning content","Learning"],["learning.enroll","Enroll in courses","Learning"],
  ["projects.read","View projects","Projects"],["projects.participate","Participate in projects","Projects"],["projects.create","Create projects","Projects"],["projects.manage","Manage projects","Projects"],
  ["projects.tasks.manage","Manage project tasks","Projects"],["projects.members.manage","Manage project members","Projects"],
  ["competitions.read","View competitions","Competitions"],["competitions.apply","Apply to competitions","Competitions"],["competitions.manage","Manage competitions","Competitions"],
  ["events.read","View events","Events"],["events.register","Register for events","Events"],["events.manage","Manage events","Events"],
  ["attl.read","View ATTL workspace","ATTL"],["attl.operations","Run ATTL operations","ATTL"],["attl.apply","Apply to ATTL","ATTL"],["attl.review","Review ATTL applications","ATTL"],
  ["attl.tracks.manage","Manage ATTL tracks","ATTL"],["attl.team.manage","Manage ATTL team","ATTL"],
  ["innovation.submit","Submit innovation ideas","Innovation"],["files.read","View files","Administration"],["files.manage","Manage files","Administration"],["innovation.manage","Manage innovation workflows","Innovation"],
  ["community.read","View community","Community"],["community.participate","Use community","Community"],["community.moderate","Moderate community","Community"],["messages.read","View messages","Community"],["messages.send","Send messages","Community"],
  ["mentorship.request","Request mentorship","Mentorship"],["notifications.read","View notifications","Profile"],["notifications.manage","Manage notifications","Profile"],["goals.manage","Manage personal goals","Profile"],["mentorship.manage","Manage mentorship","Mentorship"],
  ["academics.assignments.submit","Submit assignments","Academics"],["challenges.read","View challenges","Challenges"],["challenges.participate","Participate in challenges","Challenges"],["challenges.manage","Manage challenges","Challenges"],
  ["users.read","View users","Administration"],["users.manage","Manage users","Administration"],
  ["roles.read","View roles","Administration"],["roles.assign","Assign roles","Administration"],["roles.manage","Create and manage custom roles","Administration"],
  ["permissions.read","View permissions","Administration"],["permissions.manage","Manage user overrides","Administration"],
  ["audit.read","View audit logs","Administration"],["security.manage","Manage security","Administration"],["school.manage","Manage school settings","Administration"],
  ["system.manage","Manage system settings","Administration"],["analytics.read","View analytics","Administration"],
] as const;
