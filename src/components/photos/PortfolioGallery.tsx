"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import PhotoFrame from "./PhotoFrame";
import type { Photo, ServiceSlug } from "@/lib/data";
import { cn } from "@/lib/cn";

type Filter = { slug: ServiceSlug | "all"; label: string; count: number };

const ratio: Record<Photo["aspect"], number> = { tall: 3 / 2, portrait: 5 / 4, landscape: 2 / 3, square: 1 };

/** Places each photo in the currently shortest column, keeping its position in the list for the lightbox. */
function toColumns(list: Photo[], count: number) {
  const columns = Array.from({ length: count }, () => ({ height: 0, items: [] as { photo: Photo; index: number }[] }));
  list.forEach((photo, index) => {
    const shortest = columns.reduce((a, b) => (b.height < a.height - 0.01 ? b : a));
    shortest.items.push({ photo, index });
    shortest.height += ratio[photo.aspect] + 0.15;
  });
  return columns.map((c) => c.items);
}

const queries = ["(min-width: 1024px)", "(min-width: 640px)"];
function subscribeColumns(cb: () => void) {
  const lists = queries.map((q) => window.matchMedia(q));
  lists.forEach((l) => l.addEventListener("change", cb));
  return () => lists.forEach((l) => l.removeEventListener("change", cb));
}
const getColumns = () => (window.matchMedia(queries[0]).matches ? 3 : window.matchMedia(queries[1]).matches ? 2 : 1);

export default function PortfolioGallery({ photos, filters = [] }: { photos: Photo[]; filters?: Filter[] }) {
  const [filter, setFilter] = useState<Filter["slug"]>("all");
  const columns = useSyncExternalStore(subscribeColumns, getColumns, () => 3);
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
      {filters.length > 1 && (
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
      )}

      {filters.length > 1 && (
        <p className="sr-only" aria-live="polite">
          Showing {list.length} photographs
        </p>
      )}

      {/* Keyed on the filter so the grid re-mounts and its photos stagger in on every change.
          Photos are dealt into columns left to right, so the first ones sit across the top row. */}
      <div
        key={`${filter}-${columns}`}
        className={cn("grid items-start gap-4 lg:gap-6", filters.length > 1 && "mt-10 md:mt-14")}
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {toColumns(list, columns).map((column, c) => (
          <ul key={c} className="flex flex-col gap-4 lg:gap-6">
            {column.map(({ photo, index }) => (
              <li key={photo.id} className="stagger-in" style={{ "--i": index } as CSSProperties}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(index)}
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
        ))}
      </div>

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
                  current.aspect === "tall" && "max-w-[min(100%,calc((100dvh-10rem)*0.667))]",
                  current.aspect === "portrait" && "max-w-[min(100%,calc((100dvh-10rem)*0.8))]",
                  current.aspect === "landscape" && "max-w-[min(100%,calc((100dvh-10rem)*1.5))]",
                  current.aspect === "square" && "max-w-[min(100%,calc(100dvh-10rem))]",
                )}
              >
                <PhotoFrame photo={current} sizes="100vw" caption={false} contain />
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
