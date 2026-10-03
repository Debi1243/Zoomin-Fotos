import type { CSSProperties } from "react";
import { Check, Users } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { formatRupees, type Package } from "@/lib/data";

export default function Packages({ items, service }: { items: Package[]; service: string }) {
  return (
    <section id="packages" aria-labelledby="packages-title" className="section-y scroll-mt-20 border-t border-border">
      <div className="container-page">
        <div className="grid gap-y-6 lg:grid-cols-12 lg:gap-x-10">
          <p className="label text-muted lg:col-span-3 lg:pt-3">Packages</p>
          <div className="lg:col-span-9">
            <h2 id="packages-title" className="max-w-[20ch] font-display text-h2">
              {service} packages<em>.</em>
            </h2>
            <p className="mt-5 max-w-[56ch] leading-relaxed text-muted">
              Prices are for one day of coverage, plus GST, and every price is negotiable. Tell us about your day and we
              will shape a package around it.
            </p>
          </div>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 md:mt-16 xl:grid-cols-4">
          {items.map((p, i) => (
            <li
              key={p.name}
              style={{ "--i": i } as CSSProperties}
              className={cn(
                "stagger-in relative flex flex-col rounded-lg border p-6 md:p-7",
                p.featured ? "border-accent/60 bg-inverse text-inverse-fg" : "border-border bg-surface",
              )}
            >
              {p.featured && (
                <span className="label absolute -top-3 right-6 rounded-full bg-inverse-fg px-3 py-1 text-[0.6875rem] text-inverse">
                  Most complete
                </span>
              )}
              <h3 className="font-display text-h3">{p.name}</h3>
              <p className={cn("label mt-2", p.featured ? "text-inverse-muted" : "text-muted")}>{p.tagline}</p>

              <p className="mt-6 flex flex-wrap items-baseline gap-x-2">
                <span className="tabular font-display text-[2.5rem] leading-none tracking-[-0.02em]">{formatRupees(p.price)}</span>
                <span className={cn("text-sm", p.featured ? "text-inverse-muted" : "text-muted")}>1 day + GST</span>
              </p>
              <p className={cn("mt-1 text-sm", p.featured ? "text-inverse-muted" : "text-muted")}>Price is negotiable</p>

              <p
                className={cn(
                  "mt-6 flex gap-3 border-t pt-5 text-sm leading-relaxed",
                  p.featured ? "border-inverse-border" : "border-border",
                )}
              >
                <Users aria-hidden className={cn("mt-0.5 size-4 shrink-0", p.featured ? "text-inverse-fg" : "text-accent")} />
                <span>
                  <span className="sr-only">Team: </span>
                  {p.team}
                </span>
              </p>
              <ul className="mt-4 grid gap-3 text-sm leading-relaxed">
                {p.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <Check aria-hidden className={cn("mt-0.5 size-4 shrink-0", p.featured ? "text-inverse-fg" : "text-accent")} />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-8">
                <ButtonLink
                  href="/contact"
                  variant={p.featured ? "inverse" : "secondary"}
                  className="w-full"
                  aria-label={`Enquire about the ${p.name} package`}
                >
                  Enquire
                </ButtonLink>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
