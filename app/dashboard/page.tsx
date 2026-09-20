"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePreferences } from "@/components/providers/preferences-provider";

type DashboardData = {
  user: { name: string; role: string; xp: number; level: number; gradeLevel: string | null; className: string | null; avatarUrl: string | null; attlMembershipActive: boolean; attlActivatedAt: string | null } | null;
  stats: { projects: number; activeGoals: number; achievements: number; upcomingAssignments: number; upcomingEvents: number; upcomingCompetitions: number };
  goals: Array<{ id: string; title: string; progress: number; targetDate: string | null }>;
  recentProjects: Array<{ id: string; title: string; description: string | null; status: string; progress: number; owner: { name: string; avatarUrl: string | null }; _count: { members: number; tasks: number } }>;
  nextEvents: Array<{ id: string; title: string; description: string | null; startsAt: string; endsAt: string; location: string | null; capacity: number | null; _count: { registrations: number } }>;
  nextCompetitions: Array<{ id: string; title: string; description: string | null; organizer: string | null; startsAt: string | null; deadlineAt: string | null; location: string | null }>;
  attlMembers: Array<{ id: string; name: string; role: string; avatarUrl: string | null; gradeLevel: string | null }>;
  featuredCourses: Array<{ id: string; title: string; description: string | null; level: string | null; _count: { lessons: number; resources: number; enrollments: number } }>;
  activeChallenges: Array<{ id: string; title: string; description: string | null; xpReward: number; endsAt: string | null; _count: { entries: number } }>;
  attlTracks: Array<{ id: string; name: string; description: string | null }>;
  attlApplication: { id: string; status: string; interviewAt: string | null; interviewResult: string | null; reviewerNotes: string | null; track: { name: string } } | null;
};

function formatDate(value: string | null, locale: string, withTime = false) {
  if (!value) return "TBD";
  return new Intl.DateTimeFormat(locale, withTime ? { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" } : { month: "short", day: "numeric" }).format(new Date(value));
}

export default function DashboardOverview() {
  const [data, setData] = useState<DashboardData | null>(null);
  const { language, can, permissionsReady } = usePreferences();
  const ar = language === "ar";
  const locale = ar ? "ar-EG" : "en-US";

  useEffect(() => {
    fetch("/api/dashboard", { cache: "no-store" }).then(async r => r.ok ? r.json() : null).then(setData).catch(() => setData(null));
  }, []);

  const user = data?.user;
  const name = user?.name ?? (ar ? "طالب ATTL" : "ATTL Student");
  const initial = name.trim().charAt(0).toUpperCase() || "A";

  const quickActions = useMemo(() => {
    const source = ar ? [
      ["ابدأ مشروعًا", "أنشئ مساحة مشروع حقيقية.", "/dashboard/projects/create", "＋"],
      ["استكشف التعلم", "ابحث عن دورات ومصادر.", "/dashboard/learning/explore", "◇"],
      ["انضم إلى ATTL", "قدّم طلب الانضمام للفريق.", "/dashboard/attl/applications", "✦"],
      ["اكتشف المسابقات", "تابع المسابقات والتحديات.", "/dashboard/competitions/explore", "★"],
    ] : [
      ["Build a Project", "Create a real project workspace.", "/dashboard/projects/create", "＋"],
      ["Explore Learning", "Find courses and resources.", "/dashboard/learning/explore", "◇"],
      ["Join ATTL", "Apply to become an ATTL member.", "/dashboard/attl/applications", "✦"],
      ["Find Competitions", "Discover competitions and challenges.", "/dashboard/competitions/explore", "★"],
    ];

    if (!permissionsReady) return [];

    const permissionByPath: Record<string, string> = {
      "/dashboard/projects/create": "projects.create",
      "/dashboard/learning/explore": "learning.read",
      "/dashboard/attl/applications": "attl.apply",
      "/dashboard/competitions/explore": "competitions.read",
    };

    return source.filter((item) => can(permissionByPath[item[2]]));
  }, [ar, can, permissionsReady]);

  return (
    <div className="space-y-5">
      <section className="home-hero relative overflow-hidden rounded-[34px] border border-white/20 bg-[#050608] p-6 text-white shadow-[0_35px_100px_rgba(20,30,50,.18)] md:p-8 lg:p-10">
        <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-blue-500/30 blur-[100px]" />
        <div className="absolute -bottom-36 left-[28%] h-96 w-96 rounded-full bg-cyan-400/10 blur-[110px]" />
        <div className="absolute left-[-80px] top-[45%] h-56 w-56 rounded-full bg-indigo-500/15 blur-[90px]" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.06] px-3 py-1.5 text-[9px] uppercase tracking-[.22em] text-white/45">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,.8)]" />
              {ar ? "نظام مدرسة ATTL" : "ATTL School OS"}
            </span>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-[-.07em] md:text-6xl">
              {ar ? "كل ما يهمك،" : "Everything that matters,"}
              <br />
              <span className="text-white/45">{ar ? "في مكان واحد." : "in one place."}</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/40">
              {ar ? "مشاريع المدرسة، الفعاليات، المسابقات، التعلم وفريق ATTL — في لوحة واحدة متصلة." : "Projects, school events, competitions, learning and the ATTL community — connected in one live workspace."}
            </p>
            {permissionsReady && (
              <div className="mt-6 flex flex-wrap gap-2">
                {can("projects.read") && <Link href="/dashboard/projects/all" className="rounded-[15px] bg-white px-4 py-2.5 text-[9px] font-semibold text-black shadow-xl">{ar ? "مشاريع المدرسة" : "School projects"} →</Link>}
                {can("events.read") && <Link href="/dashboard/events/discover" className="rounded-[15px] border border-white/10 bg-white/[.06] px-4 py-2.5 text-[9px] font-semibold text-white/80 backdrop-blur-xl">{ar ? "الفعاليات" : "Events"} →</Link>}
                {can("competitions.read") && <Link href="/dashboard/competitions/explore" className="rounded-[15px] border border-white/10 bg-white/[.06] px-4 py-2.5 text-[9px] font-semibold text-white/80 backdrop-blur-xl">{ar ? "المسابقات" : "Competitions"} →</Link>}
              </div>
            )}
          </div>
          <Link href="/dashboard/student/profile" className="group rounded-[24px] border border-white/10 bg-white/[.065] p-4 backdrop-blur-2xl transition hover:bg-white/[.09]">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-[20px] bg-white text-sm font-semibold text-black shadow-2xl">
                {user?.avatarUrl ? <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" /> : initial}
              </div>
              <div className={ar ? "text-right" : ""}>
                <p className="text-[8px] uppercase tracking-[.18em] text-white/30">{user?.role ?? "STUDENT"}</p>
                <p className="mt-1 text-base font-semibold">{name}</p>
                <p className="mt-1 text-[9px] text-white/30">{user?.gradeLevel ?? (ar ? "الصف غير محدد" : "Grade not set")} · {user?.className ?? (ar ? "الفصل غير محدد" : "Class not set")}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-[15px] bg-white/[.05] px-3 py-2.5 text-[9px] text-white/45">
              <span>{ar ? "المستوى" : "Level"} {user?.level ?? 1}</span><span>{user?.xp ?? 0} XP</span>
            </div>
          </Link>
        </div>
      </section>

      {permissionsReady && (data?.attlApplication || user?.attlMembershipActive) && (
        <section className="rounded-[30px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[8px] font-semibold uppercase tracking-[.2em] text-black/30">ATTL</p>
              <h2 className="mt-1 text-xl font-semibold tracking-[-.04em]">
                {user?.attlMembershipActive ? (ar ? "عضوية ATTL مفعّلة" : "ATTL membership is active") : (ar ? "حالة طلبك" : "Your application status")}
              </h2>
              <p className="mt-2 text-[9px] text-black/35">
                {user?.attlMembershipActive
                  ? (ar ? "حساب عضوية ATTL متاح لك الآن." : "Your ATTL member account is active.")
                  : (ar ? "عضوية ATTL تفضل مقفولة لحد نتيجة المقابلة." : "Your ATTL member account stays locked until the interview decision.")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={user?.attlMembershipActive ? "rounded-full bg-green-500/10 px-3 py-2 text-[8px] font-semibold text-green-700" : "rounded-full bg-black/[.04] px-3 py-2 text-[8px] font-semibold text-black/45"}>
                {user?.attlMembershipActive ? (ar ? "مفعّل" : "ACTIVE") : (data?.attlApplication?.status ?? "PENDING")}
              </span>
              {can("attl.apply") && <Link href="/dashboard/attl/applications" className="rounded-[13px] bg-black px-4 py-2.5 text-[8px] font-semibold text-white">{ar ? "فتح الطلب" : "Open application"} →</Link>}
            </div>
          </div>
          {data?.attlApplication?.interviewAt && (
            <div className="mt-5 rounded-[18px] bg-blue-500/[.05] p-4">
              <p className="text-[8px] uppercase tracking-[.16em] text-blue-600">{ar ? "المقابلة" : "Interview"}</p>
              <div className="mt-2 flex flex-wrap gap-3 text-[9px] text-black/40">
                <span>{new Date(data.attlApplication.interviewAt).toLocaleString(locale)}</span>
                <span>•</span>
                <span>{ar ? "النتيجة" : "Result"}: {data.attlApplication.interviewResult ?? "PENDING"}</span>
              </div>
            </div>
          )}
        </section>
      )}

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          [ar ? "المشاريع" : "Projects", String(data?.stats.projects ?? "—"), "/dashboard/projects/all", "projects.read"],
          [ar ? "الفعاليات القادمة" : "Upcoming Events", String(data?.stats.upcomingEvents ?? "—"), "/dashboard/events/upcoming", "events.read"],
          [ar ? "المسابقات" : "Competitions", String(data?.stats.upcomingCompetitions ?? "—"), "/dashboard/competitions/upcoming", "competitions.read"],
          [ar ? "الإنجازات" : "Achievements", String(data?.stats.achievements ?? "—"), "/dashboard/student/achievements", "profile.read"],
        ].filter(([, , , permission]) => !permission || (permissionsReady && can(permission))).map(([label, value, href]) => (
          <Link key={label} href={href} className="glass interactive-glass rounded-[24px] p-5 transition hover:-translate-y-1">
            <p className="text-[8px] font-semibold uppercase tracking-[.16em] text-black/30">{label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-[-.06em]">{value}</p>
            <p className="mt-2 text-[9px] text-black/30">{ar ? "فتح" : "Open"} →</p>
          </Link>
        ))}
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between px-1">
          <div><p className="text-[8px] font-semibold uppercase tracking-[.2em] text-black/30">{ar ? "اكتشاف" : "Discover"}</p><h2 className="mt-1 text-xl font-semibold tracking-[-.04em]">{ar ? "ابدأ من هنا" : "Start from here"}</h2></div>
          <Link href="/dashboard/search" className="text-[9px] text-black/30 hover:text-black">{ar ? "استكشف الكل" : "Explore all"} →</Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map(([title, description, href, icon]) => (
            <Link key={title} href={href} className="glass interactive-glass group rounded-[25px] p-5 transition hover:-translate-y-1">
              <div className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-black text-lg text-white shadow-lg">{icon}</div>
              <h3 className="mt-5 text-sm font-semibold">{title}</h3>
              <p className="mt-2 text-[10px] leading-5 text-black/40">{description}</p>
              <span className="mt-5 block text-[9px] text-black/30 group-hover:text-blue-600">{ar ? "فتح" : "Open"} →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.35fr_.85fr]">
        <div className="glass rounded-[30px] p-5 md:p-6">
          <div className="flex items-end justify-between">
            <div><p className="text-[8px] font-semibold uppercase tracking-[.2em] text-black/30">{ar ? "المشاريع" : "Projects"}</p><h2 className="mt-1 text-2xl font-semibold tracking-[-.05em]">{ar ? "ما الذي يتم بناؤه؟" : "What’s being built?"}</h2></div>
            <Link href="/dashboard/projects/all" className="rounded-full bg-black/[.035] px-3 py-2 text-[8px] font-semibold text-black/45">{ar ? "كل المشاريع" : "All projects"} →</Link>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {(data?.recentProjects ?? []).map(project => (
              <Link key={project.id} href={"/dashboard/projects/"+project.id} className="group rounded-[22px] border border-black/5 bg-white/45 p-4 transition hover:-translate-y-1 hover:bg-white">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0"><p className="truncate text-sm font-semibold">{project.title}</p><p className="mt-1 truncate text-[9px] text-black/30">{project.owner.name}</p></div>
                  <span className="rounded-full bg-black/[.04] px-2 py-1 text-[8px] text-black/35">{project.status}</span>
                </div>
                <p className="mt-3 line-clamp-2 text-[10px] leading-5 text-black/40">{project.description || (ar ? "مشروع مدرسي جاري." : "A live school project.")}</p>
                <div className="mt-4"><div className="flex items-center justify-between text-[8px] text-black/30"><span>{ar ? "التقدم" : "Progress"}</span><span>{project.progress}%</span></div><div className="mt-1.5 h-1.5 rounded-full bg-black/5"><div className="h-full rounded-full bg-black transition-all" style={{width: project.progress+"%"}} /></div></div>
                <div className="mt-4 flex items-center justify-between text-[8px] text-black/25"><span>{project._count.members} {ar ? "أعضاء" : "members"}</span><span>{project._count.tasks} {ar ? "مهام" : "tasks"}</span></div>
              </Link>
            ))}
            {data && data.recentProjects.length===0 && <div className="md:col-span-2 rounded-[22px] bg-black/[.025] p-8 text-center"><p className="text-sm font-semibold">{ar ? "لسه مفيش مشاريع منشورة" : "No public projects yet"}</p><p className="mt-2 text-[10px] text-black/35">{ar ? "ابدأ مشروعك الأول وخليه يظهر هنا." : "Create the first project and it will appear here."}</p>{permissionsReady && can("projects.create") && <Link href="/dashboard/projects/create" className="mt-4 inline-flex rounded-[14px] bg-black px-4 py-2.5 text-[9px] font-semibold text-white">{ar ? "إنشاء مشروع" : "Create project"}</Link>}</div>}
          </div>
        </div>

        <div className="rounded-[30px] bg-black p-5 text-white md:p-6">
          <div className="flex items-end justify-between"><div><p className="text-[8px] font-semibold uppercase tracking-[.2em] text-white/30">{ar ? "الفعاليات" : "Events"}</p><h2 className="mt-1 text-2xl font-semibold tracking-[-.05em]">{ar ? "قريبًا" : "Coming up"}</h2></div><Link href="/dashboard/events/discover" className="text-[8px] text-white/35">{ar ? "كل الفعاليات" : "All events"} →</Link></div>
          <div className="mt-5 space-y-2">
            {(data?.nextEvents ?? []).slice(0,5).map(event => (
              <Link key={event.id} href={"/dashboard/events/discover"} className="flex gap-3 rounded-[19px] border border-white/10 bg-white/[.05] p-3 transition hover:bg-white/[.08]">
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-[15px] bg-white text-black"><span className="text-[8px] uppercase">{new Intl.DateTimeFormat(locale,{month:"short"}).format(new Date(event.startsAt))}</span><span className="text-lg font-semibold leading-none">{new Date(event.startsAt).getDate()}</span></div>
                <div className="min-w-0"><p className="truncate text-[10px] font-semibold">{event.title}</p><p className="mt-1 truncate text-[8px] text-white/35">{formatDate(event.startsAt,locale,true)} · {event.location || (ar ? "المدرسة" : "School")}</p><p className="mt-1 text-[8px] text-white/25">{event._count.registrations}{event.capacity ? " / "+event.capacity : ""} {ar ? "مسجل" : "registered"}</p></div>
              </Link>
            ))}
            {data && data.nextEvents.length===0 && <p className="rounded-[18px] bg-white/[.05] p-5 text-[9px] text-white/35">{ar ? "لا توجد فعاليات قادمة حاليًا." : "No upcoming events right now."}</p>}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[.95fr_1.15fr]">
        <div className="glass rounded-[30px] p-5 md:p-6">
          <div className="flex items-end justify-between"><div><p className="text-[8px] font-semibold uppercase tracking-[.2em] text-black/30">{ar ? "المسابقات" : "Competitions"}</p><h2 className="mt-1 text-2xl font-semibold tracking-[-.05em]">{ar ? "فرص قادمة" : "Open opportunities"}</h2></div><Link href="/dashboard/competitions/explore" className="text-[8px] text-black/30">{ar ? "استكشاف" : "Explore"} →</Link></div>
          <div className="mt-5 space-y-2">
            {(data?.nextCompetitions ?? []).slice(0,5).map(c => (
              <Link key={c.id} href="/dashboard/competitions/explore" className="block rounded-[18px] border border-black/5 bg-white/40 p-4 transition hover:bg-white">
                <div className="flex items-start justify-between gap-3"><p className="text-[11px] font-semibold">{c.title}</p><span className="text-[8px] text-black/30">{c.deadlineAt ? formatDate(c.deadlineAt,locale) : "No deadline"}</span></div>
                <p className="mt-1 text-[8px] text-black/30">{c.organizer || (ar ? "جهة مدرسية" : "School organizer")} · {c.location || (ar ? "أونلاين" : "Online")}</p>
                <p className="mt-3 line-clamp-2 text-[9px] leading-5 text-black/35">{c.description || (ar ? "مسابقة متاحة من خلال School OS." : "Competition opportunity available through School OS.")}</p>
              </Link>
            ))}
            {data && data.nextCompetitions.length===0 && <p className="rounded-[18px] bg-black/[.025] p-5 text-[9px] text-black/35">{ar ? "لا توجد مسابقات مسجلة حاليًا." : "No competitions are listed yet."}</p>}
          </div>
        </div>

        <div className="glass rounded-[30px] p-5 md:p-6">
          <div className="flex items-end justify-between"><div><p className="text-[8px] font-semibold uppercase tracking-[.2em] text-black/30">ATTL</p><h2 className="mt-1 text-2xl font-semibold tracking-[-.05em]">{ar ? "المجتمع والأعضاء" : "People behind ATTL"}</h2></div><Link href="/dashboard/community/people" className="text-[8px] text-black/30">{ar ? "كل الأشخاص" : "All people"} →</Link></div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {(data?.attlMembers ?? []).map(member => (
              <Link key={member.id} href="/dashboard/community/people" title={member.name} className="group flex items-center gap-2 rounded-full border border-black/5 bg-white/55 py-1.5 pl-1.5 pr-3 transition hover:-translate-y-0.5 hover:bg-white">
                <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-black text-[9px] font-semibold text-white">{member.avatarUrl ? <img src={member.avatarUrl} alt="" className="h-full w-full object-cover" /> : member.name.trim().charAt(0).toUpperCase()}</span>
                <span><span className="block max-w-[120px] truncate text-[9px] font-semibold">{member.name}</span><span className="block text-[7px] text-black/30">{member.role}</span></span>
              </Link>
            ))}
            {data && data.attlMembers.length===0 && <div className="w-full rounded-[22px] bg-black/[.025] p-6"><p className="text-sm font-semibold">{ar ? "فريق ATTL بيتبني دلوقتي" : "The ATTL team is taking shape"}</p><p className="mt-2 text-[9px] leading-5 text-black/35">{ar ? "الأعضاء المقبولين هيظهروا هنا تلقائيًا." : "Accepted members will appear here automatically."}</p></div>}
          </div>
          <div className="mt-6 grid grid-cols-3 gap-2">
            {[
              [ar ? "الأعضاء" : "Members", String(data?.attlMembers.length ?? 0)],
              [ar ? "الفعاليات" : "Events", String(data?.stats.upcomingEvents ?? 0)],
              [ar ? "المسابقات" : "Competitions", String(data?.stats.upcomingCompetitions ?? 0)],
            ].map(([label,value])=><div key={label} className="rounded-[17px] bg-black/[.025] p-3"><p className="text-[7px] uppercase tracking-[.12em] text-black/25">{label}</p><p className="mt-1 text-lg font-semibold">{value}</p></div>)}
          </div>
        </div>
      </section>

      {permissionsReady && (can("learning.read") || can("challenges.read") || can("attl.read")) && (
        <section className="grid gap-4 xl:grid-cols-[1.15fr_.85fr]">
          {can("learning.read") && (
            <div className="glass rounded-[30px] p-5 md:p-6">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[8px] font-semibold uppercase tracking-[.2em] text-black/30">{ar ? "التعلم" : "Learning"}</p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-[-.05em]">{ar ? "تعلم حاجة جديدة" : "Learn something new"}</h2>
                </div>
                <Link href="/dashboard/learning/courses" className="text-[8px] text-black/30">{ar ? "كل الكورسات" : "All courses"} →</Link>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {(data?.featuredCourses ?? []).map((course) => (
                  <Link key={course.id} href={"/dashboard/learning/courses/" + course.id} className="rounded-[22px] border border-black/5 bg-white/45 p-5 transition hover:-translate-y-1 hover:bg-white">
                    <div className="flex items-start justify-between gap-3">
                      <span className="rounded-full bg-blue-500/10 px-3 py-1 text-[8px] font-semibold text-blue-600">{course.level ?? (ar ? "عام" : "General")}</span>
                      <span className="text-[8px] text-black/25">{course._count.lessons} {ar ? "دروس" : "lessons"}</span>
                    </div>
                    <h3 className="mt-4 text-sm font-semibold">{course.title}</h3>
                    <p className="mt-2 line-clamp-2 text-[9px] leading-5 text-black/35">{course.description || (ar ? "مسار تعلم متاح على School OS." : "A learning path available on School OS.")}</p>
                    <div className="mt-4 flex items-center justify-between text-[8px] text-black/25"><span>{course._count.resources} {ar ? "مصادر" : "resources"}</span><span>{course._count.enrollments} {ar ? "مشترك" : "enrolled"}</span></div>
                  </Link>
                ))}
                {data && data.featuredCourses.length === 0 && <div className="rounded-[22px] bg-black/[.025] p-7 text-center text-[10px] text-black/35 md:col-span-2">{ar ? "مفيش كورسات منشورة لسه." : "No published courses yet."}</div>}
              </div>
            </div>
          )}

          {can("challenges.read") && (
            <div className="rounded-[30px] bg-black p-5 text-white md:p-6">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[8px] font-semibold uppercase tracking-[.2em] text-white/30">{ar ? "تحديات" : "Challenges"}</p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-[-.05em]">{ar ? "اختبر نفسك" : "Test yourself"}</h2>
                </div>
                <Link href="/dashboard/challenges/explore" className="text-[8px] text-white/35">{ar ? "استكشف" : "Explore"} →</Link>
              </div>
              <div className="mt-5 space-y-2">
                {(data?.activeChallenges ?? []).map((challenge) => (
                  <Link key={challenge.id} href="/dashboard/challenges/explore" className="block rounded-[20px] border border-white/10 bg-white/[.055] p-4 transition hover:bg-white/[.09]">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-[10px] font-semibold">{challenge.title}</p>
                      <span className="text-[8px] text-blue-300">+{challenge.xpReward} XP</span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-[9px] leading-5 text-white/35">{challenge.description || (ar ? "تحدي جديد مستنيك." : "A new challenge is waiting.")}</p>
                    <p className="mt-3 text-[8px] text-white/25">{challenge._count.entries} {ar ? "مشارك" : "participants"}</p>
                  </Link>
                ))}
                {data && data.activeChallenges.length === 0 && <div className="rounded-[20px] bg-white/[.05] p-7 text-center text-[10px] text-white/35">{ar ? "مفيش تحديات نشطة حاليًا." : "No active challenges right now."}</div>}
              </div>
            </div>
          )}
        </section>
      )}

      {permissionsReady && can("attl.read") && (
        <section className="glass rounded-[30px] p-5 md:p-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[8px] font-semibold uppercase tracking-[.2em] text-black/30">ATTL</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-[-.05em]">{ar ? "مسارات تصنع فيها حاجة حقيقية" : "Tracks built for real work"}</h2>
            </div>
            <Link href="/dashboard/attl/overview" className="text-[8px] text-black/30">{ar ? "عن ATTL" : "About ATTL"} →</Link>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {(data?.attlTracks ?? []).map((track) => (
              <div key={track.id} className="rounded-[22px] border border-black/5 bg-white/45 p-5 transition hover:-translate-y-1 hover:bg-white">
                <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-black text-white">A</div>
                <h3 className="mt-4 text-sm font-semibold">{track.name}</h3>
                <p className="mt-2 line-clamp-3 text-[9px] leading-5 text-black/35">{track.description || (ar ? "مسار داخل ATTL." : "A focused ATTL track.")}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
        <div className="glass rounded-[30px] p-6">
          <div className="flex items-end justify-between"><div><p className="text-[8px] font-semibold uppercase tracking-[.2em] text-black/30">{ar ? "خطواتك التالية" : "Next actions"}</p><h2 className="mt-1 text-xl font-semibold">{ar ? "حافظ على تقدّمك" : "Keep your momentum"}</h2></div></div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {[
              [ar ? "الواجبات" : "Assignments", String(data?.stats.upcomingAssignments ?? "—"), "/dashboard/academics/assignments", "academics.read"],
              [ar ? "الفعاليات" : "Events", String(data?.stats.upcomingEvents ?? "—"), "/dashboard/events/upcoming", "events.read"],
              [ar ? "المسابقات" : "Competitions", String(data?.stats.upcomingCompetitions ?? "—"), "/dashboard/competitions/upcoming", "competitions.read"],
              [ar ? "الأهداف النشطة" : "Active goals", String(data?.stats.activeGoals ?? "—"), "/dashboard/student/goals", "profile.read"],
            ].filter(([, , , permission]) => !permission || (permissionsReady && can(permission))).map(([label,value,href])=><Link key={label} href={href} className="rounded-[18px] bg-black/[.025] p-4 transition hover:bg-white"><p className="text-[8px] uppercase tracking-[.15em] text-black/25">{label}</p><p className="mt-2 text-lg font-semibold">{value}</p></Link>)}
          </div>
        </div>
        <div className="rounded-[30px] bg-black p-6 text-white">
          <p className="text-[8px] font-semibold uppercase tracking-[.2em] text-white/30">{ar ? "الأهداف" : "Goals"}</p>
          <h2 className="mt-1 text-xl font-semibold">{ar ? "أهدافك الحالية" : "Your current goals"}</h2>
          <div className="mt-5 space-y-2">
            {(data?.goals ?? []).slice(0,4).map(goal=><Link key={goal.id} href="/dashboard/student/goals" className="block rounded-[17px] border border-white/10 bg-white/[.06] p-3"><div className="flex justify-between gap-3"><p className="text-[10px] font-semibold">{goal.title}</p><span className="text-[8px] text-white/25">{goal.progress}%</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-white" style={{width:goal.progress+"%"}} /></div></Link>)}
            {(!data?.goals || data.goals.length===0) && <Link href="/dashboard/student/goals" className="block rounded-[17px] bg-white/[.06] p-4 text-[10px] text-white/35">{ar ? "أنشئ أول هدف ليظهر هنا." : "Create your first goal and it will appear here."}</Link>}
          </div>
        </div>
      </section>
    </div>
  );
}
