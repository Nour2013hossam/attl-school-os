import Link from "next/link";

export default function NotFound(){
  return <main className="grid min-h-screen place-items-center bg-[#eef3f8] px-5"><section className="max-w-lg rounded-[32px] border border-white/80 bg-white/70 p-8 text-center shadow-[0_25px_80px_rgba(20,30,50,.1)] backdrop-blur-2xl"><p className="text-[9px] font-semibold uppercase tracking-[.25em] text-blue-500">404</p><h1 className="mt-3 text-4xl font-semibold tracking-[-.06em]">Page not found.</h1><p className="mt-3 text-sm leading-6 text-black/40">The page you tried to open does not exist in ATTL School OS.</p><Link href="/" className="mt-6 inline-flex rounded-[15px] bg-black px-5 py-3 text-[9px] font-semibold text-white">Back home</Link></section></main>;
}