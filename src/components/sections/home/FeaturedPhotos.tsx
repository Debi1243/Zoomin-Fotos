"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import PhotoFrame from "@/components/photos/PhotoFrame";
import { featuredPhotos, getService } from "@/lib/data";
import { cn } from "@/lib/cn";

const ADVANCE_MS = 3800;

/**
 * The photographs picked as featured on the admin page, in a scroller that glides one
 * photo along every few seconds. It holds still while someone hovers, touches or tabs
 * into it, when it is off screen, and for people who prefer reduced motion.
 */
export default function FeaturedPhotos() {
  const track = useRef<HTMLUListElement>(null);
  const [playing, setPlaying] = useState(true);
  const [held, setHeld] = useState(false);
  const [visible, setVisible] = useState(false);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setStill(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const step = (dir: 1 | -1) => track.current && scrollStep(track.current, dir);

  const running = playing && !held && visible && !still;
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => track.current && scrollStep(track.current, 1), ADVANCE_MS);
    return () => clearInterval(timer);
  }, [running]);

  if (featuredPhotos.length === 0) return null;

  const control = "grid size-11 place-items-center rounded-full border border-border-strong transition-colors hover:border-fg hover:bg-fg hover:text-bg";

  return (
    <section aria-labelledby="featured-title" className="py-16 md:py-24">
      <div className="container-page flex items-end justify-between gap-6">
        <div>
          <p className="label text-muted">
            <span aria-hidden className="label-dot festive-gradient" />
            Featured
          </p>
          <h2 id="featured-title" className="mt-4 font-display text-h2">
            Favourites from the studio.
          </h2>
        </div>
        <div className="flex shrink-0 gap-2">
          {!still && (
            <button type="button" onClick={() => setPlaying((p) => !p)} className={cn(control, "hidden sm:grid")} aria-label={playing ? "Pause the scroller" : "Play the scroller"}>
              {playing ? <Pause aria-hidden className="size-4" /> : <Play aria-hidden className="size-4" />}
            </button>
          )}
          <button type="button" onClick={() => step(-1)} className={control} aria-label="Previous featured photograph">
            <ArrowLeft aria-hidden className="size-4" />
          </button>
          <button type="button" onClick={() => step(1)} className={control} aria-label="Next featured photograph">
            <ArrowRight aria-hidden className="size-4" />
          </button>
        </div>
      </div>

      <ul
        ref={track}
        aria-label="Featured photographs"
        onPointerEnter={(e) => e.pointerType === "mouse" && setHeld(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setHeld(false)}
        onTouchStart={() => setHeld(true)}
        onTouchEnd={() => setTimeout(() => setHeld(false), ADVANCE_MS)}
        onFocus={() => setHeld(true)}
        onBlur={() => setHeld(false)}
        className="relative mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 [scrollbar-width:none] sm:scroll-px-6 sm:px-6 md:mt-14 md:gap-6 lg:scroll-px-10 lg:px-10 xl:scroll-px-[max(2.5rem,calc((100vw-84rem)/2+2.5rem))] xl:px-[max(2.5rem,calc((100vw-84rem)/2+2.5rem))] [&::-webkit-scrollbar]:hidden"
      >
        {featuredPhotos.map((p) => (
          <li key={p.id} className="shrink-0 snap-start">
            <Link href={`/services/${p.category}`} className="group block">
              <PhotoFrame
                photo={p}
                sizes="(min-width: 1024px) 40vw, 85vw"
                caption={false}
                className="h-[min(62vh,30rem)] max-w-[85vw] md:h-[min(68vh,36rem)]"
              />
              <span className="mt-3 flex w-0 min-w-full items-baseline justify-between gap-4 text-sm">
                <span className="truncate">{p.title}</span>
                <span className="shrink-0 text-muted">{getService(p.category)?.title}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Scrolls the track so the next (or previous) photo lines up at the start, wrapping round at the end. */
function scrollStep(el: HTMLElement, dir: 1 | -1) {
  const items = Array.from(el.children) as HTMLElement[];
  const pad = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0;
  const at = el.scrollLeft + pad;
  if (dir === 1 && el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) return el.scrollTo({ left: 0, behavior: "smooth" });
  const next = dir === 1 ? items.find((li) => li.offsetLeft > at + 4) : [...items].reverse().find((li) => li.offsetLeft < at - 4);
  el.scrollTo({ left: next ? next.offsetLeft - pad : 0, behavior: "smooth" });
}
