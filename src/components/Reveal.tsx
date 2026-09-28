"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fades content in as it scrolls into view. The content is always rendered visible; the animation is
 * only added for elements that start below the fold, at the moment their top edge enters the viewport.
 * Nothing is ever left hidden — not without JavaScript, not in print, not in full-page screenshots.
 */
export default function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Already on screen when the page loads: leave it alone.
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setAnimate(true);
          io.disconnect();
        }
      },
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal${animate ? " animate" : ""}${className ? ` ${className}` : ""}`}>
      {children}
    </div>
  );
}
