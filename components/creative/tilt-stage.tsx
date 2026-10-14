"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** Drives three CSS custom properties on its own element: --px/--py (pointer, -1..1) and
    --explode (0..1 with scroll). Children stay server-rendered; reduced motion adds no listeners. */
export function TiltStage({ children, className }: Readonly<{ children: ReactNode; className?: string }>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const target = { x: 0, y: 0, explode: 0 };
    const current = { x: 0, y: 0, explode: 0 };
    let frame = 0;

    function step() {
      frame = 0;
      let moving = false;
      for (const key of ["x", "y", "explode"] as const) {
        const delta = target[key] - current[key];
        if (Math.abs(delta) > 0.001) { current[key] += delta * 0.08; moving = true; }
        else current[key] = target[key];
      }
      element!.style.setProperty("--px", current.x.toFixed(3));
      element!.style.setProperty("--py", current.y.toFixed(3));
      element!.style.setProperty("--explode", current.explode.toFixed(3));
      if (moving) frame = requestAnimationFrame(step);
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(step); }
    function onPointer(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      target.x = clamp((event.clientX / window.innerWidth) * 2 - 1, -1, 1);
      target.y = clamp((event.clientY / window.innerHeight) * 2 - 1, -1, 1);
      schedule();
    }
    function onScroll() {
      target.explode = clamp(window.scrollY / (window.innerHeight * 0.85), 0, 1);
      schedule();
    }

    onScroll();
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <div ref={ref} className={className}>{children}</div>;
}
