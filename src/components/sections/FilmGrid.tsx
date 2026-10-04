import type { CSSProperties } from "react";
import { Play } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { getService, type Video } from "@/lib/data";
import { youtubeThumb, youtubeUrl } from "@/lib/youtube";

type Props = {
  videos: Video[];
  /** Name each film's category, for lists that mix services. */
  showCategory?: boolean;
  className?: string;
};

/** Films hosted on YouTube: a thumbnail grid where each card opens the film on YouTube. */
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
              Watch the <em>films.</em>
            </>
          }
          intro="Some days are best seen moving. Each film opens on YouTube."
        />
        <ul className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
          {videos.map((v, i) => (
            <li key={v.id} className="stagger-in" style={{ "--i": i % 3 } as CSSProperties}>
              <a href={youtubeUrl(v.youtubeId)} target="_blank" rel="noopener noreferrer" className="group block">
                <span className="relative block aspect-video overflow-hidden rounded-sm bg-inverse">
                  {/* eslint-disable-next-line @next/next/no-img-element -- thumbnail served by YouTube */}
                  <img
                    src={youtubeThumb(v.youtubeId)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="size-full scale-[1.02] object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.07]"
                  />
                  <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
                  <span
                    aria-hidden
                    className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#16150f] shadow-lg transition-[transform,background-color] duration-500 ease-[var(--ease-out-expo)] group-hover:scale-110 group-hover:bg-white"
                  >
                    <Play className="ml-0.5 size-6 fill-current" />
                  </span>
                </span>
                <span className="mt-4 block">
                  {showCategory && <span className="label block text-muted">{getService(v.category)?.title}</span>}
                  <span className="mt-1 block font-display text-[1.375rem] leading-snug transition-colors group-hover:text-accent">
                    {v.title}
                  </span>
                  <span className="sr-only"> (opens YouTube in a new tab)</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
