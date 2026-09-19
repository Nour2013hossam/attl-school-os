"use client";

import { useRef } from "react";

export function Spotlight({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateX = ((y / rect.height) - 0.5) * -2.5;
    const rotateY = ((x / rect.width) - 0.5) * 2.5;

    element.style.setProperty("--spotlight-x", `${x}px`);
    element.style.setProperty("--spotlight-y", `${y}px`);
    element.style.setProperty("--spotlight-opacity", "1");

    element.style.transform =
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleLeave = () => {
    const element = ref.current;
    if (!element) return;

    element.style.setProperty("--spotlight-opacity", "0");
    element.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`spotlight-card relative overflow-hidden ${className}`}
    >
      <div className="spotlight-light pointer-events-none absolute inset-0 z-0" />

      <div className="spotlight-reflection pointer-events-none absolute inset-0 z-0" />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}