"use client";
import Link from"next/link";import{useEffect,useState}from"react";import{usePreferences}from"@/components/providers/preferences-provider";
type Stats={students:number;teachers:number;attlMembers:number;pendingReviews:number;activeProjects:number;upcomingEvents:number;upcomingCompetitions:number;activeUsers:number};
const modules=[
 {group:"Control",title:"Users",description:"Manage every account in the school.",href:"/dashboard/admin/users",icon:"◎",permission:"users.read"},
 {group:"Control",title:"Roles",description:"Create and manage custom roles.",href:"/dashboard/admin/roles",icon:"◈",permission:"roles.read"},
 {group:"Control",title:"Permissions",description:"Granular user access overrides.",href:"/dashboard/admin/permissions",icon:"⌘",permission:"permissions.read"},
 {group:"School",title:"Students",description:"Student records and academic profiles.",href:"/dashboard/admin/students",icon:"○",permission:"users.read"},
 {group:"School",title:"Teachers",description:"Teacher accounts and access.",href:"/dashboard/admin/teachers",icon:"◇",permission:"users.read"},
 {group:"School",title:"Grades",description:"Import and manage academic grades.",href:"/dashboard/admin/grades",icon:"▤",permission:"academics.grades.write"},
 {group:"School",title:"Result Release",description:"Control when academic results become visible.",href:"/dashboard/admin/results-release",icon:"◉",permission:"results.release"},
 {group:"School",title:"Projects",description:"Monitor and manage school projects.",href:"/dashboard/admin/projects",icon:"✦",permission:"projects.manage"},
 {group:"School",title:"Competitions",description:"Create and manage competition opportunities.",href:"/dashboard/admin/competitions",icon:"★",permission:"competitions.manage"},
 {group:"School",title:"Events",description:"Create and manage school events.",href:"/dashboard/admin/events",icon:"◷",permission:"events.manage"},
 {group:"ATTL",title:"Applications",description:"Review ATTL membership applications.",href:"/dashboard/admin/applications",icon:"◇",permission:"attl.review"},
 {group:"ATTL",title:"ATTL Operations",description:"Run tracks, projects and team workflows.",href:"/dashboard/attl",icon:"A",permission:"attl.read"},
 {group:"Insights",title:"Analytics",description:"School-wide operational analytics.",href:"/dashboard/admin/analytics",icon:"⌁",permission:"analytics.read"},
 {group:"Insights",title:"Audit Logs",description:"Track important system actions.",href:"/dashboard/admin/audit-logs",icon:"◷",permission:"audit.read"},
 {group:"Security",title:"Security",description:"Protected security controls.",href:"/dashboard/admin/security",icon:"◆",permission:"security.manage"},
 {group:"Security",title:"System",description:"Global School OS configuration and health.",href:"/dashboard/admin/system",icon:"⚙",permission:"system.manage"},
] as const;

export default function AdminOverviewPage(){
 const{can,permissionsReady}=usePreferences();const[stats,setStats]=useState<Stats|null>(null);
 useEffect(()=>{fetch("/api/admin/overview",{cache:"no-store"}).then(async r=>r.ok?r.json():null).then(d=>setStats(d?.stats??null)).catch(()=>setStats(null));},[]);
 const groups=["Control","School","ATTL","Insights","Security"];
 return <div className="space-y-6">
  <section className="relative overflow-hidden rounded-[34px] bg-black p-7 text-white shadow-[0_35px_100px_rgba(0,0,0,.2)] md:p-9"><div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/20 blur-[110px]"/><div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="text-[9px] uppercase tracking-[.22em] text-blue-300">ATTL School OS · Administration</p><h1 className="mt-3 text-4xl font-semibold tracking-[-.06em] md:text-5xl">School Control Center.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">One clear control surface for accounts, academics, projects, ATTL, events, security and system operations.</p></div><div className="rounded-[20px] border border-white/10 bg-white/5 px-5 py-4"><p className="text-[8px] uppercase tracking-[.18em] text-white/30">Access</p><p className="mt-1 text-sm font-medium text-blue-300">{permissionsReady?"Permission-aware":"Checking access…"}</p></div></div></section>
  <section className="grid grid-cols-2 gap-3 md:grid-cols-4">{[["Students",stats?.students],["Teachers",stats?.teachers],["ATTL Members",stats?.attlMembers],["Active Users",stats?.activeUsers]].map(([label,value])=><div key={String(label)} className="rounded-[24px] border border-white/80 bg-white/60 p-5 backdrop-blur-xl"><p className="text-[8px] uppercase tracking-[.16em] text-black/25">{label}</p><p className="mt-2 text-2xl font-semibold">{value??"—"}</p></div>)}</section>
  {groups.map(group=>{const items=modules.filter(m=>m.group===group&&permissionsReady&&can(m.permission));if(!items.length)return null;return <section key={group}><div className="mb-3 px-1"><p className="text-[8px] uppercase tracking-[.2em] text-black/25">{group}</p></div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{items.map(m=><Link key={m.href} href={m.href} className="group rounded-[27px] border border-white/80 bg-white/60 p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/90"><div className="flex items-start justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-black text-white">{m.icon}</div><span className="text-black/20 transition-transform group-hover:translate-x-1">→</span></div><h2 className="mt-5 text-sm font-semibold">{m.title}</h2><p className="mt-2 text-[10px] leading-5 text-black/35">{m.description}</p></Link>)}</div></section>})}
 </div>;
}
