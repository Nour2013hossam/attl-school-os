import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PERMISSION_CATALOG } from "@/lib/roles";
import { hasPermission } from "@/lib/permissions";
import { z } from "zod";

const schema=z.object({name:z.string().trim().min(2).max(80).optional(),description:z.string().trim().max(500).nullable().optional(),active:z.boolean().optional(),permissionKeys:z.array(z.string()).max(PERMISSION_CATALOG.length).optional()});

async function admin(){
 const s=await auth();
 if(!s?.user?.id)return null;
 if(!(await hasPermission(s.user.id,s.user.role,"roles.manage")))return null;
 return s.user;
}

export async function PATCH(request:Request,context:{params:Promise<{id:string}>}){
 const s=await admin();const{id}=await context.params;if(!s)return NextResponse.json({error:"Forbidden"},{status:403});
 const parsed=schema.safeParse(await request.json());if(!parsed.success)return NextResponse.json({error:"Invalid custom role."},{status:400});
 const exists=await prisma.customRole.findUnique({where:{id}});if(!exists)return NextResponse.json({error:"Custom role not found."},{status:404});
 const keys=new Set<string>(PERMISSION_CATALOG.map(([key])=>key));
 const data=parsed.data;
 const role=await prisma.$transaction(async(tx)=>{
   const updated=await tx.customRole.update({where:{id},data:{name:data.name,description:data.description,active:data.active}});
   if(data.permissionKeys){
     const permissions=await tx.permission.findMany({where:{key:{in:data.permissionKeys.filter(k=>keys.has(k))}},select:{id:true}});
     await tx.customRolePermission.deleteMany({where:{roleId:id}});
     if(permissions.length)await tx.customRolePermission.createMany({data:permissions.map(p=>({roleId:id,permissionId:p.id})),skipDuplicates:true});
   }
   await tx.auditLog.create({data:{actorId:s.id,action:"CUSTOM_ROLE_UPDATED",entity:"CustomRole",entityId:id,metadata:{...data}}});
   return tx.customRole.findUnique({where:{id},include:{permissions:{include:{permission:true}},_count:{select:{users:true}}}});
 });
 return NextResponse.json({role});
}

export async function DELETE(_request:Request,context:{params:Promise<{id:string}>}){
 const s=await admin();const{id}=await context.params;if(!s)return NextResponse.json({error:"Forbidden"},{status:403});
 const role=await prisma.customRole.findUnique({where:{id},select:{id:true,_count:{select:{users:true}}}});if(!role)return NextResponse.json({error:"Custom role not found."},{status:404});
 if(role._count.users>0)return NextResponse.json({error:"Remove this role from its users before deleting it."},{status:409});
 await prisma.customRole.delete({where:{id}});
 await prisma.auditLog.create({data:{actorId:s.id,action:"CUSTOM_ROLE_DELETED",entity:"CustomRole",entityId:id}});
 return NextResponse.json({ok:true});
}
