import{NextResponse}from"next/server";import{auth}from"@/auth";import{prisma}from"@/lib/prisma";import{UserRole}from"@prisma/client";import{hasPermission}from"@/lib/permissions";
export async function PATCH(req:Request,ctx:{params:Promise<{id:string;milestoneId:string}>}){
 const s=await auth();const{id,milestoneId}=await ctx.params;if(!s?.user?.id)return NextResponse.json({error:"Unauthorized"},{status:401});
 const p=await prisma.project.findUnique({where:{id},select:{ownerId:true}});if(!p)return NextResponse.json({error:"Project not found."},{status:404});
 if(!(p.ownerId===s.user.id||[UserRole.ADMIN,UserRole.SUPER_ADMIN].includes(s.user.role))||!(await hasPermission(s.user.id,s.user.role,"projects.manage")))return NextResponse.json({error:"Forbidden"},{status:403});
 const b=await req.json();const data:any={};if(typeof b.title==="string")data.title=b.title.trim();if(typeof b.description==="string"||b.description===null)data.description=b.description;if(b.dueAt!==undefined)data.dueAt=b.dueAt?new Date(b.dueAt):null;if(b.progress!==undefined)data.progress=Math.max(0,Math.min(100,Number(b.progress)||0));if(typeof b.status==="string")data.status=b.status;
 const m=await prisma.projectMilestone.update({where:{id:milestoneId},data});return NextResponse.json({milestone:m});
}
