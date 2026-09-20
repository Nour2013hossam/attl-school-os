import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { hasPermission } from "@/lib/permissions";
import { z } from "zod";

const schema=z.object({customRoleId:z.string().nullable()});

export async function PATCH(request:Request,context:{params:Promise<{id:string}>}){
 const s=await auth();const{id}=await context.params;
 if(!s?.user?.id||![UserRole.ADMIN,UserRole.SUPER_ADMIN].includes(s.user.role)||!(await hasPermission(s.user.id,s.user.role,"roles.assign")))return NextResponse.json({error:"Forbidden"},{status:403});
 const parsed=schema.safeParse(await request.json());if(!parsed.success)return NextResponse.json({error:"Invalid custom role."},{status:400});
 if(id===s.user.id)return NextResponse.json({error:"Use a different admin account to change your own access."},{status:400});
 if(parsed.data.customRoleId){
   const role=await prisma.customRole.findUnique({where:{id:parsed.data.customRoleId},select:{id:true,active:true}});
   if(!role||!role.active)return NextResponse.json({error:"Custom role is unavailable."},{status:404});
 }
 const target=await prisma.user.findUnique({where:{id},select:{id:true,role:true}});
 if(!target)return NextResponse.json({error:"User not found."},{status:404});
 const updated=await prisma.user.update({where:{id},data:{customRoleId:parsed.data.customRoleId},select:{id:true,name:true,email:true,role:true,customRole:{select:{id:true,name:true,active:true}}}});
 await prisma.auditLog.create({data:{actorId:s.user.id,action:"USER_CUSTOM_ROLE_UPDATED",entity:"User",entityId:id,metadata:{customRoleId:parsed.data.customRoleId}}});
 return NextResponse.json({user:updated});
}
