"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({reset}:{error:Error & {digest?:string};reset:()=>void}){
  useEffect(()=>{console.error("ATTL School OS error",error);},[error]);
  return <main className="grid min-h-screen place-items-center bg-[#eef3f8] px-5"><section className="max-w-lg rounded-[32px] border border-red-500/10 bg-white/75 p-8 text-center shadow-[0_25px_80px_rgba(20,30,50,.08)] backdrop-blur-2xl"><p className="text-[9px] font-semibold uppercase tracking-[.25em] text-red-500">Something went wrong</p><h1 className="mt-3 text-3xl font-semibold tracking-[-.05em]">The workspace hit an error.</h1><p className="mt-3 text-sm leading-6 text-black/40">Try again or return to the School OS home.</p><div className="mt-6 flex justify-center gap-2"><button onClick={()=>reset()} className="rounded-[15px] bg-black px-5 py-3 text-[9px] font-semibold text-white">Try again</button><Link href="/" className="rounded-[15px] bg-black/[.04] px-5 py-3 text-[9px] font-semibold text-black/55">Home</Link></div></section></main>;
}