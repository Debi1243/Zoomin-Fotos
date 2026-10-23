import Image from "next/image";
import { MapPin } from "lucide-react";
import { ButtonLink, WhatsAppButton } from "@/components/ui/Button";
import { brand, formatRupees, pickPhotos, startingPrice, waLink } from "@/lib/data";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Says what we do, where, from what price, and how to book, over one real photograph.
 * Nothing here animates: the photo and the heading are the page's first paint.
 */
export default function Hero() {
  const [photo] = pickPhotos(["01"]);
  const wedding = startingPrice("weddings");
  const preWedding = startingPrice("pre-wedding");

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-fg text-white">
      {photo?.src && (
        <Image
          src={`${basePath}${photo.src}`}
          alt={`${photo.title}, a wedding photographed by ${brand.name}`}
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-[50%_35%]"
        />
      )}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(20_16_14/0.15)_0%,rgb(20_16_14/0.35)_40%,rgb(20_16_14/0.85)_100%)] md:bg-[linear-gradient(90deg,rgb(20_16_14/0.82)_0%,rgb(20_16_14/0.55)_45%,rgb(20_16_14/0.05)_80%)]"
      />
      <div className="container-page flex min-h-[calc(100svh-4rem-var(--tabbar-h))] flex-col justify-end pb-10 pt-40 md:min-h-[38rem] md:justify-center md:py-24 lg:min-h-[42rem]">
        <div className="max-w-xl">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium backdrop-blur-sm">
            <MapPin aria-hidden className="size-4" />
            {brand.city}, {brand.region}
          </p>
          <h1 id="hero-title" className="mt-5 font-display text-display">
            Beautiful Memories. Affordable Photography.
          </h1>
          <p className="mt-4 text-lead text-white/85">
            Professional wedding, pre-wedding, maternity, family and event photography with transparent packages and effortless booking.
          </p>
          {(wedding || preWedding) && (
            <p className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-[0.9375rem]">
              {wedding && (
                <span>
                  Weddings from <strong className="tabular font-bold">{formatRupees(wedding)}</strong>
                </span>
              )}
              {preWedding && (
                <span>
                  Pre-wedding from <strong className="tabular font-bold">{formatRupees(preWedding)}</strong>
                </span>
              )}
              <span className="text-white/70">Prices + GST</span>
            </p>
          )}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
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
