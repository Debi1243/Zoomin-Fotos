import Image from "next/image";
import type { CSSProperties } from "react";
import { MapPinIcon } from "@phosphor-icons/react/dist/ssr";
import { ButtonLink, WhatsAppLink } from "@/components/ui/Button";
import { brand, formatRupees, pickPhotos, startingPrice, waLink } from "@/lib/data";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * A full-width photograph, framed like a print, with the headline set over it in the serif.
 * Says what we do, where, from what price, and how to book. One primary action (see the packages);
 * WhatsApp sits beside it as a quiet link. A dark scrim keeps the white text readable over any photo.
 * The heading never waits on an animation, so it is the page's first paint.
 */
export default function Hero() {
  const [photo] = pickPhotos(["01"]);
  const wedding = startingPrice("weddings");
  const preWedding = startingPrice("pre-wedding");

  return (
    <section aria-labelledby="hero-title" className="px-2 pb-16 pt-3 sm:px-4 md:pb-24 md:pt-4">
      <div className="surface-dark relative isolate mx-auto flex max-w-[96rem] flex-col justify-end overflow-hidden rounded-3xl md:min-h-[min(88svh,52rem)]">
        {/* Phones: the photo sits above the text and fades into the dark card. Wider screens: it fills the card behind the text. */}
        <div className="relative aspect-[4/3] overflow-hidden md:absolute md:inset-0 md:-z-20 md:aspect-auto">
          {photo?.src && (
            <Image
              src={`${basePath}${photo.src}`}
              alt={`${photo.title}, a wedding photographed by ${brand.name}`}
              fill
              priority
              sizes="100vw"
              className="hero-photo object-cover object-[50%_35%]"
            />
          )}
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg to-transparent md:hidden" />
        </div>
        <div aria-hidden className="hero-scrim absolute inset-0 -z-10 hidden md:block" />

        <div className="container-page pb-8 pt-2 md:pb-14 md:pt-24 lg:pb-16">
          <p className="rise inline-flex items-center gap-2 label text-fg/85">
            <MapPinIcon aria-hidden className="size-4" />
            {brand.city}, {brand.region}
          </p>
          <h1 id="hero-title" className="mt-4 max-w-[18ch] heading-3 text-fg sm:heading-2 lg:heading-1 xl:text-[4.5rem]">
            Beautiful memories.
            <br />
            <em>Affordable photography.</em>
          </h1>
          <p className="rise mt-5 max-w-[56ch] body-3 text-fg/85 md:body-7" style={{ "--i": 1 } as CSSProperties}>
            Wedding, maternity, family and event photography in {brand.city}, with every package and price on the page before you message us.
          </p>
          <div className="rise mt-7 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between" style={{ "--i": 2 } as CSSProperties}>
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
              <ButtonLink href="/packages" size="lg" className="w-full sm:w-auto">
                See packages and prices
              </ButtonLink>
              <WhatsAppLink href={waLink("Hi Zoomin Fotos! I'd like to know more about your photography packages.")} source="hero" />
            </div>
            {(wedding || preWedding) && (
              <dl className="flex flex-wrap gap-x-8 gap-y-3 border-t border-fg/25 pt-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                {wedding && (
                  <div>
                    <dt className="caption-4 uppercase tracking-[0.08em] text-fg/70">Weddings from</dt>
                    <dd className="mt-1 tabular heading-5 text-fg">{formatRupees(wedding)}</dd>
                  </div>
                )}
                {preWedding && (
                  <div>
                    <dt className="caption-4 uppercase tracking-[0.08em] text-fg/70">Pre-wedding from</dt>
                    <dd className="mt-1 tabular heading-5 text-fg">{formatRupees(preWedding)}</dd>
                  </div>
                )}
                <div className="self-end caption-5 text-fg/70">Prices plus GST</div>
              </dl>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
