import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";

export async function GET(){
 const s=await auth();if(!s?.user?.id)return NextResponse.json({error:"Unauthorized"},{status:401});if(!(await hasPermission(s.user.id,s.user.role,"learning.read")))return NextResponse.json({error:"Forbidden"},{status:403});if(!(await hasPermission(s.user.id,s.user.role,"learning.read")))return NextResponse.json({error:"Forbidden"},{status:403});
 const certificates=await prisma.certificate.findMany({where:{userId:s.user.id},orderBy:{issuedAt:"desc"},include:{course:{select:{id:true,title:true,description:true}}}});
 return NextResponse.json({certificates});
}
