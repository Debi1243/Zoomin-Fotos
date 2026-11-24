import Image from "next/image";
import type { CSSProperties } from "react";
import Link from "next/link";
import { CalendarCheckIcon, MapPinIcon, WhatsappLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { ButtonLink } from "@/components/ui/Button";
import HeroScroll from "@/components/sections/home/HeroScroll";
import { brand, formatRupees, pickPhotos, startingPrice, waLink, type ServiceSlug } from "@/lib/data";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * The photographs the hero moves through as the visitor scrolls, one kind of shoot each.
 * `sm` frames the face on phones (where the photo sits above the text); `md` on wider screens,
 * where the text sits in the lower left, so every face stays clear of it.
 */
const SLIDES: { id: string; sm: string; md: string }[] = [
  { id: "40", sm: "44% 22%", md: "50% 12%" },
  { id: "36", sm: "64% 30%", md: "50% 22%" },
  { id: "65", sm: "18% 30%", md: "50% 26%" },
  { id: "49", sm: "44% 30%", md: "50% 30%" },
  { id: "91", sm: "56% 50%", md: "50% 50%" },
];

const kind: Partial<Record<ServiceSlug, string>> = {
  weddings: "Weddings",
  "pre-wedding": "Pre-wedding",
  portraits: "Portraits",
  "maternity-newborn": "Kids & newborn",
  events: "Events",
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The home page opens on a full-screen photograph that holds still while the visitor scrolls,
 * and each scroll step wipes the next photograph up over it: a wedding, a pre-wedding shoot,
 * a portrait, a child, a concert. The headline, prices and actions stay put the whole time.
 * Phones: the photo fills the top of the screen and the text sits below it, never over a face.
 * Wider screens: the photo fills the frame and a shade shaped to the text keeps it readable.
 * Without motion (or on very short screens) it is a single still photograph, as before.
 * The heading never waits on an animation, so it is the page's first paint.
 */
export default function Hero() {
  const photos = pickPhotos(SLIDES.map((s) => s.id));
  const slides = SLIDES.map((s) => ({ ...s, photo: photos.find((p) => p.id === s.id) })).filter((s) => s.photo?.src);
  const wedding = startingPrice("weddings");
  const preWedding = startingPrice("pre-wedding");

  return (
    <HeroScroll count={slides.length}>
      <div className="hero-stage px-2 pb-2 pt-2 sm:px-3 sm:pb-3 sm:pt-3">
        <div className="hero-card surface-dark relative isolate flex h-full flex-col overflow-hidden rounded-3xl md:justify-end">
          {/* The photographs, stacked. Each later one waits below a clip and wipes up over the one before. */}
          <div className="hero-media relative overflow-hidden md:absolute md:inset-0 md:-z-20">
            {slides.map(({ photo, sm, md }, i) => (
              <div
                key={photo!.id}
                data-hero-slide
                className="hero-slide absolute inset-0 overflow-hidden"
                style={{ "--pos-sm": sm, "--pos-md": md, zIndex: i } as CSSProperties}
              >
                <div className="hero-slide-inner absolute inset-0 will-change-transform">
                  <Image
                    src={`${basePath}${photo!.src}`}
                    alt={`${photo!.title}, ${kind[photo!.category]?.toLowerCase() ?? "photography"} by ${brand.name}`}
                    fill
                    priority={i === 0}
                    loading={i === 0 ? undefined : "lazy"}
                    fetchPriority={i === 0 ? "high" : "low"}
                    sizes="100vw"
                    className="hero-photo object-cover"
                  />
                </div>
              </div>
            ))}
            {/* Phones: the photograph melts into the dark card above the text. */}
            <div aria-hidden className="absolute inset-x-0 bottom-0 z-10 h-1/4 bg-gradient-to-t from-bg to-transparent md:hidden" />
          </div>
          <div aria-hidden className="hero-scrim absolute inset-0 -z-10 hidden md:block" />

          {/* The visitor looks through the photographer's viewfinder: frame corners, a focus point that
              locks on, and a shutter blink when the page opens. Wider screens only; it never covers text. */}
          <div aria-hidden className="viewfinder pointer-events-none absolute inset-0 hidden md:block">
            <span className="vf-corner vf-tl" />
            <span className="vf-corner vf-tr" />
            <span className="vf-corner vf-bl" />
            <span className="vf-corner vf-br" />
            <span className="vf-focus" />
            <span className="vf-readout vf-rec">
              <span className="vf-dot" />
              REC
            </span>
            <span className="vf-readout vf-exp tabular">1/250 · f/1.8 · ISO 400</span>
            <span className="vf-shutter" />
          </div>

          <div className="container-page relative pb-5 pt-1 md:pb-12 md:pt-24 lg:pb-14">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
              <div className="min-w-0">
                <p className="rise inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/40 px-3 py-1 label text-white backdrop-blur-sm">
                  <MapPinIcon aria-hidden className="size-4" />
                  {brand.city}, {brand.region}
                </p>
                <h1 id="hero-title" className="mt-3 max-w-[18ch] heading-3 hero-title sm:heading-2 md:mt-4 lg:heading-1 xl:text-[4.5rem]">
                  Not Just Photographs.
                  {/* Its own balanced block, so "Forever." never sits alone on the last line. */}
                  <em className="block text-balance">The Moments You&apos;ll Relive Forever.</em>
                </h1>
                <p className="rise mt-3 max-w-[56ch] body-6 hero-lede sm:body-3 md:mt-5 md:body-7" style={{ "--i": 1 } as CSSProperties}>
                  {brand.promise}
                </p>
                <div className="rise mt-5 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-5 md:mt-7" style={{ "--i": 2 } as CSSProperties}>
                  <ButtonLink href="/portfolio#wedding-story" size="lg" className="w-full sm:w-auto">
                    View Wedding Stories
                  </ButtonLink>
                  {/* A glass button: clearly a second way in, without competing with the solid primary. */}
                  <Link
                    href="/contact?service=Wedding#quote"
                    data-track="check_availability"
                    data-track-source="hero"
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-white/40 bg-white/10 px-4 py-3 button-md text-white backdrop-blur-md transition-[background-color,border-color,translate] duration-300 ease-[var(--ease-base)] hover:-translate-y-px hover:border-white/70 hover:bg-white/20 active:translate-y-0 sm:w-auto"
                  >
                    <CalendarCheckIcon aria-hidden className="size-5 text-[#9dbcff]" />
                    Check Availability
                  </Link>
                </div>
                <p className="rise mt-3 flex flex-wrap items-center gap-x-1.5 caption-2 text-white/80 md:mt-4" style={{ "--i": 2 } as CSSProperties}>
                  Prefer to chat?{" "}
                  <a
                    href={waLink("Hi Zoomin Fotos! I'd like to check availability for my wedding.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-track="whatsapp_click"
                    data-track-source="hero"
                    className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white sm:min-h-0"
                  >
                    <WhatsappLogoIcon aria-hidden weight="fill" className="size-4 text-[#4ee59a]" />
                    Message us on WhatsApp
                  </a>
                </p>
              </div>

              <div className="rise flex shrink-0 flex-col gap-4 lg:items-end" style={{ "--i": 3 } as CSSProperties}>
                {/* Which photograph is showing, and how far through them the visitor is. */}
                {slides.length > 1 && (
                  <div className="hero-meta hidden w-full flex-col gap-3 lg:flex lg:w-72">
                    <div className="relative h-6 overflow-hidden" aria-hidden>
                      {slides.map(({ photo }, i) => (
                        <p key={photo!.id} data-hero-cap className="hero-cap absolute inset-0 flex items-baseline gap-3 whitespace-nowrap text-white">
                          <span className="tabular caption-3 text-[#9dbcff]">{pad(i + 1)}</span>
                          <span className="caption-4 uppercase tracking-[0.08em] text-white/80">{kind[photo!.category]}</span>
                          <span className="truncate font-display text-base italic text-white">{photo!.title}</span>
                        </p>
                      ))}
                    </div>
                    <div className="flex gap-1.5">
                      {slides.map(({ photo }, i) => (
                        <button
                          key={photo!.id}
                          type="button"
                          data-hero-go={i}
                          aria-label={`Show photo ${i + 1} of ${slides.length}: ${photo!.title}`}
                          className="group/tick relative flex h-6 flex-1 cursor-pointer items-center"
                        >
                          <span className="relative block h-0.5 w-full overflow-hidden rounded-full bg-white/25 transition-[height] duration-300 group-hover/tick:h-1">
                            <span data-hero-fill className="hero-fill absolute inset-0 origin-left rounded-full bg-[#9dbcff]" />
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {(wedding || preWedding) && (
                  <dl className="flex flex-wrap items-end gap-x-6 gap-y-2 border-t border-white/25 pt-3 md:gap-x-8 md:pt-4 lg:w-72 lg:justify-between">
                    {wedding && (
                      <div>
                        <dt className="caption-4 uppercase tracking-[0.08em] text-white/85">Weddings from</dt>
                        <dd className="mt-0.5 tabular title-1 text-white md:mt-1 md:heading-5">{formatRupees(wedding)}</dd>
                      </div>
                    )}
                    {preWedding && (
                      <div>
                        <dt className="caption-4 uppercase tracking-[0.08em] text-white/85">Pre-wedding from</dt>
                        <dd className="mt-0.5 tabular title-1 text-white md:mt-1 md:heading-5">{formatRupees(preWedding)}</dd>
                      </div>
                    )}
                    <div className="caption-5 text-white/80 lg:w-full lg:text-right">Prices plus GST</div>
                  </dl>
                )}
              </div>
            </div>
          </div>

          {/* Phones: a slim progress line across the photo's lower edge. */}
          {slides.length > 1 && (
            <div aria-hidden className="hero-meta pointer-events-none absolute inset-x-4 top-[calc(4.75rem+env(safe-area-inset-top))] z-20 flex gap-1 lg:hidden">
              {slides.map(({ photo }) => (
                <span key={photo!.id} className="relative block h-0.5 flex-1 overflow-hidden rounded-full bg-white/30">
                  <span data-hero-fill className="hero-fill absolute inset-0 origin-left rounded-full bg-white" />
                </span>
              ))}
            </div>
          )}

          {/* A quiet cue that there is more to see by scrolling. */}
          <div aria-hidden className="hero-cue pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 text-white/80 md:flex">
            <span className="caption-4 uppercase tracking-[0.2em] [writing-mode:vertical-rl]">Scroll</span>
            <span className="hero-cue-line block h-10 w-px overflow-hidden bg-white/25" />
          </div>
        </div>
      </div>
    </HeroScroll>
  );
}
