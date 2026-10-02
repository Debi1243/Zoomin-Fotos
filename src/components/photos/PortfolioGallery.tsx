"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import PhotoFrame from "./PhotoFrame";
import type { Photo, ServiceSlug } from "@/lib/data";
import { cn } from "@/lib/cn";

type Filter = { slug: ServiceSlug | "all"; label: string; count: number };

export default function PortfolioGallery({ photos, filters }: { photos: Photo[]; filters: Filter[] }) {
  const [filter, setFilter] = useState<Filter["slug"]>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const list = filter === "all" ? photos : photos.filter((p) => p.category === filter);
  const current = openIndex === null ? null : list[openIndex];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (current && !dialog.open) dialog.showModal();
    if (!current && dialog.open) dialog.close();
  }, [current]);

  const step = (delta: number) => setOpenIndex((i) => (i === null ? i : (i + delta + list.length) % list.length));

  return (
    <>
      <div role="group" aria-label="Filter by category" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
        {filters.map((f) => (
          <button
            key={f.slug}
            type="button"
            aria-pressed={filter === f.slug}
            onClick={() => setFilter(f.slug)}
            className={cn(
              "inline-flex h-10 shrink-0 items-center gap-2 rounded-md border px-4 text-sm transition-colors",
              filter === f.slug ? "border-fg bg-fg text-bg" : "border-border hover:border-fg",
            )}
          >
            {f.label}
            <span className={cn("tabular text-xs", filter === f.slug ? "text-bg/70" : "text-muted")}>{f.count}</span>
          </button>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {list.length} photographs
      </p>

      {/* Keyed on the filter so the grid re-mounts and its photos stagger in on every change. */}
      <ul key={filter} className="mt-10 columns-1 gap-4 sm:columns-2 md:mt-14 lg:columns-3 lg:gap-6">
        {list.map((photo, i) => (
          <li key={photo.id} className="stagger-in mb-4 break-inside-avoid lg:mb-6" style={{ "--i": i } as CSSProperties}>
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              className="group block w-full text-left"
              aria-label={`Open ${photo.title}, ${photo.place}`}
            >
              <PhotoFrame photo={photo} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" reveal />
              <span className="mt-3 flex items-baseline justify-between gap-4 text-sm">
                <span className="text-fg">{photo.title}</span>
                <span className="text-muted">{photo.place}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label={current ? `${current.title}, ${current.place}` : "Photograph"}
        onClose={() => setOpenIndex(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpenIndex(null);
        }}
        className="lightbox m-0 h-dvh max-h-none w-screen max-w-none bg-[#0c0b0a] p-0 text-[#f4f2ec] backdrop:bg-[#0c0b0a]"
      >
        {current && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
              <p className="label tabular text-[#f4f2ec]/70">
                {String((openIndex ?? 0) + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}
              </p>
              <button
                type="button"
                onClick={() => setOpenIndex(null)}
                aria-label="Close"
                className="grid size-11 place-items-center rounded-md border border-white/20 transition-colors hover:bg-white/10"
              >
                <X aria-hidden className="size-5" />
              </button>
            </div>
            <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20">
              <div
                key={current.id}
                className={cn(
                  "lightbox-photo relative max-h-full w-full",
                  current.aspect === "portrait" && "max-w-[min(100%,calc((100dvh-10rem)*0.8))]",
                  current.aspect === "landscape" && "max-w-[min(100%,calc((100dvh-10rem)*1.5))]",
                  current.aspect === "square" && "max-w-[min(100%,calc(100dvh-10rem))]",
                )}
              >
                <PhotoFrame photo={current} sizes="100vw" caption={false} />
              </div>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous photograph"
                className="absolute left-2 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-md border border-white/20 transition-colors hover:bg-white/10 sm:grid"
              >
                <ArrowLeft aria-hidden className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next photograph"
                className="absolute right-2 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-md border border-white/20 transition-colors hover:bg-white/10 sm:grid"
              >
                <ArrowRight aria-hidden className="size-5" />
              </button>
            </div>
            <div className="flex items-center justify-between gap-4 px-4 py-5 sm:px-6">
              <p>
                <span className="font-display text-2xl italic">{current.title}</span>
                <span className="ml-3 text-sm text-[#f4f2ec]/70">{current.place}</span>
              </p>
              <div className="flex gap-2 sm:hidden">
                <button type="button" onClick={() => step(-1)} aria-label="Previous photograph" className="grid size-11 place-items-center rounded-md border border-white/20">
                  <ArrowLeft aria-hidden className="size-5" />
                </button>
                <button type="button" onClick={() => step(1)} aria-label="Next photograph" className="grid size-11 place-items-center rounded-md border border-white/20">
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
