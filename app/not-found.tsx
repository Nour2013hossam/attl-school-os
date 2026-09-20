import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#eef3f8] px-5 py-16 text-black">
      <div className="mx-auto max-w-xl rounded-[32px] border border-white/90 bg-white/70 p-8 text-center shadow-[0_25px_90px_rgba(30,45,70,.1)] backdrop-blur-2xl md:p-10">
        <div className="text-6xl font-semibold tracking-[-.08em]">404</div>
        <p className="mt-3 text-[9px] font-semibold uppercase tracking-[.22em] text-blue-500">ATTL School OS</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-[-.05em]">Page not found.</h1>
        <p className="mt-3 text-sm leading-6 text-black/42">That workspace does not exist or is no longer available.</p>
        <Link href="/dashboard" className="mt-6 inline-flex rounded-[14px] bg-black px-5 py-3 text-[9px] font-semibold text-white">Back to dashboard</Link>
      </div>
    </main>
  );
}
