import Link from "next/link";
import type { ReactNode } from "react";
import { CaretRightIcon as ChevronRight } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/cn";

type Crumb = { href: string; label: string };

type Props = {
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  crumbs?: Crumb[];
  /** Buttons, prices or notes under the intro. */
  children?: ReactNode;
  /** A photograph beside the text on wide screens, above it on phones. */
  media?: ReactNode;
  className?: string;
};

/** The top of every inner page: breadcrumbs or a label, the page heading and an intro. */
export default function PageHero({ label, title, intro, crumbs, children, media, className }: Props) {
  return (
    <section className={cn("container-page pb-12 pt-8 md:pb-16 md:pt-12", className)}>
      <div className={cn("grid gap-8", media && "lg:grid-cols-2 lg:items-center lg:gap-12")}>
        {media && <div className="lg:order-2">{media}</div>}
        <div>
          {crumbs ? (
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 caption-2 text-muted">
                <li className="flex items-center gap-2">
                  <Link href="/" className="inline-flex min-h-11 items-center transition-colors duration-300 hover:text-fg md:min-h-0">Home</Link>
                  <ChevronRight aria-hidden className="size-3.5" />
                </li>
                {crumbs.map((c) => (
                  <li key={c.href} className="flex items-center gap-2">
                    <Link href={c.href} className="inline-flex min-h-11 items-center transition-colors duration-300 hover:text-fg md:min-h-0">{c.label}</Link>
                    <ChevronRight aria-hidden className="size-3.5" />
                  </li>
                ))}
                <li aria-current="page" className="font-medium text-fg">{label}</li>
              </ol>
            </nav>
          ) : (
            <p className="label text-accent">{label}</p>
          )}
          <h1 className="hero-heading mt-4 max-w-[680px] heading-3 md:heading-1">{title}</h1>
          {intro && <p className="mt-4 max-w-[680px] body-3 text-muted md:body-7">{intro}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}
