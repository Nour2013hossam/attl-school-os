import{NextResponse}from"next/server";import{auth}from"@/auth";import{prisma}from"@/lib/prisma";import{hasPermission}from"@/lib/permissions";
export async function GET(){const s=await auth();if(!s?.user?.id)return NextResponse.json({error:"Unauthorized"},{status:401});if(!(await hasPermission(s.user.id,s.user.role,"mentorship.request")))return NextResponse.json({error:"Forbidden"},{status:403});
 const sessions=await prisma.mentorshipSession.findMany({where:{OR:[{menteeId:s.user.id},{mentorId:s.user.id}]},orderBy:{startsAt:"asc"},include:{mentor:{select:{id:true,name:true,avatarUrl:true}},mentee:{select:{id:true,name:true,avatarUrl:true}}}});
 return NextResponse.json({sessions});
}
export async function POST(req:Request){const s=await auth();if(!s?.user?.id)return NextResponse.json({error:"Unauthorized"},{status:401});
 const b=await req.json();if(typeof b.requestId!=="string"||!b.startsAt||!b.endsAt)return NextResponse.json({error:"Request, start and end are required."},{status:400});
 const row=await prisma.mentorshipRequest.findUnique({where:{id:b.requestId},select:{id:true,menteeId:true,mentorId:true,status:true}});if(!row)return NextResponse.json({error:"Request not found."},{status:404});if(row.status!=="Accepted")return NextResponse.json({error:"The request must be accepted first."},{status:409});
 if(s.user.id!==row.mentorId&&s.user.id!==row.menteeId)return NextResponse.json({error:"Forbidden"},{status:403});
 if(s.user.id===row.mentorId&&!(await hasPermission(s.user.id,s.user.role,"mentorship.manage")))return NextResponse.json({error:"You do not have mentorship scheduling permission."},{status:403});
 const startsAt=new Date(b.startsAt),endsAt=new Date(b.endsAt);if(!(endsAt>startsAt))return NextResponse.json({error:"End time must be after start time."},{status:400});
 const session=await prisma.mentorshipSession.create({data:{requestId:row.id,menteeId:row.menteeId,mentorId:row.mentorId,startsAt,endsAt,notes:typeof b.notes==="string"?b.notes.trim()||null:null}});
 await prisma.notification.create({data:{userId:s.user.id===row.mentorId?row.menteeId:row.mentorId,title:"Mentorship session scheduled",body:"A mentorship session has been scheduled.",type:"MENTORSHIP"}});
 return NextResponse.json({session},{status:201});
}