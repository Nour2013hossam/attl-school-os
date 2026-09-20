import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { PERMISSION_CATALOG } from "@/lib/roles";
import { hasPermission } from "@/lib/permissions";
import { z } from "zod";

const schema=z.object({
  name:z.string().trim().min(2).max(80),
  description:z.string().trim().max(500).nullable().optional(),
  permissionKeys:z.array(z.string()).max(PERMISSION_CATALOG.length).default([]),
});

async function admin(){
  const s=await auth();
  if(!s?.user?.id) return null;
  if(!(await hasPermission(s.user.id,s.user.role,"roles.manage"))) return null;
  return s.user;
}

export async function GET(){
  const s=await admin(); if(!s)return NextResponse.json({error:"Forbidden"},{status:403});
  const roles=await prisma.customRole.findMany({
    orderBy:{name:"asc"},
    include:{permissions:{include:{permission:true}},_count:{select:{users:true}}}
  });
  return NextResponse.json({roles, catalog:PERMISSION_CATALOG.map(([key,name,category])=>({key,name,category}))});
}

export async function POST(request:Request){
 const s=await admin(); if(!s)return NextResponse.json({error:"Forbidden"},{status:403});
 const parsed=schema.safeParse(await request.json()); if(!parsed.success)return NextResponse.json({error:"Invalid custom role."},{status:400});
 const keys=new Set(PERMISSION_CATALOG.map(([key])=>key));
 const permissionKeys=parsed.data.permissionKeys.filter(k=>keys.has(k));
 try{
  const role=await prisma.$transaction(async(tx)=>{
    const created=await tx.customRole.create({data:{name:parsed.data.name,description:parsed.data.description??null,createdById:s.id}});
    for(const key of permissionKeys){
      const permission=await tx.permission.findUnique({where:{key},select:{id:true}});
      if(permission)await tx.customRolePermission.create({data:{roleId:created.id,permissionId:permission.id}});
    }
    await tx.auditLog.create({data:{actorId:s.id,action:"CUSTOM_ROLE_CREATED",entity:"CustomRole",entityId:created.id,metadata:{permissionKeys}}});
    return tx.customRole.findUnique({where:{id:created.id},include:{permissions:{include:{permission:true}},_count:{select:{users:true}}}});
  });
  return NextResponse.json({role},{status:201});
 }catch{return NextResponse.json({error:"Role name already exists or could not be created."},{status:409});}
}
