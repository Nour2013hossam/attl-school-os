# ATTL School OS — Missing Features Register

This file is the working source of truth for the remaining School OS gaps.

## Completed in the current build
- Permission-aware navigation and action visibility.
- Super Admin full-access behavior.
- School Control Center.
- Custom roles and per-user permission overrides.
- Course Studio with course, lesson and resource management.
- Database-backed file uploads for course materials and project files.
- Protected file download/delete endpoints.
- Project file library.
- Live student profile/identity/portfolio data.
- Live workspace search/refresh shell for scaffolded domain pages.
- Registration/login/password rate limiting.
- Stronger security headers.
- Course publishing workflow and learner enrollment/progress.
- Project tasks, members, milestones and analytics.
- ATTL recruitment pipeline, tracks and operations.
- Events, competitions, community, mentorship and challenges foundations.
- CI build verification.

## Remaining product work
### Learning / Content
- Rich lesson editor with Markdown/formatting, video embeds and attachments per lesson.
- Bulk course import/export.
- Course categories, tags, prerequisites and learning paths.
- Teacher-owned courses and instructor attribution.
- Course analytics: completion funnels, lesson drop-off and certificates.
- Resource folders and richer file previews.

### Projects
- Project edit/archive/delete UI in the workspace.
- Project repository links, demo links and external integrations.
- Rich project attachments with previews.
- Project activity feed and changelog.
- Project invitations/notifications and member role editing UI.
- Project templates with clone workflow.

### School Administration
- Full student/teacher CRUD and enrollment/class assignment UI.
- Bulk user import/export.
- Subject and timetable administration.
- Bulk grade import UI hardening, validation reports and rollback.
- Full result-release scheduling UI.
- Admin dashboards with date filters and exportable analytics.
- Audit log filters/export.

### ATTL
- Track-lead assignment to members.
- Configurable application question editor with drag/reorder and preview.
- Interview scheduling and reviewer assignment UI.
- Application scorecards and reviewer rubrics.
- ATTL attendance, tasks, workshops and internal resource management.
- ATTL project/event creation flows from the ATTL workspace.

### Community / Communication
- Real conversation inbox composer and thread details.
- Message read/unread state and notification badges.
- Moderation queue with report/flag workflow.
- Group member management and ownership transfer.
- Poll close/end-date controls.
- Announcement publishing scheduler.

### Platform / UX
- Complete Arabic translation coverage across all pages.
- Per-page permission guards for every remaining scaffold route.
- Global command center coverage for every module.
- Mobile/tablet QA pass.
- Empty/loading/error states across all live pages.
- File quotas and storage usage dashboard.
- Production storage migration option for larger files.
- Session/device management and stronger account recovery flow.

### Security / Production
- CSRF strategy for state-changing APIs where required by deployment architecture.
- Central audit middleware for sensitive admin mutations.
- IP/user throttling backed by shared storage for multi-instance production.
- Security event dashboard and alerting.
- Backup/restore and database maintenance plan.
