"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import type { Video } from "@/lib/data";
import { youtubeThumb } from "@/lib/youtube";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const playButton =
  "absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#16150f] shadow-lg transition-[transform,background-color] duration-500 ease-[var(--ease-out-expo)] group-hover:scale-110 group-hover:bg-white";

/**
 * Plays a film in place. YouTube films show their thumbnail until tapped, so the page loads no
 * YouTube player (or its cookies) until someone wants to watch. Uploaded files use the browser's
 * own player and only load when played.
 */
export default function FilmPlayer({ video }: { video: Video }) {
  const [playing, setPlaying] = useState(false);

  if (video.src) {
    return (
      <video
        controls
        playsInline
        preload={video.poster ? "none" : "metadata"}
        poster={video.poster ? `${basePath}${video.poster}` : undefined}
        controlsList="nodownload"
        aria-label={video.title}
        className="block aspect-video w-full rounded-lg bg-black object-contain"
      >
        <source src={`${basePath}${video.src}`} type={video.src.endsWith(".webm") ? "video/webm" : "video/mp4"} />
      </video>
    );
  }

  if (!video.youtubeId) return null;

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
        title={video.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="block aspect-video w-full rounded-lg bg-black"
      />
    );
  }

  return (
    <button type="button" onClick={() => setPlaying(true)} className="group relative block aspect-video w-full overflow-hidden rounded-lg bg-sand">
      {/* eslint-disable-next-line @next/next/no-img-element -- thumbnail served by YouTube */}
      <img
        src={youtubeThumb(video.youtubeId)}
        alt=""
        loading="lazy"
        decoding="async"
        className="size-full scale-[1.02] object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.07]"
      />
      <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
      <span aria-hidden className={playButton}>
        <Play className="ml-0.5 size-6 fill-current" />
      </span>
      <span className="sr-only">Play {video.title}</span>
    </button>
  );
}
