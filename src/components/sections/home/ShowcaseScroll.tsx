"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import { gsap, HERO_PIN, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * The scroll-driven part of the services showcase. The section is several screens tall and its
 * stage is sticky (globals.css), so one timeline is scrubbed against the scroll: each service's
 * photograph dissolves in over the last one while settling from a slow zoom, its title rises in as
 * the old one lifts away, the rail card lights up and the bottom line fills. Only opacity and
 * transforms move. The rail cards jump straight to their service.
 */
export default function ShowcaseScroll({ count, children }: { count: number; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = ref.current;
      if (!section || count < 2) return;
      const mm = gsap.matchMedia();
      mm.add(HERO_PIN, () => {
        const q = gsap.utils.selector(section);
        const slides = q<HTMLElement>("[data-sc-slide]");
        const media = q<HTMLElement>(".showcase-media");
        const copy = q<HTMLElement>("[data-sc-copy]");
        const thumbs = q<HTMLElement>("[data-sc-go]");
        const counter = q<HTMLElement>("[data-sc-count]")[0];
        const fill = q<HTMLElement>("[data-sc-fill]");
        const n = slides.length;

        gsap.set(slides.slice(1), { autoAlpha: 0 });
        gsap.set(media, { scale: 1.14 });
        gsap.set(media[0], { scale: 1.04 });
        gsap.set(copy.slice(1), { yPercent: 18, autoAlpha: 0 });
        gsap.set(fill, { scaleX: 1 / n });
        const light = (i: number) => {
          thumbs.forEach((t, k) => t.classList.toggle("is-on", k === i));
          if (counter) counter.textContent = String(i + 1).padStart(2, "0");
        };
        light(0);
        section.classList.add("is-live");

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
            // The rail lights the service whose photograph is mostly on screen.
            onUpdate: () => {
              const t = tl.time();
              let on = 0;
              for (let i = 1; i < n; i++) if (t >= tl.labels[`s${i}`] - 0.6) on = i;
              light(on);
            },
          },
        });

        tl.addLabel("s0").to(media[0], { scale: 1, duration: 0.4 }, 0);
        for (let i = 1; i < n; i++) {
          const at = tl.duration();
          tl.to(copy[i - 1], { yPercent: -14, autoAlpha: 0, duration: 0.35, ease: "power2.in" }, at)
            .to(slides[i], { autoAlpha: 1, duration: 0.6, ease: "power1.inOut" }, at + 0.1)
            .fromTo(media[i], { scale: 1.14 }, { scale: 1, duration: 1, ease: "power2.out" }, at + 0.1)
            .to(media[i - 1], { scale: 1.08, duration: 0.7, ease: "power1.in" }, at)
            .fromTo(copy[i], { yPercent: 18, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.45, ease: "power3.out" }, at + 0.45)
            .to(fill, { scaleX: (i + 1) / n, duration: 0.7 }, at + 0.1);
          tl.addLabel(`s${i}`, at + 0.9).to({}, { duration: 0.6 });
        }

        const go = (e: Event) => {
          const i = Number((e.currentTarget as HTMLElement).dataset.scGo);
          const st = tl.scrollTrigger;
          if (st) window.scrollTo({ top: st.labelToScroll(`s${i}`) });
        };
        thumbs.forEach((t) => t.addEventListener("click", go));
        ScrollTrigger.refresh();
        return () => {
          thumbs.forEach((t) => t.removeEventListener("click", go));
          section.classList.remove("is-live");
        };
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [count] },
  );

  return (
    <section ref={ref} id="services" aria-labelledby="services-title" className="showcase relative my-16 md:my-24" style={{ "--slides": count } as CSSProperties}>
      {children}
    </section>
  );
}
