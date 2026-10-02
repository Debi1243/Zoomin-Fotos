import { ButtonLink } from "@/components/ui/Button";
import PhotoFrame from "@/components/photos/PhotoFrame";
import { brand, photos } from "@/lib/data";

const byId = (id: string) => photos.find((p) => p.id === id)!;

export default function Hero() {
  const [main, top, bottom] = [byId("14"), byId("03"), byId("06")];
  return (
    <section aria-labelledby="hero-title" className="container-page grid items-center gap-y-14 pb-20 pt-10 md:pt-14 lg:grid-cols-12 lg:gap-x-10 lg:pb-28 lg:pt-16">
      <div className="lg:col-span-6">
        <p className="label flex flex-wrap items-center gap-x-3 gap-y-1 text-muted">
          <span className="inline-flex items-center gap-2 text-fg">
            <span aria-hidden className="size-1.5 rounded-full bg-primary" />
            Photography studio
          </span>
          <span aria-hidden>/</span>
          <span>
            {brand.city}, {brand.region}
          </span>
        </p>
        <h1 id="hero-title" className="mt-7 max-w-[11ch] font-display text-display">
          Photographs that <em>feel</em> like the day did.
        </h1>
        <p className="mt-8 max-w-[46ch] text-lead text-muted">
          Weddings, portraits, families, events and brands, photographed with gentle direction and honest colour, then
          delivered as galleries you will actually go back to.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/contact" size="lg">Check your date</ButtonLink>
          <ButtonLink href="/portfolio" size="lg" variant="secondary" arrow={false}>View portfolio</ButtonLink>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3 sm:gap-4 lg:col-span-6">
        <div className="col-span-3">
          <PhotoFrame photo={main} sizes="(min-width: 1024px) 28vw, 60vw" priority />
        </div>
        <div className="col-span-2 flex flex-col gap-3 pt-12 sm:gap-4 sm:pt-20">
          <PhotoFrame photo={top} sizes="(min-width: 1024px) 18vw, 40vw" priority />
          <PhotoFrame photo={bottom} sizes="(min-width: 1024px) 18vw, 40vw" />
        </div>
      </div>
    </section>
  );
}
