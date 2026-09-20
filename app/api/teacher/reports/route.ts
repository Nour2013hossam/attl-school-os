import{NextResponse}from"next/server";
import{auth}from"@/auth";import{prisma}from"@/lib/prisma";import{UserRole}from"@prisma/client";import{hasPermission}from"@/lib/permissions";
export async function GET(){const s=await auth();if(!s?.user?.id||s.user.role!==UserRole.TEACHER||!(await hasPermission(s.user.id,s.user.role,"academics.read")))return NextResponse.json({error:"Forbidden"},{status:403});
 const subjects=await prisma.subject.findMany({where:{schedule:{some:{teacherId:s.user.id,active:true}}},select:{id:true,code:true,name:true}});
 const subjectIds=subjects.map(x=>x.id);
 const [students,grades,attendance,assignments,submissions]=await Promise.all([
  prisma.enrollment.findMany({where:{subjectId:{in:subjectIds}},select:{userId:true},distinct:["userId"]}),
  prisma.grade.findMany({where:{subjectId:{in:subjectIds}},select:{score:true,maxScore:true,subjectId:true}}),
  prisma.attendanceRecord.groupBy({by:["status"],where:{subjectId:{in:subjectIds}},_count:{_all:true}}),
  prisma.assignment.count({where:{subjectId:{in:subjectIds}}}),
  prisma.assignmentSubmission.count({where:{assignment:{subjectId:{in:subjectIds},}}}),
 ]);
 const average=grades.length?Math.round(grades.reduce((a,g)=>a+(g.maxScore?g.score/g.maxScore*100:0),0)/grades.length):0;
 const attendanceStats=Object.fromEntries(attendance.map(x=>[x.status,x._count._all]));
 return NextResponse.json({report:{students:students.length,subjects:subjects.length,gradesRecorded:grades.length,averageScore:average,assignments,submissions,attendance:attendanceStats},subjects});
}