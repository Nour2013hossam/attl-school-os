import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export async function GET(){
 const session=await auth();
 const allowed:UserRole[]=[UserRole.ATTL_MEMBER,UserRole.TRACK_LEAD,UserRole.ADMIN,UserRole.SUPER_ADMIN];
 if(!session?.user?.id||!allowed.includes(session.user.role))return NextResponse.json({error:"Forbidden"},{status:403});
 const [members,tracks,projects]=await Promise.all([
  prisma.user.findMany({where:{isActive:true,role:{in:[UserRole.ATTL_MEMBER,UserRole.TRACK_LEAD]}},orderBy:[{role:"asc"},{name:"asc"}],select:{id:true,name:true,email:true,role:true,avatarUrl:true,bio:true,gradeLevel:true,className:true}}),
  prisma.attlTrack.findMany({where:{active:true},orderBy:{name:"asc"},include:{_count:{select:{applications:true}}}}),
  prisma.project.findMany({where:{owner:{role:{in:[UserRole.ATTL_MEMBER,UserRole.TRACK_LEAD]}}},orderBy:{updatedAt:"desc"},take:20,select:{id:true,title:true,status:true,progress:true,owner:{select:{name:true}}}})
 ]);
 return NextResponse.json({members,tracks,projects});
}
