"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { gsap, HERO_PIN, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * The scroll-driven part of the home hero. The section is several screens tall and its stage is
 * sticky (globals.css), so the photograph holds still while the page scrolls. This scrubs one
 * timeline against that scroll: each later photograph wipes up from the bottom edge as it zooms
 * gently out, the one beneath drifts up and away, the caption rolls to the new title and the
 * progress line fills. The ticks under the caption
 * jump straight to a photograph. Only clip-path and transforms move.
 */
export default function HeroScroll({ count, children }: { count: number; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = ref.current;
      if (!section || count < 2) return;
      const mm = gsap.matchMedia();
      mm.add(HERO_PIN, () => {
        const q = gsap.utils.selector(section);
        const slides = q<HTMLElement>("[data-hero-slide]");
        const inners = q<HTMLElement>(".hero-slide-inner");
        const caps = q<HTMLElement>("[data-hero-cap]");
        const fills = q<HTMLElement>("[data-hero-fill]");
        const fillsAt = (i: number) => fills.filter((_, n) => n % count === i);
        const n = slides.length;

        gsap.set(slides.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(inners, { x: 0, y: 0, scale: 1.2, transformOrigin: "50% 50%" });
        gsap.set(inners[0], { scale: 1.04 });
        gsap.set(caps, { x: 0, y: 0, yPercent: 0 });
        gsap.set(caps.slice(1), { yPercent: 110 });
        gsap.set(fills, { scaleX: 0 });
        gsap.set(fillsAt(0), { scaleX: 1 });
        // From here the timeline owns the captions (globals.css hid the later ones until now).
        section.classList.add("is-live");

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        });

        tl.addLabel("s0").to(q(".hero-cue"), { autoAlpha: 0, duration: 0.3 }, 0).to({}, { duration: 0.2 });
        for (let i = 1; i < n; i++) {
          const at = tl.duration();
          tl.fromTo(slides[i], { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power2.inOut" }, at)
            .fromTo(inners[i], { scale: 1.2, yPercent: 6 }, { scale: 1.04, yPercent: 0, duration: 1.1, ease: "power2.out" }, at)
            .to(inners[i - 1], { scale: 1, yPercent: -8, duration: 1, ease: "power2.in" }, at)
            .fromTo(fillsAt(i), { scaleX: 0 }, { scaleX: 1, duration: 1 }, at);
          if (caps[i]) {
            tl.to(caps[i - 1], { yPercent: -110, duration: 0.4, ease: "power2.in" }, at + 0.15).fromTo(
              caps[i],
              { yPercent: 110 },
              { yPercent: 0, duration: 0.5, ease: "power3.out" },
              at + 0.55,
            );
          }
          tl.addLabel(`s${i}`, at + 1.1).to({}, { duration: 0.35 });
        }
        tl.addLabel("end");

        // The ticks jump to their photograph (smooth scrolling comes from the page's own CSS).
        const go = (e: Event) => {
          const i = Number((e.currentTarget as HTMLElement).dataset.heroGo);
          const st = tl.scrollTrigger;
          if (st) window.scrollTo({ top: st.labelToScroll(`s${i}`) });
        };
        const ticks = q<HTMLElement>("[data-hero-go]");
        ticks.forEach((t) => t.addEventListener("click", go));
        // The photos below the first load lazily; measure again once they have.
        ScrollTrigger.refresh();
        return () => {
          ticks.forEach((t) => t.removeEventListener("click", go));
          section.classList.remove("is-live");
        };
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [count] },
  );

  return (
    <section ref={ref} aria-labelledby="hero-title" className="hero-scroll relative" style={{ "--slides": count } as CSSProperties}>
      {children}
    </section>
  );
}
