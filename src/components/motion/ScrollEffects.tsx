"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

/** Elements that rise or slide in once as they enter the screen, and where they start from. */
const SLIDES = [
  { sel: ".reveal, .stagger-in", from: { y: 32 } },
  { sel: ".reveal-left", from: { x: -32 } },
  { sel: ".reveal-right", from: { x: 32 } },
  { sel: ".reveal-scale", from: { scale: 0.96 } },
] as const;
const PHOTOS = ".reveal-photo";
const LINES = ".reveal-line";
const RISE = ".rise";
const ALL = [...SLIDES.map((s) => s.sel), PHOTOS, LINES, RISE].join(", ");

/** Inline styles GSAP leaves behind are cleared at the end, so hover and CSS states take over again. */
const CLEAR = "opacity,visibility,transform";

const find = (root: Element | Document, sel: string) => {
  const found = Array.from(root.querySelectorAll<HTMLElement>(sel));
  if (root instanceof HTMLElement && root.matches(sel)) found.unshift(root);
  return found.filter((el) => !el.classList.contains("is-in"));
};
const markIn = (els: Element[]) => els.forEach((el) => el.classList.add("is-in"));

/**
 * Site-wide motion, driven by GSAP and ScrollTrigger.
 * - On load, the small things around the hero heading (`.rise`) settle in one after another.
 *   The heading itself never waits on an animation.
 * - Sections, cards and photographs rise and fade in once as they enter the screen. Elements that
 *   enter together are batched and staggered 70ms apart.
 * Everything moves only opacity and transforms on the site's one decelerating curve, and nothing
 * runs for visitors who prefer reduced motion (globals.css shows the content straight away).
 * Triggers are rebuilt on every navigation and all of them are reverted when the page changes.
 */
export default function ScrollEffects() {
  const pathname = usePathname();

  useGSAP(
    () => {
      document.documentElement.classList.add("motion-ready");
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, (ctx) => {
        // Elements that are already part of a batch, so a later DOM change doesn't register them twice.
        const seen = new WeakSet<Element>();
        const fresh = (els: HTMLElement[]) => els.filter((el) => !seen.has(el) && (seen.add(el), true));

        const setup = (root: Element | Document) => {
          // Hero entrance: plays straight away, it doesn't wait for scrolling.
          const rise = fresh(find(root, RISE));
          if (rise.length) {
            markIn(rise);
            gsap.fromTo(rise, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.7, delay: 0.08, stagger: 0.09, clearProps: CLEAR });
          }

          // Anything the visitor has already scrolled past (an anchor link, a restored scroll position) just appears.
          const skip = (els: Element[]) => {
            const left = els.filter((el) => !el.classList.contains("is-in"));
            markIn(left);
            gsap.set(left, { clearProps: CLEAR });
          };
          const batch = (els: HTMLElement[], play: (els: HTMLElement[]) => void) => {
            if (!els.length) return;
            ScrollTrigger.batch(els, {
              start: "top 94%",
              once: true,
              onEnter: (group) => {
                const todo = (group as HTMLElement[]).filter((el) => !el.classList.contains("is-in"));
                markIn(todo);
                play(todo);
              },
              onLeave: skip,
            });
          };

          for (const { sel, from } of SLIDES) {
            batch(fresh(find(root, sel)), (els) =>
              gsap.fromTo(els, { autoAlpha: 0, ...from }, { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.7, stagger: 0.07, clearProps: CLEAR }),
            );
          }

          // Photographs develop in: a fade with a gentle zoom out.
          batch(fresh(find(root, PHOTOS)), (els) => {
            const shots = els.flatMap((el) => Array.from(el.querySelectorAll(":scope > .frame, :scope > img")));
            gsap.fromTo(shots, { opacity: 0 }, { opacity: 1, duration: 0.8, stagger: 0.07, clearProps: "opacity" });
            gsap.fromTo(shots, { scale: 1.06 }, { scale: 1, duration: 1.2, stagger: 0.07, clearProps: "transform" });
          });

          batch(fresh(find(root, LINES)), (els) =>
            gsap.fromTo(els, { scaleX: 0 }, { scaleX: 1, transformOrigin: "left center", duration: 0.7, stagger: 0.07, clearProps: "transform" }),
          );
        };

        setup(document);

        // New elements (streamed sections, gallery filters) are picked up as they mount.
        let queued: Element[] = [];
        let frame = 0;
        const mo = new MutationObserver((records) => {
          for (const r of records) r.addedNodes.forEach((n) => n instanceof Element && (n.matches(ALL) || n.querySelector(ALL)) && queued.push(n));
          if (queued.length && !frame) {
            frame = requestAnimationFrame(() => {
              const roots = queued;
              queued = [];
              frame = 0;
              // Run inside the matchMedia context, so these triggers are reverted with the rest.
              ctx.add(() => roots.forEach((root) => root.isConnected && setup(root)));
              ScrollTrigger.refresh();
            });
          }
        });
        mo.observe(document.body, { childList: true, subtree: true });

        // Photos and fonts change the page height once they load; re-measure the triggers then.
        document.fonts?.ready.then(() => ScrollTrigger.refresh());

        return () => {
          mo.disconnect();
          cancelAnimationFrame(frame);
        };
      });
      return () => mm.revert();
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  // Marks the page once the visitor starts moving around, so page transitions never hold back the first paint.
  useEffect(() => {
    const mark = () => document.documentElement.setAttribute("data-navigated", "");
    document.addEventListener("click", mark, { capture: true, once: true });
    window.addEventListener("popstate", mark, { once: true });
    return () => {
      document.removeEventListener("click", mark, { capture: true });
      window.removeEventListener("popstate", mark);
    };
  }, []);

  return null;
}
