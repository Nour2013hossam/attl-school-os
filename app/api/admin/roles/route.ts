import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ROLE_DEFINITIONS, PERMISSION_MATRIX, PERMISSION_CATALOG } from "@/lib/roles";
import { hasPermission } from "@/lib/permissions";

export async function GET(){
 const session=await auth();
 if(!session?.user?.id || !(await hasPermission(session.user.id,session.user.role,"roles.read"))) return NextResponse.json({error:"Forbidden"},{status:403});
 const [users,customRoles]=await Promise.all([
   prisma.user.count(),
   prisma.customRole.findMany({orderBy:{name:"asc"},include:{permissions:{include:{permission:true}},_count:{select:{users:true}}}})
 ]);
 return NextResponse.json({
   roles:ROLE_DEFINITIONS,
   matrix:PERMISSION_MATRIX,
   userCount:users,
   customRoles,
   catalog:PERMISSION_CATALOG.map(([key,name,category])=>({key,name,category}))
 });
}
