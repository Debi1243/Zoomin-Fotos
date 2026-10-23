import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatRupees, getService } from "@/lib/data";

/**
 * Starting prices at a glance, taken from the service packages so the home page never
 * disagrees with the service pages. Services without published packages are quoted on request.
 */
function priceRange(slug: string) {
  const prices = (getService(slug)?.packages ?? []).map((p) => p.price);
  return prices.length ? { from: Math.min(...prices), to: Math.max(...prices), count: prices.length } : null;
}

export default function PricingGuide() {
  const weddings = priceRange("weddings");
  const preWedding = priceRange("pre-wedding");
  const rows = [
    weddings && {
      href: "/services/weddings#packages",
      title: "Weddings",
      price: `${formatRupees(weddings.from)} to ${formatRupees(weddings.to)}`,
      note: `${weddings.count} packages, priced per day of coverage, plus GST. Negotiable.`,
    },
    preWedding && {
      href: "/services/pre-wedding#packages",
      title: "Pre-wedding",
      price: `From ${formatRupees(preWedding.from)}`,
      note: "Per shoot, plus GST.",
    },
    {
      href: "/contact",
      title: "Portraits, maternity, events and commercial",
      price: "Quoted for your shoot",
      note: "Depends on the hours, the team and any albums or prints. You get an itemised quote after a short call.",
    },
  ].filter((r): r is NonNullable<typeof r> => !!r);

  return (
    <section aria-labelledby="pricing-title" className="section-y border-t border-border">
      <div className="container-page grid gap-y-10 lg:grid-cols-12 lg:gap-x-10">
        <p className="reveal-left label text-muted lg:col-span-3 lg:pt-3">
          <span aria-hidden className="label-dot festive-gradient" />
          Pricing
        </p>
        <div className="lg:col-span-9">
          <h2 id="pricing-title" className="reveal max-w-[20ch] font-display text-h2">
            Clear prices, <em>before</em> you call.
          </h2>
          <ul className="mt-10 border-t border-border md:mt-14">
            {rows.map((r, i) => (
              <li key={r.title} className="reveal border-b border-border" style={{ "--i": i } as CSSProperties}>
                <Link href={r.href} className="group grid gap-x-8 gap-y-2 py-6 md:grid-cols-[1fr_auto] md:items-baseline">
                  <span>
                    <span className="block font-display text-[1.5rem] leading-tight transition-colors group-hover:text-accent md:text-[1.875rem]">
                      {r.title}
                    </span>
                    <span className="mt-2 block max-w-[52ch] text-sm text-muted">{r.note}</span>
                  </span>
                  <span className="flex items-center gap-3 md:justify-end">
                    <span className="tabular font-medium">{r.price}</span>
                    <ArrowUpRight aria-hidden className="size-5 shrink-0 text-muted transition-colors group-hover:text-accent" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
