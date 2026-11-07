import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { CheckIcon as Check, ClockIcon as Clock, UsersIcon as Users } from "@phosphor-icons/react/dist/ssr";
import { ButtonLink } from "@/components/ui/Button";
import SectionHeader from "@/components/ui/SectionHeader";
import { cn } from "@/lib/cn";
import { formatRupees, type Package } from "@/lib/data";
import { quoteHref } from "@/lib/contact";

const defaultIntro =
  "Prices are for one day of coverage, plus GST, and every price is negotiable. Tell us about your day and we will shape a package around it.";

type Props = {
  items: Package[];
  /** The service as the quote form names it, e.g. "Wedding". */
  service: string;
  intro?: string;
  label?: string;
  title?: ReactNode;
  /** Links under the cards, e.g. to the comparison table and the package builder. */
  footer?: ReactNode;
  id?: string;
  className?: string;
};

/**
 * Package cards. On phones they sit in a row you swipe through; on wide screens, side by side.
 * Only the package's own published details are shown.
 */
export default function Packages({ items, service, intro = defaultIntro, label, title, footer, id = "packages", className }: Props) {
  const single = items.length === 1;
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("section-y scroll-mt-20", className)}>
      <div className="container-page">
        <SectionHeader
          id={`${id}-title`}
          label={label ?? (single ? "Pricing" : "Packages")}
          title={title ?? (single ? `${service} pricing` : `${service} packages`)}
          intro={intro}
        />

        <ul
          className={cn(
            "no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 pt-3 sm:-mx-6 sm:scroll-px-6 sm:px-6 md:mt-12",
            single ? "md:mx-0 md:grid md:max-w-xl md:overflow-visible md:px-0" : "lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0",
          )}
        >
          {items.map((p, i) => (
            <li
              key={p.name}
              style={{ "--i": i } as CSSProperties}
              className={cn("stagger-in w-[85%] max-w-sm shrink-0 snap-center sm:w-[60%]", single ? "md:w-auto md:max-w-none" : "lg:w-auto lg:max-w-none")}
            >
              <article
                aria-labelledby={`${id}-${i}`}
                className={cn(
                  "lift relative flex h-full flex-col rounded-xl border bg-surface p-6",
                  p.featured ? "border-primary" : "border-border hover:border-border-strong",
                )}
              >
                {p.featured && (
                  <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 caption-3 text-primary-fg">
                    Most complete
                  </span>
                )}
                <h3 id={`${id}-${i}`} className="heading-5">{p.name}</h3>
                <p className="mt-1 body-6 text-muted">{p.tagline.charAt(0).toUpperCase() + p.tagline.slice(1)}</p>

                <p className="mt-6">
                  {p.startingFrom && <span className="block caption-2 text-muted">Starting from</span>}
                  <span className="tabular heading-4 text-fg">{formatRupees(p.price)}</span>
                  <span className="ml-2 caption-2 text-muted">+ GST</span>
                </p>
                <p className="mt-1 caption-2 text-muted">{p.note ?? "Price is negotiable"}</p>

                <dl className="mt-6 grid gap-2 border-t border-border pt-6 body-6">
                  {p.team && (
                    <div className="flex gap-2">
                      <dt><Users aria-label="Team" className="mt-0.5 size-4 text-accent" /></dt>
                      <dd>{p.team}</dd>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <dt><Clock aria-label="Coverage" className="mt-0.5 size-4 text-accent" /></dt>
                    <dd>{p.unit ? p.unit.replace(/\s*\+\s*GST$/, "").replace(/^per /, "One ") : "1 day of coverage"}</dd>
                  </div>
                </dl>

                <ul className="mt-4 grid gap-2 body-6">
                  {p.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-success" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-6">
                  <ButtonLink
                    href={quoteHref({ service, pkg: single ? undefined : p.name, price: p.price })}
                    variant={p.featured ? "primary" : "secondary"}
                    className="w-full"
                    data-track="package_select"
                    data-track-source={`${service}:${p.name}`}
                    aria-label={`Book the ${p.name} package`}
                  >
                    Book {single ? "this shoot" : "this package"}
                  </ButtonLink>
                </div>
              </article>
            </li>
          ))}
        </ul>
        {!single && <p className="mt-1 text-center caption-2 text-muted lg:hidden">Swipe to see all {items.length} packages</p>}
        {footer && <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">{footer}</div>}
      </div>
    </section>
  );
}

/** A plain link styled for the row under the package cards. */
export function PackagesLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="link-underline w-fit button-sm text-accent">
      {children}
    </Link>
  );
}
