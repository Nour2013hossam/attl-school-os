import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request:Request){
 const s=await auth();if(!s?.user?.id)return NextResponse.json({error:"Unauthorized"},{status:401});
 const courseId=new URL(request.url).searchParams.get("courseId");
 if(!courseId)return NextResponse.json({error:"courseId is required."},{status:400});
 const [progress,enrollment]=await Promise.all([
   prisma.lessonProgress.findMany({where:{userId:s.user.id,lesson:{courseId}},select:{lessonId:true,completed:true}}),
   prisma.courseEnrollment.findUnique({where:{userId_courseId:{userId:s.user.id,courseId}}})
 ]);
 return NextResponse.json({progress,enrollment});
}
