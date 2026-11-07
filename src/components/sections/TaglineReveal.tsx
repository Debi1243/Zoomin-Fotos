"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** The benefit, at least two lines long. Each "\n" is a line break placed where the thought breaks. */
  text: string;
  id?: string;
  className?: string;
};

/**
 * One large statement of the core benefit, on its own further down the page.
 * Every word starts muted and turns to full ink, one at a time in reading order,
 * as it crosses a line 40% up from the bottom of the screen. Each word is lit once.
 * Visitors who prefer reduced motion see the full text straight away (globals.css).
 */
export default function TaglineReveal({ text, id = "tagline", className }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const words = Array.from(root.querySelectorAll<HTMLElement>(".tagline-word"));
    if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      words.forEach((w) => w.classList.add("is-lit"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        // Words on the same line cross together; light them left to right, 60ms apart.
        const crossing = entries
          .filter((e) => e.isIntersecting)
          .map((e) => e.target as HTMLElement)
          .sort((a, b) => Number(a.dataset.i) - Number(b.dataset.i));
        crossing.forEach((w, n) => {
          w.style.transitionDelay = `${n * 60}ms`;
          w.classList.add("is-lit");
          io.unobserve(w);
        });
      },
      { rootMargin: "0px 0px -40% 0px", threshold: 1 },
    );
    words.forEach((w) => io.observe(w));
    return () => io.disconnect();
  }, []);

  const lines = text.split("\n").map((line) => line.split(" "));
  const starts = lines.map((_, l) => lines.slice(0, l).reduce((n, words) => n + words.length, 0));
  return (
    <section aria-label="What you get" className={className ?? "section-y"}>
      <div className="container-page">
        <p ref={ref} id={id} className="mx-auto max-w-[680px] text-balance heading-3 md:heading-2 lg:heading-1">
          {lines.map((words, l) => (
            <span key={l} className="block">
              {words.map((word, w) => (
                <span key={w}>
                  <span className="tagline-word" data-i={starts[l] + w}>
                    {word}
                  </span>{" "}
                </span>
              ))}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
