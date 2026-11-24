import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import PortfolioGallery, { type Filter } from "@/components/photos/PortfolioGallery";
import WeddingStory from "@/components/photos/WeddingStory";
import ClosingCta from "@/components/sections/ClosingCta";
import FilmGrid from "@/components/sections/FilmGrid";
import SectionHeader from "@/components/ui/SectionHeader";
import JsonLd from "@/components/shared/JsonLd";
import { brand, collections, photosIn, realPhotos, services, videos, type ServiceSlug } from "@/lib/data";
import { absoluteUrl } from "@/lib/site";

const title = `Wedding & Photography Portfolio, ${brand.city}`;
const description = `Real wedding stories, haldi and mehendi, candid moments, pre-wedding, portrait, kids, event and commercial photography by ${brand.name}, ${brand.city}, ${brand.region}.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/portfolio" },
  openGraph: { title, description, url: "/portfolio" },
};

/** Category names as couples and clients search for them. */
const labels: Partial<Record<ServiceSlug, string>> = {
  "pre-wedding": "Pre-weddings",
  "maternity-newborn": "Kids & Newborn",
};

/** Where the cross-category collections sit among the service filters. */
const order: string[] = ["weddings", "pre-wedding", "haldi-mehendi", "candid", "portraits", "maternity-newborn", "events", "commercial"];

export default function PortfolioPage() {
  // Real photographs lead; placeholder frames follow until they are replaced.
  const shown = services.flatMap((s) => photosIn(s.slug));
  const ordered = [...shown.filter((p) => p.src), ...shown.filter((p) => !p.src)];
  const byService: Filter[] = services.map((s) => ({ slug: s.slug, label: labels[s.slug] ?? s.title, count: photosIn(s.slug).length }));
  const byCollection: Filter[] = collections.map((c) => {
    const ids = c.ids.filter((id) => realPhotos.some((p) => p.id === id));
    return { slug: c.slug, label: c.label, count: ids.length, ids };
  });
  const filters: Filter[] = [
    { slug: "all", label: "All", count: ordered.length },
    ...[...byService, ...byCollection].filter((f) => f.count > 0).sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug)),
  ];

  return (
    <>
      <PageHero
        label="Portfolio"
        crumbs={[]}
        title="Our photography portfolio"
        intro="Every photograph here is our own, from real weddings, sessions and shoots in Odisha. Start with a wedding day told chapter by chapter, or browse by category."
      >
        <nav aria-label="On this page" className="mt-6 flex flex-wrap gap-2">
          {[
            ["#wedding-story", "Wedding stories"],
            ["#gallery", "Browse by category"],
            ...(videos.length ? [["#films", "Films"]] : []),
          ].map(([href, label]) => (
            <a key={href} href={href} className="inline-flex h-11 items-center rounded-full border border-border bg-surface px-4 text-sm font-medium hover:border-fg">
              {label}
            </a>
          ))}
        </nav>
      </PageHero>

      <section id="wedding-story" aria-labelledby="story-title" className="section-y scroll-mt-20 border-t border-border">
        <div className="container-page">
          <SectionHeader
            id="story-title"
            label="Wedding stories"
            title="A wedding day, chapter by chapter"
            intro="We cover the whole day, not just the highlights. These chapters bring together moments from weddings we have photographed across Odisha, in the order the day unfolds. Tap any photo to see it full screen."
          />
          <div className="mt-10 md:mt-14">
            <WeddingStory />
          </div>
        </div>
      </section>

      <section id="gallery" aria-labelledby="gallery-title" className="section-y scroll-mt-20 border-t border-border">
        <div className="container-page">
          <SectionHeader id="gallery-title" label="Browse" title="Browse by category" />
          <div className="mt-8 md:mt-10">
            <PortfolioGallery photos={ordered} filters={filters} eager={0} linkable />
          </div>
        </div>
      </section>
      <FilmGrid videos={videos} showCategory />
      <ClosingCta />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: "Portfolio", item: absoluteUrl("/portfolio") },
          ],
        }}
      />
    </>
  );
}
