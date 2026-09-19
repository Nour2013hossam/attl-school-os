import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="text-xl font-bold tracking-tight">
          ATTL<span className="text-blue-600">.</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-black/60 md:flex">
          <Link href="/" className="transition hover:text-black">
            Home
          </Link>
          <Link href="/dashboard" className="transition hover:text-black">
            Dashboard
          </Link>
          <Link href="/projects" className="transition hover:text-black">
            Projects
          </Link>
        </nav>

        <button className="rounded-full border border-black/10 px-4 py-2 text-sm transition hover:bg-black hover:text-white">
          EN
        </button>
      </div>
    </header>
  );
}

