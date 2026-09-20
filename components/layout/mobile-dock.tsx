"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePreferences, translateLabel } from "@/components/providers/preferences-provider";

const items = [
  {
    href: "/dashboard",
    label: "Home",
    icon: "⌂",
  },
  {
    href: "/dashboard/academics/overview",
    label: "Academic",
    icon: "◇",
  },
  {
    href: "/dashboard/projects/all",
    label: "Projects",
    icon: "✦",
  },
  {
    href: "/dashboard/attl/overview",
    label: "ATTL",
    icon: "A",
  },
  {
    href: "/dashboard/settings/account",
    label: "More",
    icon: "•••",
  },
];

export function MobileDock() {
  const pathname = usePathname();
  const { language } = usePreferences();

  return (
    <nav className="fixed bottom-4 left-3 right-3 z-50 lg:hidden">
      <div className="mx-auto flex max-w-[520px] items-center justify-between rounded-[26px] border border-white/90 bg-white/75 p-2 shadow-[0_18px_50px_rgba(20,30,50,0.16),inset_0_1px_0_white] backdrop-blur-[30px]">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" &&
              pathname.startsWith(item.href.split("/").slice(0, 3).join("/")));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-[20px] py-2 transition-all duration-300 ${
                active
                  ? "bg-black text-white shadow-lg"
                  : "text-black/35 hover:bg-white hover:text-black"
              }`}
            >
              <span className="text-sm">{item.icon}</span>
              <span className="text-[8px] font-medium">{translateLabel(item.label, language)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
