"use client";

import { useState, type FormEvent } from "react";
import { ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/forms/Field";
import { CategorySelect, categoryName } from "@/components/admin/CategorySelect";
import type { ServiceSlug, Video } from "@/lib/data";
import type { Change } from "@/lib/github";
import { parseYouTubeId, youtubeThumb, youtubeUrl } from "@/lib/youtube";

type Props = {
  videos: Video[];
  busy: boolean;
  save: (label: string, change: Change, done: string) => Promise<boolean>;
};

const newVideoId = () => `v${Date.now().toString(36)}`;

/** Add, move and delete the YouTube films shown on the website. */
export default function VideoManager({ videos, busy, save }: Props) {
  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ServiceSlug>("weddings");
  const [linkError, setLinkError] = useState<string>();
  const [titleError, setTitleError] = useState<string>();
  const [confirming, setConfirming] = useState<string | null>(null);
  const youtubeId = parseYouTubeId(link);

  async function add(e: FormEvent) {
    e.preventDefault();
    const linkProblem = !youtubeId ? "Paste a YouTube link, for example https://youtu.be/abc123XYZ_0" : undefined;
    const titleProblem = !title.trim() ? "Give the video a title. It appears under the thumbnail." : undefined;
    setLinkError(linkProblem);
    setTitleError(titleProblem);
    if (linkProblem || titleProblem || !youtubeId) return;
    const video: Video = { id: newVideoId(), youtubeId, title: title.trim(), category };
    const ok = await save(
      "Adding the video…",
      ({ videos: current }) => ({ content: { videos: [video, ...current] }, message: `Add video: ${video.title}` }),
      "Video added.",
    );
    if (ok) {
      setLink("");
      setTitle("");
    }
  }

  const remove = (video: Video) => {
    setConfirming(null);
    return save(
      `Deleting “${video.title}”…`,
      ({ videos: current }) => ({
        content: { videos: current.filter((v) => v.id !== video.id) },
        message: `Remove video: ${video.title}`,
      }),
      `“${video.title}” deleted.`,
    );
  };

  const move = (video: Video, to: ServiceSlug) =>
    save(
      `Moving “${video.title}”…`,
      ({ videos: current }) => ({
        content: { videos: current.map((v) => (v.id === video.id ? { ...v, category: to } : v)) },
        message: `Move video to ${categoryName(to)}: ${video.title}`,
      }),
      `“${video.title}” moved to ${categoryName(to)}.`,
    );

  return (
    <section aria-labelledby="videos-title">
      <h2 id="videos-title" className="font-display text-h3">
        Videos
      </h2>
      <p className="mt-2 max-w-[60ch] text-sm text-muted">
        Paste a YouTube link. The website shows its thumbnail in the chosen category, and opens the video on YouTube when someone
        clicks it.
      </p>

      <form onSubmit={add} noValidate className="mt-6 grid gap-5 rounded-lg border border-border bg-surface p-5 md:grid-cols-[1fr_12rem] md:gap-6">
        <div className="space-y-4">
          <TextField
            id="video-link"
            label="YouTube link"
            inputMode="url"
            placeholder="https://www.youtube.com/watch?v=…"
            value={link}
            onChange={(e) => {
              setLink(e.target.value);
              setLinkError(undefined);
            }}
            error={linkError}
            valid={!!youtubeId}
          />
          <div className="grid gap-4 sm:grid-cols-[1fr_14rem]">
            <TextField
              id="video-title"
              label="Title"
              placeholder="e.g. Ananya and Rohit, wedding film"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setTitleError(undefined);
              }}
              error={titleError}
            />
            <div>
              <label htmlFor="video-category" className="text-sm font-medium">
                Category
              </label>
              <CategorySelect id="video-category" value={category} onChange={setCategory} className="mt-2 h-12" />
            </div>
          </div>
          <Button type="submit" loading={busy} loadingLabel="Saving…">
            Add video
          </Button>
        </div>
        <div aria-hidden className="hidden aspect-video overflow-hidden rounded-md bg-inverse md:block md:self-start">
          {youtubeId && (
            // eslint-disable-next-line @next/next/no-img-element -- preview straight from YouTube
            <img src={youtubeThumb(youtubeId)} alt="" className="size-full object-cover" />
          )}
        </div>
      </form>

      {videos.length === 0 ? (
        <p className="mt-6 text-sm text-muted">No videos yet. Once you add one, a Films section appears on its category page and in the portfolio.</p>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map((video) => (
            <li key={video.id} className="overflow-hidden rounded-lg border border-border bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element -- thumbnail served by YouTube */}
              <img src={youtubeThumb(video.youtubeId)} alt="" loading="lazy" className="aspect-video w-full bg-inverse object-cover" />
              <div className="space-y-3 p-4">
                <a
                  href={youtubeUrl(video.youtubeId)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-start gap-1.5 font-medium leading-snug hover:text-accent"
                >
                  {video.title}
                  <ExternalLink aria-hidden className="mt-1 size-3.5 shrink-0" />
                  <span className="sr-only">(opens YouTube)</span>
                </a>
                <div>
                  <label htmlFor={`vmove-${video.id}`} className="sr-only">
                    Category for {video.title}
                  </label>
                  <CategorySelect
                    id={`vmove-${video.id}`}
                    value={video.category}
                    onChange={(to) => to !== video.category && void move(video, to)}
                    disabled={busy}
                  />
                </div>
                {confirming === video.id ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => void remove(video)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-md bg-error px-3 text-sm font-medium text-white"
                    >
                      <Trash2 aria-hidden className="size-4" /> Yes, delete
                    </button>
                    <button type="button" onClick={() => setConfirming(null)} className="text-sm text-muted hover:text-fg">
                      Keep it
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirming(video.id)}
                    disabled={busy}
                    className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-error disabled:opacity-50"
                    aria-label={`Delete ${video.title}`}
                  >
                    <Trash2 aria-hidden className="size-4" /> Delete
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
