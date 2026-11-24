"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import {
  ArrowLeftIcon as ArrowLeft,
  ArrowRightIcon as ArrowRight,
  ArrowsOutSimpleIcon as Expand,
  PauseIcon as Pause,
  PlayIcon as Play,
  XIcon as X,
} from "@phosphor-icons/react/dist/ssr";
import type { Photo, ServiceSlug } from "@/lib/data";
import { cn } from "@/lib/cn";

type Filter = { slug: ServiceSlug | "all"; label: string; count: number };

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
/** Cards rendered on each side of the centre one; the rest stay unmounted, so 80 photos cost the same as 13. */
const WINDOW = 6;
const AUTOPLAY_MS = 3600;

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(cb: () => void) {
  const list = window.matchMedia(motionQuery);
  list.addEventListener("change", cb);
  return () => list.removeEventListener("change", cb);
}
const getReducedMotion = () => window.matchMedia(motionQuery).matches;

/** Distance from the centre, wrapped round the ring when there are enough photos to loop. */
function offsetOf(i: number, pos: number, n: number, loop: boolean) {
  let o = i - pos;
  if (loop) o = ((((o + n / 2) % n) + n) % n) - n / 2;
  return o;
}

/**
 * Where a card sits for a given distance from the centre, in card widths and degrees. The centre
 * card faces the viewer; the rest turn inwards and stack back into the dark like a record shelf.
 */
function place(o: number): CSSProperties {
  const c = Math.max(-1, Math.min(1, o));
  const a = Math.abs(o);
  const x = c * 0.66 + (o - c) * 0.3;
  const z = -Math.abs(c) * 0.55 - (a - Math.abs(c)) * 0.22;
  return {
    "--x": x,
    "--z": z,
    "--ry": `${-c * 52}deg`,
    "--shade": Math.min(0.72, a * 0.2),
    opacity: a > WINDOW - 1.5 ? Math.max(0, WINDOW - 0.5 - a) : 1,
    zIndex: 100 - Math.round(a * 10),
  } as CSSProperties;
}

export default function Coverflow({ photos, filters }: { photos: Photo[]; filters: Filter[] }) {
  const [filter, setFilter] = useState<Filter["slug"]>("all");
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  // The slideshow plays when someone opens the link, unless they prefer less motion or take over.
  const reducedMotion = useSyncExternalStore(subscribeMotion, getReducedMotion, () => true);
  const [choice, setPlaying] = useState<boolean | null>(null);
  const playing = choice ?? !reducedMotion;
  const [open, setOpen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pointer = useRef<{ id: number; x: number; y: number; moved: boolean; card: number } | null>(null);
  const wheel = useRef({ sum: 0, t: 0 });

  const list = filter === "all" ? photos : photos.filter((p) => p.category === filter);
  const n = list.length;
  const loop = n > WINDOW * 2 + 1;
  const current = list[index] ?? list[0];

  const go = useCallback(
    (next: number) => {
      if (!n) return;
      setIndex(loop ? ((next % n) + n) % n : Math.max(0, Math.min(n - 1, next)));
    },
    [n, loop],
  );
  const step = useCallback((d: number) => go(index + d), [go, index]);
  const stopPlay = () => setPlaying(false);

  useEffect(() => {
    if (!playing || open || dragging) return;
    const t = window.setTimeout(() => go(index + 1), AUTOPLAY_MS);
    return () => window.clearTimeout(t);
  }, [playing, open, dragging, index, go]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Warm the next few photographs so turning the shelf never shows an empty card.
  useEffect(() => {
    for (let d = 1; d <= 2; d++) {
      const p = list[(index + d) % n];
      if (p?.src) new window.Image().src = `${basePath}${p.src}`;
    }
  }, [index, list, n]);

  const cardWidth = () => stageRef.current?.querySelector<HTMLElement>("[data-card]")?.offsetWidth ?? 300;

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const card = (e.target as HTMLElement).closest<HTMLElement>("[data-i]");
    pointer.current = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: false, card: card ? Number(card.dataset.i) : -1 };
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const p = pointer.current;
    if (!p || p.id !== e.pointerId) return;
    const dx = e.clientX - p.x;
    if (!p.moved) {
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(e.clientY - p.y)) return;
      p.moved = true;
      stageRef.current?.setPointerCapture(e.pointerId);
      setDragging(true);
      stopPlay();
    }
    setDrag(dx / (cardWidth() * 0.42));
  };
  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const p = pointer.current;
    if (!p || p.id !== e.pointerId) return;
    pointer.current = null;
    if (p.moved) {
      go(index - Math.round(drag));
      setDrag(0);
      setDragging(false);
      return;
    }
    // A tap: the centre photo opens full screen, a side photo turns to the centre.
    if (p.card < 0) return;
    stopPlay();
    if (p.card === index) setOpen(true);
    else go(p.card);
  };
  const onPointerCancel = () => {
    pointer.current = null;
    setDrag(0);
    setDragging(false);
  };

  // Trackpads and horizontal wheels turn the shelf; vertical scrolling is left to the page.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      const w = wheel.current;
      const now = performance.now();
      if (now - w.t > 250) w.sum = 0;
      w.t = now;
      w.sum += e.deltaX;
      if (Math.abs(w.sum) > 60) {
        setPlaying(false);
        setIndex((i) => {
          const next = i + Math.sign(w.sum);
          return loop ? ((next % n) + n) % n : Math.max(0, Math.min(n - 1, next));
        });
        w.sum = 0;
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [n, loop]);

  const onKeyDown = (e: ReactKeyboardEvent) => {
    const keys: Record<string, () => void> = {
      ArrowLeft: () => step(-1),
      ArrowRight: () => step(1),
      Home: () => go(0),
      End: () => go(n - 1),
      Enter: () => setOpen(true),
      " ": () => setPlaying(!playing),
    };
    const run = keys[e.key];
    if (!run) return;
    e.preventDefault();
    if (e.key !== " ") stopPlay();
    run();
  };

  const pos = index - drag;
  const cards = list
    .map((photo, i) => ({ photo, i, o: offsetOf(i, pos, n, loop) }))
    .filter((c) => Math.abs(c.o) <= WINDOW);

  return (
    <div className="coverflow">
      <div role="group" aria-label="Filter by category" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
        {filters.map((f) => (
          <button
            key={f.slug}
            type="button"
            aria-pressed={filter === f.slug}
            onClick={() => {
              setFilter(f.slug);
              setIndex(0);
            }}
            className={cn(
              "chip inline-flex h-11 shrink-0 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors",
              filter === f.slug ? "border-primary bg-primary text-primary-fg" : "border-border bg-surface hover:border-fg",
            )}
          >
            {f.label}
            <span className={cn("tabular text-xs", filter === f.slug ? "text-primary-fg" : "text-muted")}>{f.count}</span>
          </button>
        ))}
      </div>

      <div
        ref={stageRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Photographs, in 3D. Use the left and right arrow keys to turn, Enter to view full screen."
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        className={cn("coverflow-stage relative mt-4 select-none outline-none md:mt-6", dragging && "is-dragging")}
      >
        <div className="coverflow-floor" aria-hidden />
        <ul className="coverflow-track">
          {cards.map(({ photo, i, o }) => (
            <li
              key={photo.id}
              data-i={i}
              data-card={i === index || undefined}
              aria-hidden={i !== index}
              className="coverflow-card"
              style={place(o)}
            >
              <div className="coverflow-face">
                {photo.src && (
                  <Image
                    src={`${basePath}${photo.src}`}
                    alt={i === index ? `${photo.title}, ${photo.place}` : ""}
                    fill
                    draggable={false}
                    sizes="(min-width: 1024px) 26rem, 70vw"
                    priority={Math.abs(o) < 1.5}
                    className="object-cover"
                  />
                )}
                <span className="coverflow-shade" aria-hidden />
                {i === index && (
                  <span className="coverflow-expand" aria-hidden>
                    <Expand className="size-4" />
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {current && (
        <div className="mx-auto mt-4 flex max-w-xl flex-col items-center text-center md:mt-6">
          <p className="label tabular text-muted" aria-live="polite">
            <span className="sr-only">Photo </span>
            {index + 1} / {n}
          </p>
          <p className="mt-2 font-display text-2xl text-fg md:text-3xl">{current.title}</p>
          <p className="mt-1 text-sm text-muted">
            {filters.find((f) => f.slug === current.category)?.label} · {current.place}
          </p>

          <div className="mt-5 flex items-center gap-2">
            <button type="button" onClick={() => (stopPlay(), step(-1))} disabled={!loop && index === 0} aria-label="Previous photo" className="coverflow-btn">
              <ArrowLeft aria-hidden className="size-5" />
            </button>
            <button type="button" onClick={() => setPlaying(!playing)} aria-label={playing ? "Pause slideshow" : "Play slideshow"} className="coverflow-btn">
              {playing ? <Pause aria-hidden weight="fill" className="size-5" /> : <Play aria-hidden weight="fill" className="size-5" />}
            </button>
            <button type="button" onClick={() => (stopPlay(), setOpen(true))} aria-label="View full screen" className="coverflow-btn">
              <Expand aria-hidden className="size-5" />
            </button>
            <button type="button" onClick={() => (stopPlay(), step(1))} disabled={!loop && index === n - 1} aria-label="Next photo" className="coverflow-btn">
              <ArrowRight aria-hidden className="size-5" />
            </button>
          </div>

          <input
            type="range"
            min={0}
            max={Math.max(0, n - 1)}
            value={index}
            onChange={(e) => (stopPlay(), go(Number(e.target.value)))}
            aria-label="Jump to photo"
            aria-valuetext={`${index + 1} of ${n}: ${current.title}`}
            className="coverflow-range mt-6 w-full max-w-sm"
            style={{ "--fill": n > 1 ? `${(index / (n - 1)) * 100}%` : "100%" } as CSSProperties}
          />
        </div>
      )}

      <dialog
        ref={dialogRef}
        aria-label={current ? `${current.title}, ${current.place}` : "Photo"}
        onClose={() => setOpen(false)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") step(-1);
          if (e.key === "ArrowRight") step(1);
        }}
        onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        className="lightbox m-0 h-dvh max-h-none w-screen max-w-none bg-[#05060a] p-0 text-[#eef1f7] backdrop:bg-[#05060a]"
      >
        {open && current && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
              <p className="label tabular text-[#eef1f7]/70">
                {index + 1} / {n}
              </p>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="grid size-11 place-items-center rounded-lg border border-white/20 transition-colors hover:bg-white/10">
                <X aria-hidden className="size-5" />
              </button>
            </div>
            <LightboxPhoto key={current.id} photo={current} onSwipe={step} />
            <div className="flex items-center justify-between gap-4 px-4 py-5 sm:px-6">
              <p className="min-w-0">
                <span className="font-display text-xl">{current.title}</span>
                <span className="ml-3 text-sm text-[#eef1f7]/70">{current.place}</span>
              </p>
              <div className="flex shrink-0 gap-2">
                <button type="button" onClick={() => step(-1)} aria-label="Previous photo" className="grid size-11 place-items-center rounded-lg border border-white/20 transition-colors hover:bg-white/10">
                  <ArrowLeft aria-hidden className="size-5" />
                </button>
                <button type="button" onClick={() => step(1)} aria-label="Next photo" className="grid size-11 place-items-center rounded-lg border border-white/20 transition-colors hover:bg-white/10">
                  <ArrowRight aria-hidden className="size-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}

/** The whole photograph, uncropped. Swipe sideways on a phone for the next one. */
function LightboxPhoto({ photo, onSwipe }: { photo: Photo; onSwipe: (d: number) => void }) {
  const start = useRef<{ x: number; y: number } | null>(null);
  return (
    <div
      className="relative min-h-0 flex-1 touch-pan-y"
      onPointerDown={(e) => (start.current = { x: e.clientX, y: e.clientY })}
      onPointerUp={(e) => {
        const s = start.current;
        start.current = null;
        if (!s) return;
        const dx = e.clientX - s.x;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - s.y)) onSwipe(dx < 0 ? 1 : -1);
      }}
    >
      {photo.src && (
        <Image src={`${basePath}${photo.src}`} alt={`${photo.title}, ${photo.place}`} fill sizes="100vw" draggable={false} className="lightbox-photo object-contain px-2 sm:px-6" />
      )}
    </div>
  );
}
