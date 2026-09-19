"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const haloRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const halo = haloRef.current;
    if (!halo) return;

    let mouseX = -100;
    let mouseY = -100;
    let haloX = -100;
    let haloY = -100;
    let lastTime = performance.now();
    let frame = 0;

    const move = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const animate = (time: number) => {
      const delta = Math.min(time - lastTime, 32);
      lastTime = time;

      // Fast + smooth follow
      const ease = 1 - Math.pow(0.0008, delta / 16.67);

      haloX += (mouseX - haloX) * ease;
      haloY += (mouseY - haloY) * ease;

      halo.style.transform =
        `translate3d(${haloX}px, ${haloY}px, 0) translate(-50%, -50%)`;

      frame = requestAnimationFrame(animate);
    };

    const updateHover = (target: EventTarget | null) => {
      const element = target as HTMLElement | null;

      if (element?.closest("a, button, [data-cursor]")) {
        halo.classList.add("halo-hover");
      } else {
        halo.classList.remove("halo-hover");
      }
    };

    const mouseOver = (event: MouseEvent) => {
      updateHover(event.target);
    };

    const mouseOut = (event: MouseEvent) => {
      updateHover(event.relatedTarget);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", mouseOver);
    window.addEventListener("mouseout", mouseOut);

    frame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", mouseOver);
      window.removeEventListener("mouseout", mouseOut);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={haloRef}
      className="liquid-cursor-halo pointer-events-none fixed left-0 top-0 z-[9999]"
      aria-hidden="true"
    >
      <div className="liquid-cursor-core" />
    </div>
  );
}