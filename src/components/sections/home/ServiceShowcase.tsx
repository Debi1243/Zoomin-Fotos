import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import ShowcaseScroll from "@/components/sections/home/ShowcaseScroll";
import { formatRupees, homeServices, pickPhotos, startingPrice } from "@/lib/data";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Each service's title as two short display lines, set large like a film title card. */
const display: Record<string, [string, string]> = {
  "/services/weddings": ["Weddings", "& Rituals"],
  "/services/candid-photography": ["Candid", "& Unposed"],
  "/services/wedding-cinematography": ["Films", "& Highlights"],
  "/services/pre-wedding": ["Pre-Wedding", "& Couples"],
  "/services/maternity-newborn": ["Maternity", "& Newborn"],
  "/services/events": ["Concerts", "& Events"],
  "/services/commercial": ["Brands", "& Products"],
  "/services/portraits": ["Portraits", "& Family"],
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The services, one full-screen photograph at a time. The section holds still while the page
 * scrolls and each step dissolves into the next service: its photograph, a big two-line title,
 * the starting price and a way in. A rail of small cards in the lower right shows every service
 * and jumps to it; a line along the bottom shows how far through the visitor is.
 * Without motion (or on short screens) the same panels simply stack, one under another.
 */
export default function ServiceShowcase() {
  const items = homeServices
    .map((s) => ({ ...s, photo: pickPhotos([s.photoId], 1)[0], from: s.slug ? startingPrice(s.slug) : null }))
    .filter((s) => s.photo?.src && s.photo.id === s.photoId);

  return (
    <ShowcaseScroll count={items.length}>
      <h2 id="services-title" className="sr-only">
        Photography services
      </h2>
      <div className="showcase-stage px-2 sm:px-3">
        <div className="surface-dark showcase-card relative isolate overflow-hidden rounded-3xl">
          {items.map((s, i) => {
            const [a, b] = display[s.href] ?? [s.title, ""];
            return (
              <article
                key={s.href}
                data-sc-slide
                aria-label={s.title}
                className="showcase-slide relative isolate flex flex-col justify-end overflow-hidden"
                style={{ zIndex: i } as CSSProperties}
              >
                <div className="showcase-media absolute inset-0 -z-20 will-change-transform">
                  <Image
                    src={`${basePath}${s.photo.src}`}
                    alt={`${s.photo.title}, ${s.title.toLowerCase()}`}
                    fill
                    loading="lazy"
                    sizes="100vw"
                    className="showcase-photo object-cover"
                  />
                </div>
                <div aria-hidden className="showcase-scrim absolute inset-0 -z-10" />
                <div data-sc-copy className="container-page pb-28 pt-24 md:pb-20 lg:pb-16">
                  <p className="label-rule caption-4 uppercase tracking-[0.18em] text-[#9dbcff]">
                    <span className="tabular">{pad(i + 1)}</span>
                    <span className="text-white/85">
                      {s.from ? <>From <span className="tabular">{formatRupees(s.from)}</span> + GST</> : s.priceNote ?? "Ask for a quote"}
                    </span>
                  </p>
                  <h3 className="showcase-title mt-3 font-display uppercase text-white">
                    <span className="block">{a}</span>
                    {b && <span className="block">{b}</span>}
                  </h3>
                  <p className="mt-4 max-w-[42ch] body-6 text-white/90 sm:body-3">{s.text}</p>
                  <Link
                    href={s.href}
                    className="group mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/35 bg-white/10 px-5 button-sm text-white backdrop-blur-md transition-[background-color,border-color] duration-300 hover:border-white/70 hover:bg-white/20"
                  >
                    {s.from || s.priceNote ? "View packages" : "See photos and details"}
                    <ArrowRightIcon aria-hidden className="size-4 transition-transform duration-500 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </article>
            );
          })}

          {/* Every service as a small card; the one on screen lifts and lights up. */}
          <nav aria-label="Jump to a service" className="showcase-rail absolute bottom-12 right-10 z-50 hidden gap-2.5 xl:flex">
            {items.map((s, i) => (
              <button
                key={s.href}
                type="button"
                data-sc-go={i}
                aria-label={`Show ${s.title}`}
                className="showcase-thumb relative h-28 w-[4.75rem] cursor-pointer overflow-hidden rounded-xl border border-white/20 text-left shadow-lg"
              >
                <Image src={`${basePath}${s.photo.src}`} alt="" fill sizes="96px" loading="lazy" className="object-cover" />
                <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <span className="absolute inset-x-2 bottom-2 font-display text-[0.6875rem] uppercase leading-tight text-white">
                  {(display[s.href] ?? [s.title])[0]}
                </span>
              </button>
            ))}
          </nav>

          {/* How far through the services the visitor is. */}
          <div aria-hidden className="showcase-meta pointer-events-none absolute inset-x-6 bottom-5 z-50 flex items-center gap-4 xl:inset-x-10">
            <span className="tabular caption-4 text-white/85">
              <span data-sc-count>01</span> / {pad(items.length)}
            </span>
            <span className="relative block h-px flex-1 overflow-hidden bg-white/20">
              <span data-sc-fill className="showcase-fill absolute inset-0 origin-left bg-gradient-to-r from-[#0047ab] to-[#9dbcff]" />
            </span>
          </div>
        </div>
      </div>
    </ShowcaseScroll>
  );
}
