import Image from "next/image";
import type { CSSProperties } from "react";
import { MapPinIcon, WhatsappLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { ButtonLink } from "@/components/ui/Button";
import { brand, formatRupees, pickPhotos, startingPrice, waLink } from "@/lib/data";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * A full-width photograph, framed like a print, with the headline set over it in the serif.
 * Says what we do, where, from what price, and how to book. One primary action (see the packages);
 * WhatsApp sits beside it as a glass button. A scrim shaped to the text keeps it readable while the photo stays bright.
 * The heading never waits on an animation, so it is the page's first paint.
 */
export default function Hero() {
  const [photo] = pickPhotos(["40"]);
  const wedding = startingPrice("weddings");
  const preWedding = startingPrice("pre-wedding");

  return (
    <section aria-labelledby="hero-title" className="px-2 pb-16 pt-3 sm:px-4 md:pb-24 md:pt-4">
      <div className="surface-dark relative isolate mx-auto flex max-w-[96rem] flex-col justify-end overflow-hidden rounded-3xl md:min-h-[min(88svh,52rem)]">
        {/* Phones: the photo sits above the text and fades into the dark card. Wider screens: it fills the card behind the text. */}
        <div className="relative aspect-[4/3] overflow-hidden md:absolute md:inset-0 md:-z-20 md:aspect-auto">
          {/* The photo layer is a little taller than its frame, so it can drift down as the page scrolls (data-parallax). */}
          {photo?.src && (
            <div data-parallax="10" className="absolute inset-x-0 bottom-0 h-[115%] will-change-transform">
              <Image
                src={`${basePath}${photo.src}`}
                alt={`${photo.title}, a wedding photographed by ${brand.name}`}
                fill
                priority
                sizes="100vw"
                className="hero-photo object-cover object-[50%_12%]"
              />
            </div>
          )}
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg to-transparent md:hidden" />
        </div>
        <div aria-hidden className="hero-scrim absolute inset-0 -z-10 hidden md:block" />

        <div className="container-page pb-8 pt-2 md:pb-14 md:pt-24 lg:pb-16">
          <p className="rise inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/40 px-3 py-1 label text-white backdrop-blur-sm">
            <MapPinIcon aria-hidden className="size-4" />
            {brand.city}, {brand.region}
          </p>
          <h1 id="hero-title" className="mt-4 max-w-[18ch] heading-3 hero-title sm:heading-2 lg:heading-1 xl:text-[4.5rem]">
            Beautiful memories.
            <br />
            <em>Affordable photography.</em>
          </h1>
          <p className="rise mt-5 max-w-[56ch] body-3 hero-lede md:body-7" style={{ "--i": 1 } as CSSProperties}>
            Wedding, maternity, family and event photography in {brand.city}, with every package and price on the page before you message us.
          </p>
          <div className="rise mt-7 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between" style={{ "--i": 2 } as CSSProperties}>
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
              <ButtonLink href="/packages" size="lg" className="w-full sm:w-auto">
                See packages and prices
              </ButtonLink>
              {/* A glass button: clearly a second way in, without competing with the solid primary. */}
              <a
                href={waLink("Hi Zoomin Fotos! I'd like to know more about your photography packages.")}
                target="_blank"
                rel="noopener noreferrer"
                data-track="whatsapp_click"
                data-track-source="hero"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-white/40 bg-white/10 px-4 py-3 button-md text-white backdrop-blur-md transition-[background-color,border-color,translate] duration-300 ease-[var(--ease-base)] hover:-translate-y-px hover:border-white/70 hover:bg-white/20 active:translate-y-0 sm:w-auto"
              >
                <WhatsappLogoIcon aria-hidden weight="fill" className="size-5 text-[#4ee59a]" />
                Ask us on WhatsApp
              </a>
            </div>
            {(wedding || preWedding) && (
              <dl className="flex flex-wrap gap-x-8 gap-y-3 border-t border-white/30 pt-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                {wedding && (
                  <div>
                    <dt className="caption-4 uppercase tracking-[0.08em] text-white/85">Weddings from</dt>
                    <dd className="mt-1 tabular heading-5 text-white">{formatRupees(wedding)}</dd>
                  </div>
                )}
                {preWedding && (
                  <div>
                    <dt className="caption-4 uppercase tracking-[0.08em] text-white/85">Pre-wedding from</dt>
                    <dd className="mt-1 tabular heading-5 text-white">{formatRupees(preWedding)}</dd>
                  </div>
                )}
                <div className="self-end caption-5 text-white/80">Prices plus GST</div>
              </dl>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
