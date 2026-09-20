import {NextResponse} from"next/server";
import{auth}from"@/auth";import{prisma}from"@/lib/prisma";import{UserRole}from"@prisma/client";import{hasPermission}from"@/lib/permissions";

async function access(projectId:string,userId:string,role:UserRole){
 const p=await prisma.project.findUnique({where:{id:projectId},select:{ownerId:true,members:{select:{userId:true}}}});
 if(!p)return null;
 const member=p.ownerId===userId||p.members.some(m=>m.userId===userId);
 const manage=(p.ownerId===userId||[UserRole.ADMIN,UserRole.SUPER_ADMIN].includes(role))&&await hasPermission(userId,role,"projects.manage");
 return{member,manage};
}
export async function GET(_req:Request,ctx:{params:Promise<{id:string}>}){
 const s=await auth();const{id}=await ctx.params;if(!s?.user?.id)return NextResponse.json({error:"Unauthorized"},{status:401});
 const a=await access(id,s.user.id,s.user.role);if(!a?.member&&!a?.manage)return NextResponse.json({error:"Forbidden"},{status:403});
 const milestones=await prisma.projectMilestone.findMany({where:{projectId:id},orderBy:{dueAt:"asc"}});
 return NextResponse.json({milestones});
}
export async function POST(req:Request,ctx:{params:Promise<{id:string}>}){
 const s=await auth();const{id}=await ctx.params;if(!s?.user?.id)return NextResponse.json({error:"Unauthorized"},{status:401});
 const a=await access(id,s.user.id,s.user.role);if(!a?.manage)return NextResponse.json({error:"Forbidden"},{status:403});
 const b=await req.json();if(typeof b.title!=="string"||b.title.trim().length<2)return NextResponse.json({error:"Title is required."},{status:400});
 const m=await prisma.projectMilestone.create({data:{projectId:id,title:b.title.trim(),description:typeof b.description==="string"?b.description.trim()||null:null,dueAt:b.dueAt?new Date(b.dueAt):null,progress:Math.max(0,Math.min(100,Number(b.progress)||0)),status:typeof b.status==="string"?b.status:"Planned"}});
 return NextResponse.json({milestone:m},{status:201});
}
