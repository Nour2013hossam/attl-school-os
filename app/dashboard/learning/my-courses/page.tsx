"use client";
import Link from "next/link";
import {useEffect,useState} from "react";

type Item={id:string;title:string;description:string|null;level:string|null;progress:number;status:string;lessons:number;completed:number};

export default function MyCoursesPage(){
 const[items,setItems]=useState<Item[]>([]);
 useEffect(()=>{fetch("/api/courses/my",{cache:"no-store"}).then(r=>r.json()).then(d=>setItems(d.courses??[]));},[]);
 return <div className="space-y-6"><section className="rounded-[32px] bg-black p-7 text-white md:p-9"><p className="text-[9px] uppercase tracking-[.2em] text-blue-300">Learning</p><h1 className="mt-3 text-3xl font-semibold md:text-5xl">My Courses</h1><p className="mt-3 text-sm text-white/40">Your enrolled courses and real learning progress.</p></section><section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{items.map(c=><Link key={c.id} href={"/dashboard/learning/courses/"+c.id} className="rounded-[26px] border border-white/80 bg-white/60 p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white"><div className="flex items-center justify-between"><span className="rounded-full bg-blue-500/10 px-3 py-1 text-[8px] text-blue-600">{c.status}</span><span className="text-[8px] text-black/25">{c.completed}/{c.lessons}</span></div><h2 className="mt-4 text-base font-semibold">{c.title}</h2><p className="mt-2 text-[10px] text-black/35">{c.description??"No description provided."}</p><div className="mt-5 h-2 overflow-hidden rounded-full bg-black/5"><div className="h-full rounded-full bg-black" style={{width:c.progress+"%"}}/></div><div className="mt-2 flex justify-between text-[8px] text-black/30"><span>Progress</span><span>{c.progress}%</span></div></Link>)}{items.length===0&&<div className="rounded-[24px] border border-dashed border-black/10 p-10 text-center text-[10px] text-black/30 md:col-span-2 xl:col-span-3">You are not enrolled in any courses yet.</div>}</section></div>;
}
