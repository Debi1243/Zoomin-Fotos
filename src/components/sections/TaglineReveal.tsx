"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

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
 * ScrollTrigger watches the words; words on the same line cross together and light left to right,
 * 60ms apart. Visitors who prefer reduced motion see the full text straight away (globals.css).
 */
export default function TaglineReveal({ text, id = "tagline", className }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const words = gsap.utils.toArray<HTMLElement>(".tagline-word");
      const light = (group: Element[], gap: number) =>
        (group as HTMLElement[])
          .filter((w) => !w.classList.contains("is-lit"))
          .sort((a, b) => Number(a.dataset.i) - Number(b.dataset.i))
          .forEach((w, n) => {
            w.style.transitionDelay = `${n * gap}ms`;
            w.classList.add("is-lit");
          });

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        ScrollTrigger.batch(words, {
          // A word lights once its bottom edge rises past 60% of the screen height.
          start: "bottom 60%",
          once: true,
          onEnter: (group) => light(group, 60),
          // Words already scrolled past (an anchor link, a restored position) light at once.
          onLeave: (group) => light(group, 0),
        });
      });
      // Reduced motion: no triggers, the CSS already shows every word in full ink.
      return () => mm.revert();
    },
    { scope: ref },
  );

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
