import type { Metadata } from "next";
import DepthGallery from "@/components/photos/DepthGallery";
import { ButtonLink, WhatsAppButton } from "@/components/ui/Button";
import { realPhotos, services, waLink } from "@/lib/data";

const description = "Every photograph from Zoomin Fotos, Bhubaneswar, in one 3D scrolling portfolio: weddings, pre-wedding, portraits, maternity, events and commercial work.";

/**
 * A 3D portfolio to send clients who ask to see our work. It is left out of the menu and the
 * sitemap and asks search engines not to list it, so people reach it from the shared link.
 * It reads the same photo list as the rest of the site, so new uploads appear here on their own.
 */
export const metadata: Metadata = {
  title: "Our work, in 3D",
  description,
  alternates: { canonical: "/work" },
  robots: { index: false, follow: false },
  openGraph: { title: "Our work | Zoomin Fotos", description, url: "/work" },
};

export default function WorkPage() {
  const filters = [
    { slug: "all" as const, label: "All", count: realPhotos.length },
    ...services
      .map((s) => ({ slug: s.slug, label: s.title, count: realPhotos.filter((p) => p.category === s.slug).length }))
      .filter((f) => f.count > 0),
  ];
  return (
    <section aria-labelledby="work-title" className="page-hero relative isolate overflow-x-clip pb-24 pt-4 md:pb-32 md:pt-10">
      <div className="work-orbs" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="label label-rule justify-center text-gold-text">Portfolio</p>
          <h1 id="work-title" className="text-h1 mt-3 text-fg md:mt-4">
            Our work, <em className="text-accent">in 3D</em>
          </h1>
          <p className="mt-3 text-sm text-muted md:text-lead md:mt-4">
            {realPhotos.length} photographs from our weddings, sessions and shoots. Scroll down to see them all, and tap any photo to see it full size.
          </p>
        </div>

        <div className="mt-5 md:mt-8">
          <DepthGallery photos={realPhotos} filters={filters} />
        </div>

        <div className="glass mx-auto mt-14 flex max-w-2xl flex-col items-center gap-5 rounded-2xl px-6 py-8 text-center md:mt-20 md:px-10">
          <p className="font-display text-2xl text-fg md:text-3xl">Like what you see?</p>
          <p className="text-muted">Tell us your date and the occasion, and we will send you a quote.</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <WhatsAppButton href={waLink("Hi Zoomin Fotos, I saw your portfolio and would like to check availability for a shoot.")} size="lg" source="work">
              Chat on WhatsApp
            </WhatsAppButton>
            <ButtonLink href="/packages" variant="secondary" size="lg">
              See packages
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
