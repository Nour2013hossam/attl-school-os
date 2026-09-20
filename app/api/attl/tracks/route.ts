import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { z } from "zod";
import { hasPermission } from "@/lib/permissions";

const managerRoles=[UserRole.TRACK_LEAD,UserRole.ADMIN,UserRole.SUPER_ADMIN];
const schema=z.object({name:z.string().trim().min(2).max(100),description:z.string().trim().max(1000).nullable().optional(),active:z.boolean().optional()});

export async function GET(){
 const tracks=await prisma.attlTrack.findMany({where:{active:true},orderBy:{name:"asc"}});
 return NextResponse.json({tracks});
}
export async function POST(request:Request){
 const session=await auth();
 if(!session?.user?.id||!managerRoles.includes(session.user.role)||!(await hasPermission(session.user.id,session.user.role,"attl.tracks.manage")))return NextResponse.json({error:"Forbidden"},{status:403});
 const parsed=schema.safeParse(await request.json());
 if(!parsed.success)return NextResponse.json({error:"Invalid track data."},{status:400});
 const track=await prisma.attlTrack.create({data:{name:parsed.data.name,description:parsed.data.description??null,active:parsed.data.active??true}});
 await prisma.auditLog.create({data:{actorId:session.user.id,action:"ATTL_TRACK_CREATED",entity:"AttlTrack",entityId:track.id,metadata:{name:track.name}}});
 return NextResponse.json({track},{status:201});
}
