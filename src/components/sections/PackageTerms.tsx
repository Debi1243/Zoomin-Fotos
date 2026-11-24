import Link from "next/link";
import type { ReactNode } from "react";
import { CalendarCheckIcon, CheckIcon, ReceiptIcon, SlidersHorizontalIcon } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { brand, customPackagesLine, formatRupees } from "@/lib/data";
import { extraHours } from "@/lib/package-builder";
import { cn } from "@/lib/cn";

/**
 * What every wedding package includes, what costs extra, how delivery works and how to change a
 * package, in one place beside the cards. Only what the studio publishes: the extra-hour rate comes
 * from the admin Prices page, and delivery dates are given in the quote, not promised here.
 */
export default function PackageTerms({ className, builderHref = "/packages#builder" }: { className?: string; builderHref?: string }) {
  const blocks: { icon: Icon; title: string; items: ReactNode[] }[] = [
    {
      icon: CheckIcon,
      title: "In every wedding package",
      items: [
        "One full day of coverage",
        "At least one photographer and one cinematographer",
        "All raw photos (high resolution) and all raw videos",
        "A full-length edited video",
        "A printed album: premium standard size, or a 14x40 luxury album with Infinity",
      ],
    },
    {
      icon: ReceiptIcon,
      title: "Charged in addition",
      items: [
        "GST, added to your invoice",
        `Extra hours beyond the day's coverage, ${formatRupees(extraHours.price)} per hour`,
        `Travel and stay for shoots outside ${brand.city}, quoted before you book`,
        "More events (haldi, sangeet, reception) are priced per event",
      ],
    },
    {
      icon: CalendarCheckIcon,
      title: "Delivery",
      items: [
        "Your delivery dates are written into your quote, before you pay anything",
        "Follow your teaser, photos, films and album in your client portal",
        "Album designs are shared for your approval before printing",
      ],
    },
    {
      icon: SlidersHorizontalIcon,
      title: "Customisation",
      items: [
        customPackagesLine,
        <>
          Add a drone, live streaming, a teaser or a same-day edit in the{" "}
          <Link href={builderHref} className="link-underline text-accent">
            package builder
          </Link>
          , and see an itemised estimate.
        </>,
      ],
    },
  ];

  return (
    <div className={cn("grid gap-x-10 gap-y-8 border-t border-border pt-8 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {blocks.map(({ icon: Ico, title, items }) => (
        <div key={title}>
          <h3 className="flex items-center gap-2 body-1 text-fg">
            <Ico aria-hidden className="size-5 text-accent" />
            {title}
          </h3>
          <ul className="mt-3 space-y-2 body-6 text-muted">
            {items.map((item, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-border-strong" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
