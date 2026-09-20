"use client";
import Link from "next/link";
import{useEffect,useState}from"react";

type Bookmark={id:string;lesson?:{id:string;title:string;course:{id:string;title:string}}|null;resource?:{id:string;title:string;type:string;url:string|null;course:{id:string;title:string}|null}|null};

export default function BookmarksPage(){
 const[items,setItems]=useState<Bookmark[]>([]);
 async function load(){const r=await fetch("/api/learning/bookmarks",{cache:"no-store"});if(r.ok){const d=await r.json();setItems(d.bookmarks??[]);}}
 useEffect(()=>{load();},[]);
 async function remove(b:Bookmark){const body=b.lesson?{lessonId:b.lesson.id}:{resourceId:b.resource!.id};await fetch("/api/learning/bookmarks",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});load();}
 return <div className="space-y-6"><section className="rounded-[32px] bg-black p-7 text-white md:p-9"><p className="text-[9px] uppercase tracking-[.2em] text-blue-300">Learning</p><h1 className="mt-3 text-3xl font-semibold md:text-5xl">Bookmarks</h1><p className="mt-3 text-sm text-white/40">Your saved lessons and learning resources.</p></section><section className="grid gap-3 md:grid-cols-2">{items.map(b=>{const title=b.lesson?.title??b.resource?.title??"Saved item";const course=b.lesson?.course??b.resource?.course;return <article key={b.id} className="rounded-[25px] border border-white/80 bg-white/60 p-5 backdrop-blur-xl"><div className="flex items-start justify-between gap-3"><div><p className="text-[8px] uppercase tracking-[.16em] text-blue-600">{b.lesson?"Lesson":"Resource"}</p><h2 className="mt-2 text-sm font-semibold">{title}</h2><p className="mt-1 text-[9px] text-black/30">{course?.title??"Learning"}</p></div><button onClick={()=>remove(b)} className="rounded-[12px] bg-black/[.04] px-3 py-2 text-[8px]">Remove</button></div>{b.resource?.url&&<a href={b.resource.url} target="_blank" rel="noreferrer" className="mt-5 block rounded-[14px] bg-black px-4 py-2.5 text-center text-[8px] font-semibold text-white">Open resource</a>}{b.lesson&&<Link href={"/dashboard/learning/courses/"+b.lesson.course.id} className="mt-5 block rounded-[14px] bg-black px-4 py-2.5 text-center text-[8px] font-semibold text-white">Open course</Link>}</article>})}{items.length===0&&<div className="rounded-[24px] border border-dashed border-black/10 p-10 text-center text-[10px] text-black/30 md:col-span-2">No bookmarks yet. Save lessons and resources as you learn.</div>}</section></div>;
}
