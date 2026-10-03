import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import PortfolioGallery from "@/components/photos/PortfolioGallery";
import ClosingCta from "@/components/sections/ClosingCta";
import { photos, photosIn, services } from "@/lib/data";

const description =
  "Weddings, pre-wedding, portraits, maternity and newborn, events and commercial photography by Zoomin Fotos, Bhubaneswar.";

export const metadata: Metadata = {
  title: "Portfolio",
  description,
  alternates: { canonical: "/portfolio" },
  openGraph: { title: "Portfolio", description, url: "/portfolio" },
};

export default function PortfolioPage() {
  // Real photographs lead; placeholder frames follow until they are replaced.
  const ordered = [...photos.filter((p) => p.src), ...photos.filter((p) => !p.src)];
  const filters = [
    { slug: "all" as const, label: "All", count: photos.length },
    ...services.map((s) => ({ slug: s.slug, label: s.title, count: photosIn(s.slug).length })),
  ];
  return (
    <>
      <PageHero
        label="Portfolio"
        title={<>A few favourite <em>frames.</em></>}
        intro="A small selection from recent weddings, sessions and shoots. Choose a category, or open any photograph to see it larger."
      />
      <section aria-label="Photographs" className="border-t border-border pb-24 pt-10 md:pb-32 md:pt-14">
        <div className="container-page">
          <PortfolioGallery photos={ordered} filters={filters} />
        </div>
      </section>
      <ClosingCta />
    </>
  );
}
