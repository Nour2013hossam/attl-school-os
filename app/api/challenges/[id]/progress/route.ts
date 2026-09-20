import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema=z.object({progress:z.number().int().min(0).max(100)});

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
 const session=await auth(); const {id}=await context.params;
 if(!session?.user?.id) return NextResponse.json({error:"Unauthorized"},{status:401});
 const parsed=schema.safeParse(await request.json());
 if(!parsed.success) return NextResponse.json({error:"Progress must be 0–100."},{status:400});
 const participation=await prisma.challengeParticipation.findUnique({where:{challengeId_userId:{challengeId:id,userId:session.user.id}},select:{id:true}});
 if(!participation) return NextResponse.json({error:"Join the challenge first."},{status:400});
 const updated=await prisma.challengeParticipation.update({where:{id:participation.id},data:{progress:parsed.data.progress,completedAt:parsed.data.progress===100?new Date():null}});
 return NextResponse.json({participation:updated});
}
