import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-3xl border border-black/5 bg-white/80 p-6 shadow-sm backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

