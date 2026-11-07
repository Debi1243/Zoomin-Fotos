import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRightIcon as ArrowRight } from "@phosphor-icons/react/dist/ssr";
import PhotoFrame from "@/components/photos/PhotoFrame";
import SectionHeader from "@/components/ui/SectionHeader";
import { formatRupees, homeServices, pickPhotos, startingPrice } from "@/lib/data";

/** One card per kind of shoot: a real photo, the starting price where published, and a way in. */
export default function ServiceCards() {
  return (
    <section aria-labelledby="services-title" className="section-y">
      <div className="container-page">
        <SectionHeader
          id="services-title"
          label="Photography services"
          title="What would you like photographed?"
          intro="Pick a service to see its photos, prices and packages."
        />
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-6 md:mt-12 lg:grid-cols-3">
          {homeServices.map((s, i) => {
            const [photo] = pickPhotos([s.photoId]);
            const from = startingPrice(s.slug);
            return (
              <li key={s.title} className="stagger-in" style={{ "--i": i } as CSSProperties}>
                <Link
                  href={`/services/${s.slug}`}
                  className="lift group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface hover:border-border-strong"
                >
                  {photo && (
                    <div className="aspect-[4/5] sm:aspect-[4/3]">
                      <PhotoFrame photo={photo} fill sizes="(min-width: 1024px) 30vw, 50vw" square />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-3 sm:p-6">
                    <h3 className="title-3 sm:heading-6">{s.title}</h3>
                    <p className="mt-1 body-4 text-accent">
                      {from ? <>From <span className="tabular">{formatRupees(from)}</span> + GST</> : "Ask for a quote"}
                    </p>
                    <p className="mt-2 hidden body-6 text-muted sm:block">{s.text}</p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-3 button-sm text-fg">
                      {from ? "View packages" : "See photos and details"}
                      <ArrowRight aria-hidden className="size-4 transition-transform duration-500 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
