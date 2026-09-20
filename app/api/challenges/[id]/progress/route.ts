import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { hasPermission } from "@/lib/permissions";
import { applyXp } from "@/lib/xp";

const schema=z.object({progress:z.number().int().min(0).max(100)});

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
 const session=await auth(); const {id}=await context.params;
 if(!session?.user?.id) return NextResponse.json({error:"Unauthorized"},{status:401});
 if(!(await hasPermission(session.user.id,session.user.role,"challenges.participate")))return NextResponse.json({error:"Forbidden"},{status:403});
 const parsed=schema.safeParse(await request.json());
 if(!parsed.success) return NextResponse.json({error:"Progress must be 0–100."},{status:400});
 const participation=await prisma.challengeParticipation.findUnique({
   where:{challengeId_userId:{challengeId:id,userId:session.user.id}},
   select:{id:true,progress:true,completedAt:true}
 });
 const challenge=await prisma.challenge.findUnique({where:{id},select:{xpReward:true,title:true}});
 if(!challenge) return NextResponse.json({error:"Challenge not found."},{status:404});
 if(!participation) return NextResponse.json({error:"Join the challenge first."},{status:400});
 const isCompleting = parsed.data.progress === 100 && participation.progress < 100;
 const updated=await prisma.$transaction(async(tx)=>{
   const item=await tx.challengeParticipation.update({where:{id:participation.id},data:{progress:parsed.data.progress,completedAt:parsed.data.progress===100?(participation.completedAt??new Date()):null}});
   let rewardGranted=false;
   if(isCompleting && challenge.xpReward>0){
     const user=await tx.user.findUnique({where:{id:session.user.id},select:{xp:true,level:true}});
     if(user){
       const progression = applyXp(user.xp, challenge.xpReward);
       const xp = progression.xp;
       const level = progression.level;
       await tx.user.update({where:{id:session.user.id},data:{xp,level}});
       await tx.xpTransaction.create({data:{userId:session.user.id,delta:challenge.xpReward,balanceAfter:xp,reason:"Completed challenge: "+challenge.title,source:"CHALLENGE"}});
       await tx.xpTransaction.create({data:{userId:session.user.id,delta:challenge.xpReward,balanceAfter:xp,reason:"Completed challenge: "+challenge.title,source:"CHALLENGE"}});
       await tx.auditLog.create({data:{actorId:session.user.id,action:"CHALLENGE_XP_AWARDED",entity:"Challenge",entityId:id,metadata:{xpReward:challenge.xpReward,challenge:challenge.title}}});
       rewardGranted=true;
     }
   }
   return {item,rewardGranted};
 });
 return NextResponse.json({participation:updated.item,rewardGranted:updated.rewardGranted});
}
