import { Quote, Star } from "lucide-react";
import PhotoFrame from "@/components/photos/PhotoFrame";
import { realPhotos } from "@/lib/data";
import { monthLabel, type Testimonial } from "@/lib/testimonials";
import { cn } from "@/lib/cn";

export function Stars({ n, className }: { n: number; className?: string }) {
  return (
    <span className={className} role="img" aria-label={`${n} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} aria-hidden className={i <= n ? "inline size-4 fill-[var(--marigold-glow)] text-[var(--marigold-glow)]" : "inline size-4 text-border-strong"} />
      ))}
    </span>
  );
}

/** One client review, with the photo from their shoot when the studio picked one. */
export default function ReviewCard({ t, clamp, className }: { t: Testimonial; clamp?: boolean; className?: string }) {
  const photo = t.photoId ? realPhotos.find((p) => p.id === t.photoId) : undefined;
  return (
    <figure className={cn("overflow-hidden rounded-lg border border-border bg-surface", className)}>
      {photo && <PhotoFrame photo={photo} caption={false} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 85vw" className="rounded-none" />}
      <div className="p-6">
        <div className="flex items-center justify-between gap-4">
          <Stars n={t.rating} />
          <Quote aria-hidden className="size-6 text-[var(--rani)] opacity-40" />
        </div>
        <blockquote className={cn("mt-4 whitespace-pre-line leading-relaxed", clamp && "line-clamp-6")}>{t.text}</blockquote>
        <figcaption className="mt-5 border-t border-border pt-4 text-sm">
          <span className="font-medium">{t.name}</span>
          <span className="block text-muted">{[t.event, monthLabel(t.date), t.source === "google" && "on Google"].filter(Boolean).join(" · ")}</span>
        </figcaption>
      </div>
    </figure>
  );
}
