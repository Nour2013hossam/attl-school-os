import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { ROLE_DEFINITIONS, PERMISSION_MATRIX } from "@/lib/roles";
import { hasPermission } from "@/lib/permissions";

export async function GET(){
 const session=await auth();
 if(!session?.user?.id || ![UserRole.ADMIN,UserRole.SUPER_ADMIN].includes(session.user.role) || !(await hasPermission(session.user.id, session.user.role, "roles.read"))) return NextResponse.json({error:"Forbidden"},{status:403});
 const users=await prisma.user.count();
 return NextResponse.json({roles:ROLE_DEFINITIONS,matrix:PERMISSION_MATRIX,userCount:users});
}
