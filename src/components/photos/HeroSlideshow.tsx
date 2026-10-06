"use client";

import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useReducedMotion } from "motion/react";
import PhotoFrame from "./PhotoFrame";
import type { Photo } from "@/lib/data";
import { cn } from "@/lib/cn";

const INTERVAL = 5000;

/** Cross-fades through a few photographs, with a visible pause control. */
export default function HeroSlideshow({ photos }: { photos: Photo[] }) {
  const reduce = useReducedMotion();
  // `prev` keeps its slow zoom running while it fades out, so it never snaps back.
  const [{ index, prev }, setSlide] = useState({ index: 0, prev: -1 });
  const setIndex = (next: (i: number) => number) => setSlide((s) => ({ index: next(s.index), prev: s.index }));
  const [paused, setPaused] = useState(false);
  const playing = !paused && !reduce;

  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => setSlide((s) => ({ index: (s.index + 1) % photos.length, prev: s.index })), INTERVAL);
    return () => window.clearTimeout(id);
  }, [playing, index, photos.length]);

  const current = photos[index];

  return (
    <div className="relative">
      <div className="photo-frame wipe relative aspect-[4/5] overflow-hidden rounded-sm bg-inverse">
        {photos.map((p, i) => (
          <div
            key={p.id}
            aria-hidden={i !== index}
            className={cn(
              "absolute inset-0 transition-opacity duration-[1400ms] ease-in-out",
              i === index ? "opacity-100" : "opacity-0",
            )}
          >
            <PhotoFrame
              photo={p}
              fill
              priority={i === 0}
              sizes="(min-width: 1024px) 28vw, 60vw"
              className={cn("rounded-none", (i === index || i === prev) && playing && "ken-burns")}
            />
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "Play slideshow" : "Pause slideshow"}
          className={cn("grid size-8 shrink-0 place-items-center rounded-full border border-border text-muted hover:border-fg hover:text-fg", reduce && "hidden")}
        >
          {paused ? <Play aria-hidden className="size-3.5" /> : <Pause aria-hidden className="size-3.5" />}
        </button>
        <ol className="flex flex-1 gap-1.5" aria-label="Slides">
          {photos.map((p, i) => (
            <li key={p.id} className="flex-1">
              <button
                type="button"
                onClick={() => setIndex(() => i)}
                aria-label={`Show ${p.title}`}
                aria-current={i === index ? "true" : undefined}
                className="block w-full py-2"
              >
                <span className="relative block h-px overflow-hidden bg-border">
                  {i < index && <span className="absolute inset-0 bg-fg" />}
                  {i === index && (
                    <span
                      key={`${index}-${playing}`}
                      className={cn("absolute inset-0 origin-left bg-fg", playing && "progress-bar")}
                      style={playing ? { animationDuration: `${INTERVAL}ms` } : undefined}
                    />
                  )}
                </span>
              </button>
            </li>
          ))}
        </ol>
        <p aria-hidden className="label shrink-0 text-muted">
          {current.title}
        </p>
      </div>
    </div>
  );
}
