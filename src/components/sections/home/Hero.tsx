import Image from "next/image";
import type { CSSProperties } from "react";
import { MapPin } from "lucide-react";
import { ButtonLink, WhatsAppButton } from "@/components/ui/Button";
import { brand, formatRupees, pickPhotos, startingPrice, waLink } from "@/lib/data";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Says what we do, where, from what price, and how to book, with one real photograph.
 * Phones: the photo sits above the text, so faces are never covered. Wider screens: the
 * text sits over the photo's darker left side. Nothing here animates: the photo and the
 * heading are the page's first paint.
 */
export default function Hero() {
  const [photo] = pickPhotos(["01"]);
  const wedding = startingPrice("weddings");
  const preWedding = startingPrice("pre-wedding");

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden md:bg-fg md:text-white">
      {photo?.src && (
        <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/9] md:absolute md:inset-0 md:-z-10 md:aspect-auto">
          <Image
            src={`${basePath}${photo.src}`}
            alt={`${photo.title}, a wedding photographed by ${brand.name}`}
            fill
            priority
            sizes="100vw"
            className="hero-photo object-cover object-[50%_30%]"
          />
          <div
            aria-hidden
            className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgb(20_16_14/0.85)_0%,rgb(20_16_14/0.6)_42%,rgb(20_16_14/0.05)_78%)] md:block"
          />
          <p className="rise absolute bottom-3 left-4 inline-flex items-center gap-1.5 rounded-full bg-fg/70 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm md:hidden">
            <MapPin aria-hidden className="size-4" />
            {brand.city}, {brand.region}
          </p>
        </div>
      )}
      <div className="container-page pb-10 pt-6 md:flex md:min-h-[38rem] md:items-center md:py-20 lg:min-h-[42rem]">
        <div className="max-w-xl">
          <p className="rise hidden items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium backdrop-blur-sm md:inline-flex">
            <MapPin aria-hidden className="size-4" />
            {brand.city}, {brand.region}
          </p>
          <h1 id="hero-title" className="font-display text-display md:mt-5">
            Beautiful Memories. Affordable Photography.
          </h1>
          <p className="rise mt-4 text-lead text-muted md:text-white/85" style={{ "--i": 1 } as CSSProperties}>
            Professional wedding, pre-wedding, maternity, family and event photography with transparent packages and effortless booking.
          </p>
          {(wedding || preWedding) && (
            <p className="rise mt-5 flex flex-wrap gap-x-4 gap-y-1 text-[0.9375rem]" style={{ "--i": 2 } as CSSProperties}>
              {wedding && (
                <span>
                  Weddings from <strong className="tabular font-bold text-accent md:text-white">{formatRupees(wedding)}</strong>
                </span>
              )}
              {preWedding && (
                <span>
                  Pre-wedding from <strong className="tabular font-bold text-accent md:text-white">{formatRupees(preWedding)}</strong>
                </span>
              )}
              <span className="text-muted md:text-white/70">Prices + GST</span>
            </p>
          )}
          <div className="rise mt-7 flex flex-col gap-3 sm:flex-row" style={{ "--i": 3 } as CSSProperties}>
            <ButtonLink href="/packages" size="lg">
              Explore Packages
            </ButtonLink>
            <WhatsAppButton href={waLink("Hi Zoomin Fotos! I'd like to know more about your photography packages.")} source="hero" size="lg" />
          </div>
        </div>
      </div>
    </section>
  );
}
