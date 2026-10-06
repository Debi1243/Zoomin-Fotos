import type { CSSProperties } from "react";
import { ExternalLink } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import ReviewCard from "@/components/testimonials/ReviewCard";
import { brand } from "@/lib/data";
import { testimonials } from "@/lib/testimonials";

/** The latest client reviews on the home page. Before any are published it invites the first one. */
export default function HomeReviews() {
  const shown = testimonials.slice(0, 6);
  const count = testimonials.length;
  const average = count ? testimonials.reduce((s, t) => s + t.rating, 0) / count : 0;
  return (
    <section aria-labelledby="reviews-title" className="section-y border-t border-border">
      <div className="container-page">
        <div className="grid gap-y-6 lg:grid-cols-12 lg:gap-x-10">
          <p className="reveal-left label text-muted lg:col-span-3 lg:pt-3">
            <span aria-hidden className="label-dot festive-gradient" />
            Reviews
          </p>
          <div className="lg:col-span-9">
            <h2 id="reviews-title" className="reveal max-w-[20ch] font-display text-h2">
              Kind <em>words.</em>
            </h2>
            <p className="reveal mt-5 max-w-[56ch] leading-relaxed text-muted">
              {count
                ? `What our clients say. ${count === 1 ? "One review" : `${count} reviews`}, averaging ${average.toFixed(1)} out of 5.`
                : "Photographed by us? We would love to hear how it went."}
            </p>
            <div className="reveal mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <ButtonLink href={count ? "/testimonials" : "/testimonials#write"} variant="secondary">
                {count ? "Read all reviews" : "Write a review"}
              </ButtonLink>
              <a href={brand.googleReviews} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium link-underline">
                Our reviews on Google <ExternalLink aria-hidden className="size-3.5" />
              </a>
            </div>
          </div>
        </div>
        {count > 0 && (
          <ul className="-mx-4 mt-12 flex snap-x snap-mandatory scroll-px-4 items-start gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 md:mx-0 md:mt-16 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
            {shown.map((t, i) => (
              <li key={t.id} className="w-[85%] shrink-0 snap-center md:w-auto" style={{ "--i": i % 3 } as CSSProperties}>
                <ReviewCard t={t} clamp />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
