import type { CSSProperties } from "react";
import PortfolioGallery from "@/components/photos/PortfolioGallery";
import { pickPhotos, realPhotos, weddingStory } from "@/lib/data";

/** The chapters of the wedding story with their photographs; a deleted photograph is skipped. */
export function storyChapters() {
  return weddingStory
    .map((c) => ({ ...c, photos: c.photoIds.map((id) => realPhotos.find((p) => p.id === id)).filter((p) => !!p) }))
    .filter((c) => c.photos.length > 0);
}

/** One photograph per chapter, for the home page. */
export function storyHighlights() {
  return pickPhotos(storyChapters().map((c) => c.photos[0].id));
}

/**
 * A wedding day told chapter by chapter, in the order it unfolds. Each chapter is its own small
 * gallery with the full-screen lightbox, so a couple can see how a whole day is covered rather
 * than a wall of unrelated favourites.
 */
export default function WeddingStory() {
  const chapters = storyChapters();
  return (
    <ol className="space-y-14 md:space-y-20">
      {chapters.map((c, i) => (
        <li key={c.id} id={`story-${c.id}`} className="scroll-mt-24 grid gap-6 lg:grid-cols-12 lg:gap-10">
          <header className="reveal lg:sticky lg:top-28 lg:col-span-4 lg:self-start" style={{ "--i": 0 } as CSSProperties}>
            <p className="label tabular text-accent">Chapter {String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-2 heading-5 md:heading-4">{c.title}</h3>
            <p className="mt-2 max-w-[40ch] body-6 text-muted md:body-3">{c.text}</p>
          </header>
          <div className="lg:col-span-8">
            <PortfolioGallery photos={c.photos} eager={0} compact />
          </div>
        </li>
      ))}
    </ol>
  );
}
