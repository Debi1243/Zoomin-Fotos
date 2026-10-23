import PortfolioGallery from "@/components/photos/PortfolioGallery";
import SectionHeader from "@/components/ui/SectionHeader";
import { TextLink } from "@/components/ui/Button";
import { pickPhotos, services, type ServiceSlug } from "@/lib/data";

/** Fifteen of the studio's strongest real photographs, across every kind of shoot. */
const FEATURED_IDS = ["81", "56", "65", "62", "55", "24", "36", "73", "26", "76", "44", "50", "70", "42", "43"];

const filterLabels: Partial<Record<ServiceSlug, string>> = {
  "maternity-newborn": "Kids & Newborn",
  events: "Events",
};

export default function FeaturedPortfolio() {
  const photos = pickPhotos(FEATURED_IDS);
  const filters = [
    { slug: "all" as const, label: "All", count: photos.length },
    ...services
      .map((s) => ({ slug: s.slug, label: filterLabels[s.slug] ?? s.title, count: photos.filter((p) => p.category === s.slug).length }))
      .filter((f) => f.count > 0),
  ];

  return (
    <section aria-labelledby="portfolio-title" className="section-y bg-sand-soft">
      <div className="container-page">
        <SectionHeader
          id="portfolio-title"
          label="Portfolio"
          title="Real moments from real clients"
          intro="Every photo here was taken by our team. Tap any photo to see it larger."
          action={<TextLink href="/portfolio">See the full portfolio</TextLink>}
        />
        <div className="mt-8 md:mt-10">
          <PortfolioGallery photos={photos} filters={filters} eager={0} compact />
        </div>
      </div>
    </section>
  );
}
