import{NextResponse}from"next/server";import{auth}from"@/auth";import{prisma}from"@/lib/prisma";
export async function GET(_req:Request,ctx:{params:Promise<{id:string}>}){const s=await auth();const{id}=await ctx.params;if(!s?.user?.id)return NextResponse.json({error:"Unauthorized"},{status:401});
 const p=await prisma.project.findUnique({where:{id},select:{id:true,title:true,ownerId:true,visibility:true,members:{select:{userId:true}},tasks:{select:{status:true,dueAt:true}},milestones:{select:{status:true,progress:true,dueAt:true}}}});
 if(!p)return NextResponse.json({error:"Project not found."},{status:404});
 const member=p.ownerId===s.user.id||p.members.some(m=>m.userId===s.user.id)||["school","public"].includes(p.visibility);if(!member)return NextResponse.json({error:"Forbidden"},{status:403});
 const now=new Date();const tasks=p.tasks;const milestones=p.milestones;
 const done=tasks.filter(t=>t.status.toLowerCase()==="done").length;const inProgress=tasks.filter(t=>t.status.toLowerCase()==="in progress").length;
 const overdueTasks=tasks.filter(t=>t.dueAt&&t.dueAt<now&&t.status.toLowerCase()!=="done").length;const completedMilestones=milestones.filter(m=>m.progress>=100||m.status.toLowerCase()==="done").length;
 const averageMilestoneProgress=milestones.length?Math.round(milestones.reduce((a,m)=>a+m.progress,0)/milestones.length):0;
 return NextResponse.json({analytics:{totalTasks:tasks.length,doneTasks:done,inProgressTasks:inProgress,overdueTasks,totalMilestones:milestones.length,completedMilestones,averageMilestoneProgress,members:p.members.length}});
}
