"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowLeftIcon as ArrowLeft, ArrowRightIcon as ArrowRight, XIcon as X } from "@phosphor-icons/react/dist/ssr";
import type { Photo, ServiceSlug } from "@/lib/data";
import { cn } from "@/lib/cn";

type Filter = { slug: ServiceSlug | "all"; label: string; count: number };

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const aspects: Record<Photo["aspect"], string> = { tall: "aspect-[2/3]", portrait: "aspect-[4/5]", landscape: "aspect-[3/2]", square: "aspect-square" };
const heights: Record<Photo["aspect"], number> = { tall: 3 / 2, portrait: 5 / 4, landscape: 2 / 3, square: 1 };

/** Places each photo in the currently shortest column, keeping its place in the list for the full-screen view. */
function toColumns(list: Photo[], count: number) {
  const columns = Array.from({ length: count }, () => ({ height: 0, items: [] as { photo: Photo; index: number }[] }));
  list.forEach((photo, index) => {
    const shortest = columns.reduce((a, b) => (b.height < a.height - 0.01 ? b : a));
    shortest.items.push({ photo, index });
    shortest.height += heights[photo.aspect] + 0.12;
  });
  return columns.map((c) => c.items);
}

const wide = "(min-width: 768px)";
function subscribeWide(cb: () => void) {
  const list = window.matchMedia(wide);
  list.addEventListener("change", cb);
  return () => list.removeEventListener("change", cb);
}
const getColumns = () => (window.matchMedia(wide).matches ? 2 : 1);

/**
 * Every photograph in one vertical scroll. As each photo passes through the screen it tilts up out
 * of the dark, lies flat in the middle and tips away again (CSS scroll-driven animation, see
 * globals.css "3D portfolio"). Tap a photo to see it whole, full screen.
 */
export default function DepthGallery({ photos, filters }: { photos: Photo[]; filters: Filter[] }) {
  const [filter, setFilter] = useState<Filter["slug"]>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const columns = useSyncExternalStore(subscribeWide, getColumns, () => 1);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const list = filter === "all" ? photos : photos.filter((p) => p.category === filter);
  const current = openIndex === null ? null : list[openIndex];
  const labelOf = (slug: ServiceSlug) => filters.find((f) => f.slug === slug)?.label ?? "";
  const step = (d: number) => setOpenIndex((i) => (i === null ? i : (i + d + list.length) % list.length));

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (current && !dialog.open) dialog.showModal();
    if (!current && dialog.open) dialog.close();
  }, [current]);

  return (
    <>
      <div role="group" aria-label="Filter by category" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
        {filters.map((f) => (
          <button
            key={f.slug}
            type="button"
            aria-pressed={filter === f.slug}
            onClick={() => setFilter(f.slug)}
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
      <p className="sr-only" aria-live="polite">
        {list.length} photographs
      </p>

      <div className="depth-list mx-auto mt-8 grid max-w-5xl gap-5 md:mt-12 md:grid-cols-2 md:gap-8">
        {toColumns(list, columns).map((col, c) => (
          <ul key={`${filter}-${c}`} className={cn("flex flex-col gap-5 md:gap-8", c === 1 && "md:pt-24")}>
            {col.map(({ photo, index }) => (
              <li key={photo.id}>
                <button type="button" onClick={() => setOpenIndex(index)} className="depth-card group text-left" aria-label={`View ${photo.title} full screen`}>
                  <span className="depth-glass block">
                  <span className={cn("depth-face block", aspects[photo.aspect])}>
                    {photo.src && (
                      <Image
                        src={`${basePath}${photo.src}`}
                        alt={`${photo.title}, ${photo.place}`}
                        fill
                        draggable={false}
                        sizes="(min-width: 1024px) 31rem, (min-width: 768px) 46vw, 92vw"
                        priority={index < 2}
                        className="object-cover transition-transform duration-[900ms] ease-[var(--ease-base)] group-hover:scale-[1.03]"
                      />
                    )}
                    <span className="depth-pill">{labelOf(photo.category)}</span>
                  </span>
                  <span className="flex items-baseline justify-between gap-4 px-2 pb-1 pt-3 text-sm">
                    <span className="text-fg">{photo.title}</span>
                    <span className="shrink-0 text-muted">{photo.place}</span>
                  </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        aria-label={current ? `${current.title}, ${current.place}` : "Photo"}
        onClose={() => setOpenIndex(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") step(-1);
          if (e.key === "ArrowRight") step(1);
        }}
        onClick={(e) => e.target === e.currentTarget && setOpenIndex(null)}
        className="lightbox m-0 h-dvh max-h-none w-screen max-w-none bg-[#041010] p-0 text-[#f1ebe0] backdrop:bg-[#041010]"
      >
        {current && openIndex !== null && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
              <p className="label tabular text-[#f1ebe0]/70">
                {openIndex + 1} / {list.length}
              </p>
              <button type="button" onClick={() => setOpenIndex(null)} aria-label="Close" className="grid size-11 place-items-center rounded-lg border border-white/20 transition-colors hover:bg-white/10">
                <X aria-hidden className="size-5" />
              </button>
            </div>
            <LightboxPhoto key={current.id} photo={current} onSwipe={step} />
            <div className="flex items-center justify-between gap-4 px-4 py-5 sm:px-6">
              <p className="min-w-0">
                <span className="font-display text-xl">{current.title}</span>
                <span className="ml-3 text-sm text-[#f1ebe0]/70">{current.place}</span>
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
    </>
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
