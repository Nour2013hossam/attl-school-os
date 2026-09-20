import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { z } from "zod";

const schema=z.object({
 title:z.string().trim().min(2).max(180),
 description:z.string().trim().max(5000).nullable().optional(),
 organizer:z.string().trim().max(180).nullable().optional(),
 startsAt:z.coerce.date().nullable().optional(),
 deadlineAt:z.coerce.date().nullable().optional(),
 location:z.string().trim().max(240).nullable().optional(),
 url:z.string().url().nullable().optional(),
});

export async function GET(){
 const competitions=await prisma.competition.findMany({where:{OR:[{deadlineAt:{gte:new Date()}},{deadlineAt:null}]},orderBy:[{deadlineAt:"asc"},{startsAt:"asc"}],take:100});
 return NextResponse.json({competitions});
}

export async function POST(request:Request){
 const s=await auth();if(!s?.user?.id||!(await hasPermission(s.user.id,s.user.role,"competitions.manage")))return NextResponse.json({error:"Forbidden"},{status:403});
 const parsed=schema.safeParse(await request.json());if(!parsed.success)return NextResponse.json({error:"Invalid competition data."},{status:400});
 if(parsed.data.deadlineAt && parsed.data.startsAt && parsed.data.deadlineAt>parsed.data.startsAt)return NextResponse.json({error:"Deadline must be before the competition starts."},{status:400});
 const c=await prisma.competition.create({data:parsed.data});
 await prisma.auditLog.create({data:{actorId:s.user.id,action:"COMPETITION_CREATED",entity:"Competition",entityId:c.id,metadata:{title:c.title}}});
 return NextResponse.json({competition:c},{status:201});
}
