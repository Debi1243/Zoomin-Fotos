"use client";

import { useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import PhotoFrame from "@/components/photos/PhotoFrame";
import { cn } from "@/lib/cn";
import type { Photo } from "@/lib/data";

type Props = {
  photos: Photo[];
  /** Pixels per second at rest; negative runs right to left. */
  speed?: number;
  className?: string;
};

/**
 * An endless ribbon of photographs that drifts on its own and speeds up while the page
 * is being scrolled. Hovering holds it still. Decorative: every photo is also in the portfolio.
 */
export default function PhotoMarquee({ photos, speed = -40, className }: Props) {
  const reduce = useReducedMotion();
  const track = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const x = useMotionValue(0);

  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [-2000, 0, 2000], [5, 0, 5], { clamp: false });

  useAnimationFrame((_, delta) => {
    const el = track.current;
    if (reduce || paused || !el) return;
    const loop = el.scrollWidth / 2;
    if (!loop) return;
    let next = x.get() + speed * (1 + Math.abs(boost.get())) * (delta / 1000);
    if (next <= -loop) next += loop;
    if (next > 0) next -= loop;
    x.set(next);
  });

  const row = (copy: number) =>
    photos.map((p) => (
      <li
        key={`${copy}-${p.id}`}
        className={cn(
          "group relative shrink-0 overflow-hidden rounded-sm",
          "h-[clamp(13rem,26vw,21rem)]",
          p.aspect === "landscape" ? "aspect-[3/2]" : p.aspect === "square" ? "aspect-square" : p.aspect === "tall" ? "aspect-[2/3]" : "aspect-[4/5]",
        )}
      >
        <PhotoFrame photo={p} fill caption={false} sizes="(min-width: 1024px) 30vw, 60vw" />
        <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/70 to-transparent p-4 font-display text-lg italic text-[#f4f2ec] opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          {p.title}
        </span>
      </li>
    ));

  return (
    <div
      aria-hidden
      className={cn("overflow-hidden", reduce && "overflow-x-auto", className)}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <motion.div ref={track} style={{ x }} className="flex w-max">
        <ul className="flex gap-3 pr-3 sm:gap-4 sm:pr-4">{row(0)}</ul>
        <ul className="flex gap-3 pr-3 sm:gap-4 sm:pr-4">{row(1)}</ul>
      </motion.div>
    </div>
  );
}
