"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePreferences, translateLabel } from "@/components/providers/preferences-provider";

const commands = [
  { label: "Overview", description: "Your school dashboard", href: "/dashboard", icon: "⌂" },
  { label: "My Profile", description: "Your student identity", href: "/dashboard/student", icon: "○" },
  { label: "Academics", description: "Grades and academic progress", href: "/dashboard/academics", icon: "◇" },
  { label: "Projects", description: "Build and manage projects", href: "/dashboard/projects", icon: "✦" },
  { label: "Competitions", description: "Competitions and challenges", href: "/dashboard/competitions", icon: "◈" },
  { label: "Skills", description: "Track your skill growth", href: "/dashboard/skills", icon: "◎" },
  { label: "ATTL", description: "Al Thagr Technical Lab", href: "/dashboard/attl", icon: "A" },
  { label: "Settings", description: "Customize your experience", href: "/dashboard/settings", icon: "⚙" },
];

export function CommandCenter() {
  const { language } = usePreferences();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);

  const filtered = useMemo(() => {
    const value = query.toLowerCase().trim();

    if (!value) return commands;

    return commands.filter(
      (command) =>
        command.label.toLowerCase().includes(value) ||
        command.description.toLowerCase().includes(value)
    );
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
        setQuery("");
        setSelected(0);
      }

      if (event.key === "/" && !open) {
        const target = event.target as HTMLElement;

        if (
          target.tagName !== "INPUT" &&
          target.tagName !== "TEXTAREA" &&
          !target.isContentEditable
        ) {
          event.preventDefault();
          setOpen(true);
          setQuery("");
          setSelected(0);
        }
      }

      if (event.key === "Escape") {
        setOpen(false);
      }

      if (!open) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelected((current) =>
          Math.min(current + 1, Math.max(filtered.length - 1, 0))
        );
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelected((current) => Math.max(current - 1, 0));
      }

      if (event.key === "Enter" && filtered[selected]) {
        window.location.href = filtered[selected].href;
      }
    };

    const handleOpen = () => {
      setOpen(true);
      setQuery("");
      setSelected(0);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-center", handleOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-center", handleOpen);
    };
  }, [open, filtered, selected]);

  useEffect(() => {
    if (selected >= filtered.length) {
      setSelected(Math.max(filtered.length - 1, 0));
    }
  }, [filtered, selected]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh] md:pt-[16vh]"
      onMouseDown={() => setOpen(false)}
    >
      <div className="command-backdrop absolute inset-0" />

      <div
        className="command-window relative w-full max-w-[680px] overflow-hidden rounded-[30px] border border-white/80 bg-white/75 shadow-[0_35px_100px_rgba(10,20,40,0.22)] backdrop-blur-[35px]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-black/5 px-5 py-4">
          <span className="text-xl text-black/35">⌕</span>

          <input
            autoFocus
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelected(0);
            }}
            placeholder={language === "ar" ? "ابحث في نظام مدرسة ATTL..." : "Search ATTL School OS..."}
            className="h-9 flex-1 bg-transparent text-sm outline-none placeholder:text-black/30"
          />

          <kbd className="hidden rounded-lg border border-black/10 bg-black/5 px-2 py-1 text-[10px] text-black/35 sm:block">
            ESC
          </kbd>
        </div>

        <div className="max-h-[430px] overflow-y-auto p-2">
          {filtered.length > 0 ? (
            filtered.map((command, index) => (
              <Link
                key={command.href}
                href={command.href}
                onClick={() => setOpen(false)}
                className={`group flex items-center gap-3 rounded-[20px] px-3 py-3 transition-all duration-200 ${
                  selected === index
                    ? "bg-black text-white shadow-lg"
                    : "text-black hover:bg-white/70"
                }`}
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-[14px] text-sm ${
                    selected === index
                      ? "bg-white/15 text-white"
                      : "bg-black/5 text-black/45"
                  }`}
                >
                  {command.icon}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">
                    {translateLabel(command.label, language)}
                  </span>
                  <span
                    className={`block truncate text-[10px] ${
                      selected === index ? "text-white/45" : "text-black/35"
                    }`}
                  >
                    {translateLabel(command.description, language)}
                  </span>
                </span>

                <span
                  className={`text-xs ${
                    selected === index ? "text-white/35" : "text-black/20"
                  }`}
                >
                  →
                </span>
              </Link>
            ))
          ) : (
            <div className="px-5 py-12 text-center">
              <div className="text-3xl">⌕</div>
              <p className="mt-3 text-sm font-medium">{language === "ar" ? "لا توجد نتائج" : "No results"}</p>
              <p className="mt-1 text-xs text-black/35">
                {language === "ar" ? "جرّب بحثًا آخر." : "Try another search."}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-black/5 px-5 py-3 text-[10px] text-black/30">
          <span>{language === "ar" ? "انتقل إلى أي مكان في ATTL" : "Navigate anywhere in ATTL"}</span>
          <div className="flex items-center gap-2">
            <span>↑ ↓</span>
            <span>Enter</span>
          </div>
        </div>
      </div>
    </div>
  );
}
