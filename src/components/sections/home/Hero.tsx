import type { CSSProperties } from "react";
import { ButtonLink } from "@/components/ui/Button";
import PhotoFrame from "@/components/photos/PhotoFrame";
import HeroSlideshow from "@/components/photos/HeroSlideshow";
import Parallax from "@/components/motion/Parallax";
import { brand, pickPhotos } from "@/lib/data";

export default function Hero() {
  const [s1, s2, s3, s4, top, bottom] = pickPhotos(["01", "30", "14", "09", "02", "26"]);
  const slides = [s1, s2, s3, s4];
  return (
    <section aria-labelledby="hero-title" className="aurora container-page grid items-center gap-y-10 pb-20 pt-6 md:grid-cols-12 md:gap-x-8 md:pt-14 lg:gap-x-10 lg:pb-28 lg:pt-16">
      <div className="md:col-span-7 lg:col-span-6">
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
          {/* Static on purpose: the headline is the page's largest paint on phones, so it must not wait for an animation. */}
          Photographs that <em>feel</em> like the day did.
        </h1>
        <p className="rise mt-8 max-w-[46ch] text-lead text-muted" style={{ "--i": 7 } as CSSProperties}>
          Weddings, portraits, families, events and brands, photographed with gentle direction and honest colour, then
          delivered as galleries you will actually go back to.
        </p>
        <div className="rise mt-10 flex flex-col gap-3 sm:flex-row" style={{ "--i": 8 } as CSSProperties}>
          <ButtonLink href="/contact" size="lg">Check your date</ButtonLink>
          <ButtonLink href="/portfolio" size="lg" variant="secondary" arrow={false}>View portfolio</ButtonLink>
        </div>
        <p
          aria-hidden
          className="rise label mt-16 hidden items-center gap-4 text-muted lg:flex"
          style={{ "--i": 9 } as CSSProperties}
        >
          <span className="scroll-cue relative block h-10 w-px overflow-hidden bg-border after:absolute after:inset-0 after:bg-fg" />
          Scroll to explore
        </p>
      </div>

      {/* Phones and tablets show the slideshow alone, so the hero stays about a screen tall; desktops add two stills beside it. */}
      <div className="grid gap-4 md:col-span-5 lg:col-span-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <HeroSlideshow photos={slides} />
        </div>
        <Parallax distance={36} className="col-span-2 hidden flex-col gap-4 pt-20 lg:flex">
          <PhotoFrame photo={top} sizes="(min-width: 1024px) 18vw, 40vw" priority className="wipe" style={{ "--i": 1 } as CSSProperties} />
          <PhotoFrame photo={bottom} sizes="(min-width: 1024px) 18vw, 40vw" className="wipe" style={{ "--i": 2 } as CSSProperties} />
        </Parallax>
      </div>
    </section>
  );
}
