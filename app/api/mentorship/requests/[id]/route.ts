import{NextResponse}from"next/server";import{auth}from"@/auth";import{prisma}from"@/lib/prisma";import{UserRole,NotificationType}from"@prisma/client";import{hasPermission}from"@/lib/permissions";
export async function PATCH(request:Request,context:{params:Promise<{id:string}>}){
 const s=await auth();const{id}=await context.params;if(!s?.user?.id)return NextResponse.json({error:"Unauthorized"},{status:401});
 const row=await prisma.mentorshipRequest.findUnique({where:{id},select:{id:true,mentorId:true,menteeId:true,status:true}});
 if(!row)return NextResponse.json({error:"Request not found."},{status:404});
 const body=await request.json();const action=body.action;
 if(row.mentorId===s.user.id&&(await hasPermission(s.user.id,s.user.role,"mentorship.manage"))){
   if(!["Accepted","Rejected"].includes(action))return NextResponse.json({error:"Invalid mentor action."},{status:400});
 }else if(row.menteeId===s.user.id){
   if(action!=="Cancelled")return NextResponse.json({error:"You can only cancel your own request."},{status:400});
 }else return NextResponse.json({error:"Forbidden"},{status:403});
 const updated=await prisma.mentorshipRequest.update({where:{id},data:{status:action}});
 const notifyUser=row.mentorId===s.user.id?row.menteeId:row.mentorId;
 await prisma.notification.create({data:{userId:notifyUser,title:"Mentorship request updated",body:"Your mentorship request status is now "+action+".",type:NotificationType.MENTORSHIP}});
 return NextResponse.json({request:updated});
}
