import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(){
 const s=await auth();if(!s?.user?.id)return NextResponse.json({error:"Unauthorized"},{status:401});
 const bookmarks=await prisma.bookmark.findMany({where:{userId:s.user.id},orderBy:{createdAt:"desc"},include:{lesson:{select:{id:true,title:true,course:{select:{id:true,title:true}}},resource:{select:{id:true,title:true,type:true,url:true,course:{select:{id:true,title:true}}}}}});
 return NextResponse.json({bookmarks});
}

export async function POST(request:Request){
 const s=await auth();if(!s?.user?.id)return NextResponse.json({error:"Unauthorized"},{status:401});
 const body=await request.json();const lessonId=typeof body.lessonId==="string"?body.lessonId:null;const resourceId=typeof body.resourceId==="string"?body.resourceId:null;
 if((lessonId?1:0)+(resourceId?1:0)!==1)return NextResponse.json({error:"Provide either lessonId or resourceId."},{status:400});
 const existing=await prisma.bookmark.findFirst({where:{userId:s.user.id,lessonId,resourceId}});
 if(existing){await prisma.bookmark.delete({where:{id:existing.id}});return NextResponse.json({bookmarked:false});}
 const bookmark=await prisma.bookmark.create({data:{userId:s.user.id,lessonId,resourceId}});
 return NextResponse.json({bookmarked:true,bookmark},{status:201});
}
