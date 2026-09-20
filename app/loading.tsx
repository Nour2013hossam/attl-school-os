export default function Loading() {
  return (
    <main className="min-h-screen bg-[#eef3f8] px-5 py-10">
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="h-6 w-28 animate-pulse rounded-full bg-white/80" />
        <div className="h-20 w-3/4 animate-pulse rounded-[28px] bg-white/65" />
        <div className="grid gap-3 md:grid-cols-3">
          {[1,2,3].map((item) => <div key={item} className="h-40 animate-pulse rounded-[26px] bg-white/60" />)}
        </div>
      </div>
    </main>
  );
}
