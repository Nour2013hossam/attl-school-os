import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";
import { z } from "zod";

const schema=z.object({
 title:z.string().trim().min(2).max(180),
 description:z.string().trim().max(5000).nullable().optional(),
 startsAt:z.coerce.date(),
 endsAt:z.coerce.date(),
 location:z.string().trim().max(240).nullable().optional(),
 capacity:z.number().int().positive().max(100000).nullable().optional(),
});

export async function GET() {
 const events=await prisma.event.findMany({
  where:{endsAt:{gte:new Date()}},orderBy:{startsAt:"asc"},take:100,
  include:{_count:{select:{registrations:true}}},
 });
 return NextResponse.json({events});
}

export async function POST(request:Request){
 const s=await auth();
 if(!s?.user?.id || !(await hasPermission(s.user.id,s.user.role,"events.manage")))return NextResponse.json({error:"Forbidden"},{status:403});
 const parsed=schema.safeParse(await request.json());
 if(!parsed.success||parsed.data.endsAt<=parsed.data.startsAt)return NextResponse.json({error:"Invalid event schedule or event data."},{status:400});
 const e=await prisma.event.create({data:parsed.data});
 await prisma.auditLog.create({data:{actorId:s.user.id,action:"EVENT_CREATED",entity:"Event",entityId:e.id,metadata:{title:e.title}}});
 return NextResponse.json({event:e},{status:201});
}
