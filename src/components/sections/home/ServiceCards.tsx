import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
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
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 md:mt-12 lg:grid-cols-3">
          {homeServices.map((s, i) => {
            const [photo] = pickPhotos([s.photoId]);
            const from = startingPrice(s.slug);
            return (
              <li key={s.title} className="stagger-in" style={{ "--i": i } as CSSProperties}>
                <Link
                  href={`/services/${s.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface transition-[border-color,box-shadow] duration-200 hover:border-border-strong hover:shadow-md"
                >
                  {photo && (
                    <div className="aspect-[4/5] sm:aspect-[4/3]">
                      <PhotoFrame photo={photo} fill sizes="(min-width: 1024px) 30vw, 50vw" square />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-3 sm:p-5">
                    <h3 className="font-display text-base leading-snug sm:text-h3">{s.title}</h3>
                    <p className="mt-1 text-sm font-semibold text-accent">
                      {from ? <>From <span className="tabular">{formatRupees(from)}</span> + GST</> : "Ask for a quote"}
                    </p>
                    <p className="mt-2 hidden text-sm leading-relaxed text-muted sm:block">{s.text}</p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-semibold text-fg">
                      {from ? "View packages" : "See photos and details"}
                      <ArrowRight aria-hidden className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
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
