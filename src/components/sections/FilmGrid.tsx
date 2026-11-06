import type { CSSProperties } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import FilmPlayer from "@/components/sections/FilmPlayer";
import { getService, type Video } from "@/lib/data";
import { youtubeUrl } from "@/lib/youtube";

type Props = {
  videos: Video[];
  /** Name each film's category, for lists that mix services. */
  showCategory?: boolean;
  className?: string;
};

/** Films from YouTube or uploaded from the admin page, each playing in place. */
export default function FilmGrid({ videos, showCategory = false, className }: Props) {
  if (!videos.length) return null;
  return (
    <section aria-labelledby="films-title" className={className ?? "section-y border-t border-border"}>
      <div className="container-page">
        <SectionHeader
          id="films-title"
          label="Films"
          title={
            <>
              Watch our films
            </>
          }
          intro="Some days are best seen moving. Tap a film to play it here."
        />
        <ul className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
          {videos.map((v, i) => (
            <li key={v.id} className="stagger-in" style={{ "--i": i % 3 } as CSSProperties}>
              <FilmPlayer video={v} />
              <p className="mt-4">
                {showCategory && <span className="label block text-muted">{getService(v.category)?.title}</span>}
                <span className="mt-1 block font-display text-[1.375rem] leading-snug">{v.title}</span>
              </p>
              {v.youtubeId && (
                <a
                  href={youtubeUrl(v.youtubeId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-sm text-muted underline-offset-4 hover:text-accent hover:underline"
                >
                  Watch on YouTube<span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
