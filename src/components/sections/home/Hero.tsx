import type { CSSProperties } from "react";
import { ButtonLink } from "@/components/ui/Button";
import PhotoFrame from "@/components/photos/PhotoFrame";
import HeroSlideshow from "@/components/photos/HeroSlideshow";
import Parallax from "@/components/motion/Parallax";
import SplitWords from "@/components/motion/SplitWords";
import { brand, photos } from "@/lib/data";

const byId = (id: string) => photos.find((p) => p.id === id)!;
const headline = ["Photographs", "that", { text: "feel", em: true }, "like", "the", "day", "did."];

export default function Hero() {
  const slides = ["01", "19", "14", "09"].map(byId);
  const [top, bottom] = [byId("02"), byId("26")];
  return (
    <section aria-labelledby="hero-title" className="container-page grid items-center gap-y-14 pb-20 pt-10 md:pt-14 lg:grid-cols-12 lg:gap-x-10 lg:pb-28 lg:pt-16">
      <div className="lg:col-span-6">
        <p className="rise label flex flex-wrap items-center gap-x-3 gap-y-1 text-muted">
          <span className="inline-flex items-center gap-2 text-fg">
            <span aria-hidden className="relative flex size-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-60 motion-reduce:hidden" />
              <span className="relative size-1.5 rounded-full bg-primary" />
            </span>
            Photography studio
          </span>
          <span aria-hidden>/</span>
          <span>
            {brand.city}, {brand.region}
          </span>
        </p>
        <h1 id="hero-title" className="mt-7 max-w-[11ch] font-display text-display">
          <SplitWords words={headline} start={1} />
        </h1>
        <p className="rise mt-8 max-w-[46ch] text-lead text-muted" style={{ "--i": 7 } as CSSProperties}>
          Weddings, portraits, families, events and brands, photographed with gentle direction and honest colour, then
          delivered as galleries you will actually go back to.
        </p>
        <div className="rise mt-10 flex flex-col gap-3 sm:flex-row" style={{ "--i": 8 } as CSSProperties}>
          <ButtonLink href="/contact" size="lg">Check your date</ButtonLink>
          <ButtonLink href="/portfolio" size="lg" variant="secondary" arrow={false}>View portfolio</ButtonLink>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3 sm:gap-4 lg:col-span-6">
        <div className="col-span-3">
          <HeroSlideshow photos={slides} />
        </div>
        <Parallax distance={36} className="col-span-2 flex flex-col gap-3 pt-12 sm:gap-4 sm:pt-20">
          <PhotoFrame photo={top} sizes="(min-width: 1024px) 18vw, 40vw" priority className="wipe" style={{ "--i": 1 } as CSSProperties} />
          <PhotoFrame photo={bottom} sizes="(min-width: 1024px) 18vw, 40vw" className="wipe" style={{ "--i": 2 } as CSSProperties} />
        </Parallax>
      </div>
    </section>
  );
}
