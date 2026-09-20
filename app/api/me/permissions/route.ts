import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getEffectivePermissions } from "@/lib/permissions";

export async function GET(){
 const session=await auth();
 if(!session?.user?.id)return NextResponse.json({error:"Unauthorized"},{status:401});
 return NextResponse.json({role:session.user.role,permissions:await getEffectivePermissions(session.user.id,session.user.role)});
}
