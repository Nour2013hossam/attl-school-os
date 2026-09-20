import {NextResponse}from"next/server";import{auth}from"@/auth";import{prisma}from"@/lib/prisma";import{hasPermission}from"@/lib/permissions";
export async function GET(){const s=await auth();if(!s?.user?.id)return NextResponse.json({error:"Unauthorized"},{status:401});if(!(await hasPermission(s.user.id,s.user.role,"challenges.read")))return NextResponse.json({error:"Forbidden"},{status:403});
 const entries=await prisma.challengeParticipation.findMany({where:{progress:{gt:0}},include:{user:{select:{id:true,name:true,avatarUrl:true,role:true}},challenge:{select:{xpReward:true}}}});
 const map=new Map<string,{id:string;name:string;avatarUrl:string|null;role:string;completed:number;progress:number;xp:number}>();
 for(const e of entries){const current=map.get(e.userId)??{id:e.user.id,name:e.user.name,avatarUrl:e.user.avatarUrl,role:e.user.role,completed:0,progress:0,xp:0};current.progress+=e.progress;if(e.completedAt){current.completed+=1;current.xp+=e.challenge.xpReward;}map.set(e.userId,current);}
 const leaderboard=[...map.values()].sort((a,b)=>b.xp-a.xp||b.completed-a.completed||b.progress-a.progress).slice(0,50).map((item,index)=>({...item,rank:index+1}));
 return NextResponse.json({leaderboard,currentUser:leaderboard.find(x=>x.id===s.user.id)??null});
}