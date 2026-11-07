import Image from "next/image";
import type { CSSProperties } from "react";
import { MapPinIcon } from "@phosphor-icons/react/dist/ssr";
import { ButtonLink, WhatsAppLink } from "@/components/ui/Button";
import { brand, formatRupees, pickPhotos, startingPrice, waLink } from "@/lib/data";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Says what we do, where, from what price, and how to book, beside one real photograph.
 * One primary action (see the packages); WhatsApp sits under it as a quiet link.
 * Phones: the photo comes first, then the text. Wider screens: text left, photo right.
 * The heading never waits on an animation, so it is the page's first paint.
 */
export default function Hero() {
  const [photo] = pickPhotos(["01"]);
  const wedding = startingPrice("weddings");
  const preWedding = startingPrice("pre-wedding");

  return (
    <section aria-labelledby="hero-title" className="container-page pb-16 pt-6 md:pb-24 md:pt-12">
      <div className="grid gap-6 md:grid-cols-2 md:items-center md:gap-12 lg:grid-cols-12">
        {photo?.src && (
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl md:order-2 md:aspect-[4/5] lg:col-span-5">
            <Image
              src={`${basePath}${photo.src}`}
              alt={`${photo.title}, a wedding photographed by ${brand.name}`}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="hero-photo object-cover object-[50%_30%]"
            />
            <p className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-fg/70 px-3 py-1 caption-1 text-white backdrop-blur-sm md:hidden">
              <MapPinIcon aria-hidden className="size-4" />
              {brand.city}, {brand.region}
            </p>
          </div>
        )}
        <div className="lg:col-span-7">
          <p className="rise mb-4 hidden items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 caption-1 text-muted md:inline-flex">
            <MapPinIcon aria-hidden className="size-4 text-accent" />
            {brand.city}, {brand.region}
          </p>
          <h1 id="hero-title" className="hero-heading max-w-[680px] heading-3 lg:heading-2 xl:heading-1">
            Beautiful memories.
            <br />
            Affordable photography.
          </h1>
          <p className="rise mt-4 max-w-[680px] body-3 text-muted md:body-7" style={{ "--i": 1 } as CSSProperties}>
            Wedding, maternity, family and event photography in {brand.city}, with every package and price on the page before you message us.
          </p>
          {(wedding || preWedding) && (
            <p className="rise mt-4 flex flex-wrap gap-x-4 gap-y-1 body-6 md:mt-6" style={{ "--i": 2 } as CSSProperties}>
              {wedding && (
                <span>
                  Weddings from <strong className="tabular body-4 text-accent">{formatRupees(wedding)}</strong>
                </span>
              )}
              {preWedding && (
                <span>
                  Pre-wedding from <strong className="tabular body-4 text-accent">{formatRupees(preWedding)}</strong>
                </span>
              )}
              <span className="text-muted">Prices plus GST</span>
            </p>
          )}
          <div className="rise mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6" style={{ "--i": 3 } as CSSProperties}>
            <ButtonLink href="/packages" size="lg" className="w-full sm:w-auto">
              See packages and prices
            </ButtonLink>
            <WhatsAppLink href={waLink("Hi Zoomin Fotos! I'd like to know more about your photography packages.")} source="hero" />
          </div>
        </div>
      </div>
    </section>
  );
}
