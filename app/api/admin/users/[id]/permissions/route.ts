import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { PERMISSION_CATALOG } from "@/lib/roles";
import { getEffectivePermissions, hasPermission } from "@/lib/permissions";

async function requireAdmin() {
  const session=await auth();
  if(!session?.user?.id) return null;
  return session.user;
}

export async function GET(_request:Request,context:{params:Promise<{id:string}>}) {
  const admin=await requireAdmin(); const {id}=await context.params;
  if(!admin || !(await hasPermission(admin.id, admin.role, "permissions.read"))) return NextResponse.json({error:"Forbidden"},{status:403});

  const user=await prisma.user.findUnique({
    where:{id},
    select:{id:true,name:true,email:true,role:true,isActive:true,permissions:{include:{permission:true}}},
  });
  if(!user) return NextResponse.json({error:"User not found."},{status:404});

  return NextResponse.json({
    user,
    catalog:PERMISSION_CATALOG.map(([key,name,category])=>({key,name,category})),
    effective:await getEffectivePermissions(user.id,user.role),
    overrides:user.permissions.map((p)=>({key:p.permission.key,granted:p.granted})),
  });
}

export async function PATCH(request:Request,context:{params:Promise<{id:string}>}) {
  const admin=await requireAdmin(); const {id}=await context.params;
  if(!admin || !(await hasPermission(admin.id, admin.role, "permissions.manage"))) return NextResponse.json({error:"Forbidden"},{status:403});
  if(admin.id===id) return NextResponse.json({error:"Manage another account's permissions from an admin account."},{status:400});

  const target=await prisma.user.findUnique({where:{id},select:{id:true,role:true,name:true}});
  if(!target) return NextResponse.json({error:"User not found."},{status:404});
  if(target.role===UserRole.SUPER_ADMIN && admin.role!==UserRole.SUPER_ADMIN) return NextResponse.json({error:"Only a Super Admin can change Super Admin overrides."},{status:403});

  const body=await request.json();
  if(!Array.isArray(body.updates)) return NextResponse.json({error:"updates must be an array."},{status:400});

  const catalogKeys=new Set(PERMISSION_CATALOG.map(([key])=>key));
  const updates=body.updates.filter((item:{key?:unknown;granted?:unknown})=>typeof item.key==="string" && catalogKeys.has(item.key) && typeof item.granted==="boolean") as {key:string;granted:boolean}[];

  await prisma.$transaction(async(tx)=>{
    for(const item of updates){
      const permission=await tx.permission.findUnique({where:{key:item.key},select:{id:true}});
      if(!permission) continue;
      await tx.userPermission.upsert({
        where:{userId_permissionId:{userId:id,permissionId:permission.id}},
        update:{granted:item.granted},
        create:{userId:id,permissionId:permission.id,granted:item.granted},
      });
    }
    await tx.auditLog.create({
      data:{actorId:admin.id,action:"USER_PERMISSIONS_UPDATED",entity:"User",entityId:id,metadata:{updates}},
    });
  });

  return NextResponse.json({ok:true,effective:await getEffectivePermissions(id,target.role)});
}
