"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ExternalLink, Film, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/forms/Field";
import { CategorySelect, categoryName } from "@/components/admin/CategorySelect";
import type { ServiceSlug, Video } from "@/lib/data";
import { cn } from "@/lib/cn";
import { rawUrl, type Change, type FileChange } from "@/lib/github";
import { slugify, titleFromFileName } from "@/lib/image-prep";
import { MAX_VIDEO_MB, prepareVideo, videoProblem } from "@/lib/video-prep";
import { parseYouTubeId, youtubeThumb, youtubeUrl } from "@/lib/youtube";

type Props = {
  videos: Video[];
  busy: boolean;
  save: (label: string, change: Change, done: string) => Promise<boolean>;
  /** The commit the admin page last loaded, so new uploads show before the site redeploys. */
  repoRef: string;
  /** Shows a message while a file is read in the browser, before saving starts. */
  setBusy: (label: string | null) => void;
};

type Source = "youtube" | "file";

/** The thumbnail for a film: YouTube's, the uploaded file's still frame, or none. */
const thumbOf = (video: Video, ref: string) =>
  video.youtubeId ? youtubeThumb(video.youtubeId) : video.poster ? rawUrl(video.poster, ref) : undefined;

const newVideoId = () => `v${Date.now().toString(36)}`;

/** Add, move and delete the films shown on the website: YouTube links or uploaded video files. */
export default function VideoManager({ videos, busy, save, repoRef, setBusy }: Props) {
  const [source, setSource] = useState<Source>("youtube");
  const [link, setLink] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>();
  const [preview, setPreview] = useState<string>();
  const fileInput = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ServiceSlug>("weddings");
  const [linkError, setLinkError] = useState<string>();
  const [titleError, setTitleError] = useState<string>();
  const [confirming, setConfirming] = useState<string | null>(null);
  const youtubeId = parseYouTubeId(link);

  // Free the local preview of a file once it is replaced or uploaded.
  useEffect(() => () => void (preview && URL.revokeObjectURL(preview)), [preview]);

  function chooseFile(chosen: File | undefined) {
    if (fileInput.current) fileInput.current.value = "";
    if (!chosen) return;
    const problem = videoProblem(chosen);
    setFileError(problem);
    setFile(problem ? null : chosen);
    setPreview(problem ? undefined : URL.createObjectURL(chosen));
    if (!problem && !title.trim()) setTitle(titleFromFileName(chosen.name));
  }

  async function add(e: FormEvent) {
    e.preventDefault();
    const titleProblem = !title.trim() ? "Give the video a title. It appears under the thumbnail." : undefined;
    setTitleError(titleProblem);
    if (source === "youtube") {
      const linkProblem = !youtubeId ? "Paste a YouTube link, for example https://youtu.be/abc123XYZ_0" : undefined;
      setLinkError(linkProblem);
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
      return;
    }

    const fileProblem = !file ? "Choose a video file to upload." : undefined;
    setFileError(fileProblem);
    if (fileProblem || titleProblem || !file) return;
    setBusy("Reading the video…");
    let prepared;
    try {
      prepared = await prepareVideo(file);
    } catch (err) {
      setBusy(null);
      setFileError(err instanceof Error ? err.message : "This video could not be read.");
      return;
    }
    const id = newVideoId();
    const base = `/videos/${category}-${slugify(title) || "film"}-${id}`;
    const video: Video = {
      id,
      title: title.trim(),
      category,
      src: `${base}.${prepared.ext}`,
      ...(prepared.poster && { poster: `${base}-poster.${prepared.poster.ext}` }),
    };
    const files: FileChange[] = [{ path: `public${video.src}`, base64: prepared.base64 }];
    if (prepared.poster && video.poster) files.push({ path: `public${video.poster}`, base64: prepared.poster.base64 });
    const ok = await save(
      `Uploading the video (${(file.size / 1024 / 1024).toFixed(0)} MB). Keep this page open…`,
      ({ videos: current }) => ({ content: { videos: [video, ...current] }, files, message: `Add video: ${video.title}` }),
      "Video uploaded.",
    );
    if (ok) {
      setFile(null);
      setPreview(undefined);
      setTitle("");
    }
  }

  const remove = (video: Video) => {
    setConfirming(null);
    return save(
      `Deleting “${video.title}”…`,
      ({ videos: current }) => {
        const rest = current.filter((v) => v.id !== video.id);
        const unused = [video.src, video.poster].filter((path): path is string => !!path && !rest.some((v) => v.src === path || v.poster === path));
        return {
          content: { videos: rest },
          files: unused.map((path) => ({ path: `public${path}`, base64: null })),
          message: `Remove video: ${video.title}`,
        };
      },
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
        Paste a YouTube link, or upload a short video file up to {MAX_VIDEO_MB} MB. Films appear in their category and in the
        portfolio, and play right on the page. Long wedding films are best on YouTube.
      </p>

      <form onSubmit={add} noValidate className="mt-6 grid gap-5 rounded-lg border border-border bg-surface p-5 md:grid-cols-[1fr_12rem] md:gap-6">
        <div className="space-y-4">
          <div role="group" aria-label="Where the video comes from" className="flex flex-wrap gap-2">
            {(
              [
                ["youtube", "YouTube link"],
                ["file", "Upload a video file"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={source === value}
                onClick={() => setSource(value)}
                className={cn(
                  "h-9 rounded-full border px-3.5 text-sm transition-colors",
                  source === value ? "border-fg bg-fg text-bg" : "border-border hover:border-border-strong",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          {source === "youtube" ? (
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
          ) : (
            <div>
              <p className="text-sm font-semibold">Video file</p>
              <input
                ref={fileInput}
                id="video-file"
                type="file"
                accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov,.m4v"
                className="sr-only"
                onChange={(e) => chooseFile(e.target.files?.[0])}
              />
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <label
                  htmlFor="video-file"
                  className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-md border border-border-strong px-4 text-sm font-medium transition-colors hover:border-fg focus-within:ring-4 focus-within:ring-fg/10"
                >
                  <Upload aria-hidden className="size-4" /> {file ? "Choose another" : "Choose a video"}
                </label>
                {file && (
                  <span className="text-sm text-muted">
                    {file.name} · {(file.size / 1024 / 1024).toFixed(1)} MB
                  </span>
                )}
              </div>
              {fileError ? (
                <p role="alert" className="mt-2 text-sm text-error">
                  {fileError}
                </p>
              ) : (
                <p className="mt-2 text-sm text-muted">
                  MP4 plays on every phone and browser. Up to {MAX_VIDEO_MB} MB, so about 1 to 3 minutes at 1080p.
                </p>
              )}
            </div>
          )}
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
            {source === "file" ? "Upload video" : "Add video"}
          </Button>
        </div>
        <div aria-hidden className="hidden aspect-video overflow-hidden rounded-md bg-inverse md:block md:self-start">
          {source === "youtube" && youtubeId && (
            // eslint-disable-next-line @next/next/no-img-element -- preview straight from YouTube
            <img src={youtubeThumb(youtubeId)} alt="" className="size-full object-cover" />
          )}
          {source === "file" && preview && <video src={preview} muted playsInline preload="metadata" className="size-full object-cover" />}
        </div>
      </form>

      {videos.length === 0 ? (
        <p className="mt-6 text-sm text-muted">
          No videos yet. Once you add one, a Films section appears on its category page and in the portfolio.
        </p>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map((video) => (
            <li key={video.id} className="overflow-hidden rounded-lg border border-border bg-surface">
              {thumbOf(video, repoRef) ? (
                // eslint-disable-next-line @next/next/no-img-element -- thumbnail from YouTube or the repository
                <img src={thumbOf(video, repoRef)} alt="" loading="lazy" className="aspect-video w-full bg-inverse object-cover" />
              ) : (
                <span aria-hidden className="grid aspect-video w-full place-items-center bg-inverse text-white/70">
                  <Film className="size-8" />
                </span>
              )}
              <div className="space-y-3 p-4">
                <a
                  href={video.youtubeId ? youtubeUrl(video.youtubeId) : video.src ? rawUrl(video.src, repoRef) : undefined}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-start gap-1.5 font-medium leading-snug hover:text-accent"
                >
                  {video.title}
                  <ExternalLink aria-hidden className="mt-1 size-3.5 shrink-0" />
                  <span className="sr-only">{video.youtubeId ? "(opens YouTube)" : "(opens the video file)"}</span>
                </a>
                <p className="text-xs text-muted">{video.youtubeId ? "YouTube" : "Uploaded file"}</p>
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
