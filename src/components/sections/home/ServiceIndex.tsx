import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import PhotoFrame from "@/components/photos/PhotoFrame";
import { photosIn, services } from "@/lib/data";

export default function ServiceIndex({ headingLevel: Heading = "h3" }: { headingLevel?: "h2" | "h3" }) {
  return (
    <ul className="border-t border-border">
      {services.map((s, i) => {
        const cover = photosIn(s.slug)[0];
        return (
          <li key={s.slug} className="border-b border-border">
            <Link
              href={`/services/${s.slug}`}
              className="group grid grid-cols-[4.5rem_1fr_auto] items-center gap-x-4 gap-y-1 py-5 sm:grid-cols-[6rem_1fr_auto] md:grid-cols-[3rem_7rem_minmax(0,1fr)_minmax(0,1.2fr)_auto] md:gap-x-8 md:py-6"
            >
              <span className="label tabular hidden text-muted md:block">0{i + 1}</span>
              <span className="row-span-2 block md:row-span-1">
                {cover && <PhotoFrame photo={{ ...cover, aspect: "square" }} caption={false} sizes="7rem" reveal />}
              </span>
              <Heading className="font-display text-[1.75rem] leading-none tracking-[-0.01em] transition-[color,translate] duration-500 ease-[var(--ease-out-expo)] group-hover:text-accent md:text-[2.25rem] md:group-hover:translate-x-2">
                {s.title}
              </Heading>
              <span className="col-start-2 row-start-2 text-sm leading-relaxed text-muted md:col-start-4 md:row-start-1">{s.short}</span>
              <ArrowUpRight
                aria-hidden
                className="col-start-3 row-span-2 row-start-1 size-5 text-muted transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent md:col-start-5 md:row-span-1"
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function ServicesSection() {
  return (
    <section aria-labelledby="services-title" className="section-y border-t border-border">
      <div className="container-page">
        <SectionHeader
          id="services-title"
          label="What we photograph"
          title="Six kinds of story, one way of seeing."
          intro="Whatever the occasion, the approach is the same: notice what matters, get out of its way, and make it look as good as it felt."
        />
        <div className="mt-12 md:mt-16">
          <ServiceIndex />
        </div>
      </div>
    </section>
  );
}
