import type { Metadata } from "next";
import { Quote, Star } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import PhotoFrame from "@/components/photos/PhotoFrame";
import ClosingCta from "@/components/sections/ClosingCta";
import ReviewForm from "@/components/testimonials/ReviewForm";
import JsonLd from "@/components/shared/JsonLd";
import { brand, realPhotos } from "@/lib/data";
import { monthLabel, testimonials } from "@/lib/testimonials";
import { siteUrl } from "@/lib/site";

const description = `What couples and families say about working with ${brand.name}, photographers in ${brand.city}, ${brand.region}.`;

export const metadata: Metadata = {
  title: "Reviews",
  description,
  alternates: { canonical: "/testimonials" },
  openGraph: { title: "Reviews", description, url: "/testimonials" },
};

function Stars({ n, className }: { n: number; className?: string }) {
  return (
    <span className={className} role="img" aria-label={`${n} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} aria-hidden className={i <= n ? "inline size-4 fill-[var(--marigold-glow)] text-[var(--marigold-glow)]" : "inline size-4 text-border-strong"} />
      ))}
    </span>
  );
}

export default function TestimonialsPage() {
  const count = testimonials.length;
  const average = count ? testimonials.reduce((s, t) => s + t.rating, 0) / count : 0;
  return (
    <>
      <PageHero
        label="Reviews"
        title={<>Kind <em>words.</em></>}
        intro={
          count
            ? `From the couples and families we have photographed. ${count === 1 ? "One review" : `${count} reviews`}, averaging ${average.toFixed(1)} out of 5.`
            : "From the couples and families we have photographed."
        }
      />

      <section aria-label="Reviews from clients" className="border-t border-border pb-20 pt-12 md:pb-28 md:pt-16">
        <div className="container-page">
          {count === 0 ? (
            <p className="max-w-[48ch] text-lead text-muted">Reviews from our clients will appear here soon. If we have photographed you, we would love to hear how it went.</p>
          ) : (
            <ul className="grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => {
                const photo = t.photoId ? realPhotos.find((p) => p.id === t.photoId) : undefined;
                return (
                  <li key={t.id}>
                    <figure className="overflow-hidden rounded-lg border border-border bg-surface">
                      {photo && <PhotoFrame photo={photo} caption={false} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" className="rounded-none" />}
                      <div className="p-6">
                        <div className="flex items-center justify-between gap-4">
                          <Stars n={t.rating} />
                          <Quote aria-hidden className="size-6 text-[var(--rani)] opacity-40" />
                        </div>
                        <blockquote className="mt-4 whitespace-pre-line leading-relaxed">{t.text}</blockquote>
                        <figcaption className="mt-5 border-t border-border pt-4 text-sm">
                          <span className="font-medium">{t.name}</span>
                          <span className="block text-muted">{[t.event, monthLabel(t.date)].filter(Boolean).join(" · ")}</span>
                        </figcaption>
                      </div>
                    </figure>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <section id="write" aria-labelledby="write-title" className="section-y scroll-mt-20 border-t border-border">
        <div className="container-page grid gap-y-8 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-4">
            <p className="label text-muted">
              <span aria-hidden className="label-dot festive-gradient" />
              Write a review
            </p>
            <h2 id="write-title" className="mt-4 font-display text-h2">
              Photographed by <em>us?</em>
            </h2>
            <p className="mt-5 max-w-[40ch] leading-relaxed text-muted">Tell others what it was like. We read every review before it goes up.</p>
          </div>
          <div className="lg:col-span-8">
            <ReviewForm />
          </div>
        </div>
      </section>

      <ClosingCta />

      {count > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "@id": `${siteUrl}/#studio`,
            name: brand.name,
            aggregateRating: { "@type": "AggregateRating", ratingValue: average.toFixed(1), reviewCount: count, bestRating: 5 },
            review: testimonials.map((t) => ({
              "@type": "Review",
              author: { "@type": "Person", name: t.name },
              reviewRating: { "@type": "Rating", ratingValue: t.rating, bestRating: 5 },
              reviewBody: t.text,
            })),
          }}
        />
      )}
    </>
  );
}
