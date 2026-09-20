import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";

export async function POST(_request:Request,context:{params:Promise<{id:string}>}){
 const s=await auth();const{id}=await context.params;if(!s?.user?.id)return NextResponse.json({error:"Unauthorized"},{status:401});
 if(!(await hasPermission(s.user.id,s.user.role,"learning.enroll")))return NextResponse.json({error:"Forbidden"},{status:403});
 const course=await prisma.course.findUnique({where:{id},select:{id:true,published:true}});
 if(!course||!course.published)return NextResponse.json({error:"Course not available."},{status:404});
 const enrollment=await prisma.courseEnrollment.upsert({where:{userId_courseId:{userId:s.user.id,courseId:id}},update:{status:"ACTIVE"},create:{userId:s.user.id,courseId:id,status:"ACTIVE"}});
 return NextResponse.json({enrollment});
}
