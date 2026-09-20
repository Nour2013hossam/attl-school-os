import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { z } from "zod";
import { hasPermission } from "@/lib/permissions";

const roles=[UserRole.TRACK_LEAD,UserRole.ADMIN,UserRole.SUPER_ADMIN];
const schema=z.object({name:z.string().trim().min(2).max(100).optional(),description:z.string().trim().max(1000).nullable().optional(),active:z.boolean().optional()});

export async function PATCH(request:Request,context:{params:Promise<{id:string}>}){
 const session=await auth();const{id}=await context.params;
 if(!session?.user?.id||!roles.includes(session.user.role)||!(await hasPermission(session.user.id,session.user.role,"attl.tracks.manage")))return NextResponse.json({error:"Forbidden"},{status:403});
 const parsed=schema.safeParse(await request.json());if(!parsed.success)return NextResponse.json({error:"Invalid track update."},{status:400});
 const track=await prisma.attlTrack.update({where:{id},data:parsed.data});
 await prisma.auditLog.create({data:{actorId:session.user.id,action:"ATTL_TRACK_UPDATED",entity:"AttlTrack",entityId:id,metadata:parsed.data}});
 return NextResponse.json({track});
}
