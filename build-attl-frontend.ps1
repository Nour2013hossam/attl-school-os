Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "       ATTL SCHOOL OS FRONTEND BUILDER" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

$routes = @(
"student/profile",
"student/identity",
"student/timeline",
"student/activity",
"student/achievements",
"student/xp",
"student/level",
"student/goals",
"student/interests",
"student/portfolio",
"academics/overview",
"academics/grades",
"academics/subjects",
"academics/schedule",
"academics/exams",
"academics/attendance",
"academics/results",
"academics/transcript",
"academics/gpa",
"academics/assignments",
"academics/deadlines",
"academics/teachers",
"academics/calendar",
"academics/reports",
"learning/courses",
"learning/my-courses",
"learning/explore",
"learning/lessons",
"learning/resources",
"learning/roadmaps",
"learning/progress",
"learning/bookmarks",
"learning/certificates",
"learning/library",
"skills/skill-map",
"skills/my-skills",
"skills/assessments",
"skills/growth",
"skills/recommendations",
"skills/technical",
"skills/soft-skills",
"skills/skill-history",
"projects/all",
"projects/my-projects",
"projects/create",
"projects/discover",
"projects/templates",
"projects/teams",
"projects/tasks",
"projects/milestones",
"projects/showcase",
"projects/analytics",
"competitions/explore",
"competitions/upcoming",
"competitions/my-competitions",
"competitions/applications",
"competitions/results",
"competitions/challenges",
"competitions/calendar",
"competitions/archives",
"attl/overview",
"attl/command-center",
"attl/team",
"attl/members",
"attl/tracks",
"attl/applications",
"attl/recruitment",
"attl/projects",
"attl/events",
"attl/workshops",
"attl/resources",
"attl/showcase",
"innovation/ideas",
"innovation/submit",
"innovation/experiments",
"innovation/research",
"innovation/lab",
"innovation/showcase",
"innovation/challenges",
"community/feed",
"community/discussions",
"community/groups",
"community/people",
"community/messages",
"community/announcements",
"community/polls",
"mentorship/mentors",
"mentorship/requests",
"mentorship/sessions",
"mentorship/progress",
"mentorship/resources",
"events/calendar",
"events/discover",
"events/upcoming",
"events/my-events",
"events/history",
"challenges/explore",
"challenges/active",
"challenges/my-challenges",
"challenges/completed",
"challenges/leaderboard",
"challenges/create",
"notifications",
"messages",
"search",
"calendar",
"settings/account",
"settings/security",
"settings/appearance",
"settings/language",
"settings/notifications",
"settings/privacy",
"settings/academic",
"settings/attl",
"settings/gamification",
"settings/ai",
"settings/files",
"settings/integrations",
"admin/overview",
"admin/users",
"admin/students",
"admin/teachers",
"admin/roles",
"admin/permissions",
"admin/applications",
"admin/grades",
"admin/projects",
"admin/competitions",
"admin/events",
"admin/analytics",
"admin/audit-logs",
"admin/security",
"admin/system"
)

$created = 0
$existing = 0

foreach ($route in $routes) {

    $directory = Join-Path "app\dashboard" $route
    $file = Join-Path $directory "page.tsx"

    if (Test-Path $file) {
        $existing++
        continue
    }

    New-Item -ItemType Directory -Force $directory | Out-Null

    $parts = $route -split "/"
    $last = $parts[-1]
    $title = (($last -replace "-", " ").Substring(0,1).ToUpper()) +
             (($last -replace "-", " ").Substring(1))

    $section = $parts[0].ToUpper()

    $content = @"
import { PageShell } from "@/components/shared/page-shell";

export default function Page() {
  return (
    <PageShell
      title="$title"
      eyebrow="ATTL / $section"
      description="A dedicated area of ATTL School OS for $title."
    />
  );
}
"@

    Set-Content $file $content -Encoding utf8
    $created++
}

Write-Host ""
Write-Host "Frontend scan complete." -ForegroundColor Green
Write-Host "New routes created: $created" -ForegroundColor Cyan
Write-Host "Existing routes preserved: $existing" -ForegroundColor Yellow
Write-Host ""

Write-Host "Checking production build..." -ForegroundColor Cyan

npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=========================================" -ForegroundColor Green
    Write-Host "       ATTL BUILD SUCCESSFUL" -ForegroundColor Green
    Write-Host "=========================================" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "=========================================" -ForegroundColor Red
    Write-Host "          BUILD FAILED" -ForegroundColor Red
    Write-Host "=========================================" -ForegroundColor Red
    Write-Host ""
}
