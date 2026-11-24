import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import PhotoFrame from "@/components/photos/PhotoFrame";
import { storyChapters } from "@/components/photos/WeddingStory";
import SectionHeader from "@/components/ui/SectionHeader";
import { TextLink } from "@/components/ui/Button";
import { videos } from "@/lib/data";

/** Where the chips under the story lead: portfolio categories, opened straight to their filter. */
const more = [
  { href: "/portfolio#weddings", label: "Weddings" },
  { href: "/portfolio#haldi-mehendi", label: "Haldi & Mehendi" },
  { href: "/portfolio#candid", label: "Candid moments" },
  { href: "/portfolio#pre-wedding", label: "Pre-weddings" },
  { href: "/portfolio#events", label: "Events" },
  { href: "/portfolio#commercial", label: "Commercial" },
];

/**
 * The home page's portfolio: a wedding day in six chapters, one strong photograph each, so a couple
 * sees how a whole day is covered. Each chapter opens its full set on the portfolio page.
 */
export default function FeaturedPortfolio() {
  const chapters = storyChapters();

  return (
    <section aria-labelledby="portfolio-title" className="section-y surface-dark">
      <div className="container-page">
        <SectionHeader
          id="portfolio-title"
          label="Wedding stories"
          title="A wedding day, chapter by chapter"
          intro="From getting ready to the last dance at the reception, these are real moments from weddings we have photographed across Odisha."
          action={<TextLink href="/portfolio#wedding-story">See every chapter</TextLink>}
        />
        <ol className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:mt-12 lg:grid-cols-3 lg:gap-6">
          {chapters.map((c, i) => (
            <li key={c.id} className="stagger-in" style={{ "--i": i % 3 } as CSSProperties}>
              <Link href={`/portfolio#story-${c.id}`} className="group block">
                <div className="aspect-[4/5] overflow-hidden rounded-xl">
                  <PhotoFrame photo={c.photos[0]} fill sizes="(min-width: 1024px) 30vw, 50vw" />
                </div>
                <p className="mt-3 flex items-baseline gap-3">
                  <span className="tabular caption-3 text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span className="title-3 text-fg sm:title-2">{c.title}</span>
                </p>
                <p className="mt-1 hidden body-6 text-muted sm:block">{c.text}</p>
              </Link>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-8 md:mt-12 md:flex-row md:items-center md:justify-between">
          <p className="body-4 text-fg">
            {videos.length ? (
              <Link href="/portfolio#films" className="inline-flex min-h-11 items-center gap-2 text-accent">
                <span className="link-underline">Watch our wedding films</span>
                <ArrowRightIcon aria-hidden className="size-4" />
              </Link>
            ) : (
              "Explore more of our work"
            )}
          </p>
          <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
            {more.map((m) => (
              <li key={m.href} className="shrink-0">
                <Link href={m.href} className="inline-flex h-11 items-center rounded-full border border-border px-4 body-5 transition-colors hover:border-fg">
                  {m.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
