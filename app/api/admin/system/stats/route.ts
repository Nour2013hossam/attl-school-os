import{NextResponse}from"next/server";import{auth}from"@/auth";import{prisma}from"@/lib/prisma";import{hasPermission}from"@/lib/permissions";
export async function GET(){const s=await auth();if(!s?.user?.id||!(await hasPermission(s.user.id,s.user.role,"system.manage")))return NextResponse.json({error:"Forbidden"},{status:403});
 const [users,projects,events,competitions,courses,audit]=await Promise.all([prisma.user.count(),prisma.project.count(),prisma.event.count(),prisma.competition.count(),prisma.course.count(),prisma.auditLog.count()]);
 return NextResponse.json({stats:[["Users",users],["Projects",projects],["Events",events],["Competitions",competitions],["Courses",courses],["Audit logs",audit]].map(([k,v])=>k+":"+v)});
}