import type { CSSProperties } from "react";
import { ExternalLink } from "lucide-react";
import ReviewCard from "@/components/testimonials/ReviewCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { ButtonLink } from "@/components/ui/Button";
import { brand } from "@/lib/data";
import { testimonials } from "@/lib/testimonials";

/**
 * Real client reviews, published by the studio from /admin/reviews. Until there are any, the section
 * points to the Google listing instead of showing an empty "kind words" block. Nothing is ever made up.
 */
export default function HomeReviews({ className }: { className?: string }) {
  const shown = testimonials.slice(0, 6);
  const count = testimonials.length;
  const average = count ? testimonials.reduce((s, t) => s + t.rating, 0) / count : 0;

  return (
    <section aria-labelledby="reviews-title" className={className ?? "section-y"}>
      <div className="container-page">
        {count > 0 ? (
          <>
            <SectionHeader
              id="reviews-title"
              label="Reviews"
              title="What our clients say"
              intro={`${count === 1 ? "One review" : `${count} reviews`}, averaging ${average.toFixed(1)} out of 5.`}
              action={
                <a href={brand.googleReviews} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-accent link-underline">
                  Read them on Google <ExternalLink aria-hidden className="size-3.5" />
                </a>
              }
            />
            <ul className="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory scroll-px-4 items-start gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 lg:grid-cols-3">
              {shown.map((t, i) => (
                <li key={t.id} className="w-[85%] shrink-0 snap-center md:w-auto" style={{ "--i": i % 3 } as CSSProperties}>
                  <ReviewCard t={t} clamp />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="reveal flex flex-col gap-6 rounded-lg border border-border bg-surface p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div>
              <p className="label text-accent">Reviews</p>
              <h2 id="reviews-title" className="mt-3 font-display text-h3">
                See what our clients say on Google
              </h2>
              <p className="mt-2 max-w-[52ch] text-muted">Read genuine reviews from our clients on our Google Business listing, or leave one if we photographed you.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:shrink-0">
              <a
                href={brand.googleReviews}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border-strong bg-surface px-4 text-sm font-semibold hover:border-fg"
              >
                Google reviews <ExternalLink aria-hidden className="size-4" />
              </a>
              <ButtonLink href="/testimonials#write" variant="secondary" arrow={false}>
                Write a review
              </ButtonLink>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
