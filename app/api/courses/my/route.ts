import {NextResponse} from "next/server";
import {auth} from "@/auth";
import {prisma} from "@/lib/prisma";
import {hasPermission} from "@/lib/permissions";

export async function GET(){
 const s=await auth();
 if(!s?.user?.id)return NextResponse.json({error:"Unauthorized"},{status:401});
 if(!(await hasPermission(s.user.id,s.user.role,"learning.read")))return NextResponse.json({error:"Forbidden"},{status:403});

 const rows=await prisma.courseEnrollment.findMany({
  where:{userId:s.user.id},
  orderBy:{updatedAt:"desc"},
  include:{course:{select:{id:true,title:true,description:true,level:true,lessons:{select:{id:true}}}}}
 });

 const courses=await Promise.all(rows.map(async r=>({
  id:r.course.id,
  title:r.course.title,
  description:r.course.description,
  level:r.course.level,
  progress:r.progress,
  status:r.status,
  lessons:r.course.lessons.length,
  completed:await prisma.lessonProgress.count({where:{userId:s.user.id,lesson:{courseId:r.course.id},completed:true}})
 })));

 return NextResponse.json({courses});
}
