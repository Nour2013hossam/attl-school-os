import{NextResponse}from"next/server";import{auth}from"@/auth";import{prisma}from"@/lib/prisma";import{UserRole}from"@prisma/client";import{hasPermission}from"@/lib/permissions";
export async function GET(){const s=await auth();if(!s?.user?.id||s.user.role!==UserRole.TEACHER||!(await hasPermission(s.user.id,s.user.role,"academics.exams.manage")))return NextResponse.json({error:"Forbidden"},{status:403});
 const exams=await prisma.exam.findMany({where:{subject:{schedule:{some:{teacherId:s.user.id,active:true}}}},orderBy:{startsAt:"asc"},include:{subject:{select:{id:true,code:true,name:true}}}});
 const subjects=await prisma.subject.findMany({where:{schedule:{some:{teacherId:s.user.id,active:true}}},orderBy:{name:"asc"},select:{id:true,code:true,name:true}});
 return NextResponse.json({exams,subjects});
}
export async function POST(req:Request){const s=await auth();if(!s?.user?.id||s.user.role!==UserRole.TEACHER||!(await hasPermission(s.user.id,s.user.role,"academics.exams.manage")))return NextResponse.json({error:"Forbidden"},{status:403});
 const b=await req.json();if(typeof b.subjectId!=="string"||typeof b.title!=="string"||!b.startsAt||!b.endsAt)return NextResponse.json({error:"Subject, title, start and end are required."},{status:400});
 const startsAt=new Date(b.startsAt),endsAt=new Date(b.endsAt);if(endsAt<=startsAt)return NextResponse.json({error:"End time must be after start time."},{status:400});
 const canTeach=await prisma.scheduleItem.findFirst({where:{teacherId:s.user.id,subjectId:b.subjectId,active:true},select:{id:true}});if(!canTeach)return NextResponse.json({error:"You do not teach this subject."},{status:403});
 const exam=await prisma.exam.create({data:{subjectId:b.subjectId,title:b.title.trim(),startsAt,endsAt,room:typeof b.room==="string"?b.room.trim()||null:null,maxScore:typeof b.maxScore==="number"?b.maxScore:100,published:Boolean(b.published)}});
 await prisma.auditLog.create({data:{actorId:s.user.id,action:"TEACHER_EXAM_CREATED",entity:"Exam",entityId:exam.id,metadata:{subjectId:b.subjectId,title:exam.title}}});
 return NextResponse.json({exam},{status:201});
}