import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { hasPermission } from "@/lib/permissions";

export async function PATCH(request:Request,context:{params:Promise<{id:string}>}){
 const s=await auth();const{id}=await context.params;if(!s?.user?.id)return NextResponse.json({error:"Unauthorized"},{status:401});
 if(!(await hasPermission(s.user.id,s.user.role,"learning.read")))return NextResponse.json({error:"Forbidden"},{status:403});
 if(!(await hasPermission(s.user.id,s.user.role,"learning.read")))return NextResponse.json({error:"Forbidden"},{status:403});
 const body=await request.json();const completed=Boolean(body.completed);
 const lesson=await prisma.lesson.findUnique({where:{id},select:{id:true,courseId:true,course:{select:{id:true,published:true,lessons:{select:{id:true}}}}}});
 if(!lesson?.course?.published)return NextResponse.json({error:"Lesson not available."},{status:404});
 const enrollment=await prisma.courseEnrollment.findUnique({where:{userId_courseId:{userId:s.user.id,courseId:lesson.courseId}}});
 if(!enrollment)return NextResponse.json({error:"Enroll in the course first."},{status:409});
 const record=await prisma.lessonProgress.upsert({where:{userId_lessonId:{userId:s.user.id,lessonId:id}},update:{completed},create:{userId:s.user.id,lessonId:id,completed}});
 const completedCount=await prisma.lessonProgress.count({where:{userId:s.user.id,lesson:{courseId:lesson.courseId},completed:true}});
 const total=lesson.course.lessons.length;
 const percent=total?Math.round(completedCount/total*100):0;
 const updated=await prisma.courseEnrollment.update({where:{id:enrollment.id},data:{progress:percent,completedAt:percent===100?new Date():null,status:percent===100?"COMPLETED":"ACTIVE"}});
 if(percent===100){
   const existing=await prisma.certificate.findUnique({where:{userId_courseId:{userId:s.user.id,courseId:lesson.courseId}}});
   if(!existing) await prisma.certificate.create({data:{userId:s.user.id,courseId:lesson.courseId,code:"ATTL-"+crypto.randomUUID().replaceAll("-","").slice(0,12).toUpperCase()}});
 }
 return NextResponse.json({progress:record,enrollment:updated,percent});
}
