import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Crumb = { href: string; label: string };

type Props = {
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  crumbs?: Crumb[];
  children?: ReactNode;
  className?: string;
};

export default function PageHero({ label, title, intro, crumbs, children, className }: Props) {
  return (
    <section className={cn("container-page grid gap-y-8 pb-16 pt-12 md:pb-24 md:pt-20 lg:grid-cols-12 lg:gap-x-10", className)}>
      <div className="rise lg:col-span-3 lg:pt-4">
        {crumbs ? (
          <nav aria-label="Breadcrumb">
            <ol className="label flex flex-wrap items-center gap-2 text-muted">
              {crumbs.map((c) => (
                <li key={c.href} className="flex items-center gap-2">
                  <Link href={c.href} className="hover:text-fg">{c.label}</Link>
                  <span aria-hidden>/</span>
                </li>
              ))}
              <li aria-current="page" className="text-fg">{label}</li>
            </ol>
          </nav>
        ) : (
          <p className="label text-muted">{label}</p>
        )}
      </div>
      <div className="lg:col-span-9">
        <h1 className="title-in max-w-[18ch] font-display text-h1">
          {title}
        </h1>
        {intro && (
          <p className="rise mt-7 max-w-[56ch] text-lead text-muted" style={{ "--i": 2 } as CSSProperties}>
            {intro}
          </p>
        )}
        {children && (
          <div className="rise" style={{ "--i": 3 } as CSSProperties}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
