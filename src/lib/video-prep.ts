import { toBase64 } from "@/lib/image-prep";

/**
 * Uploaded videos are committed to the repository like photos. GitHub refuses files over 100 MB
 * and warns above 50 MB, and every video makes the site's repository bigger for good, so files
 * are capped well under that. Longer films belong on YouTube.
 */
export const MAX_VIDEO_MB = 50;
const MAX_VIDEO_BYTES = MAX_VIDEO_MB * 1024 * 1024;
const POSTER_WIDTH = 1280;

export const VIDEO_EXTENSIONS = ["mp4", "webm", "mov", "m4v"] as const;
type VideoExt = (typeof VIDEO_EXTENSIONS)[number];

export type PreparedVideo = {
  base64: string;
  ext: VideoExt;
  /** A still frame for the website to show before the video plays, when the browser could read one. */
  poster: { base64: string; ext: "webp" | "jpg" } | null;
};

export const videoExtOf = (file: File): VideoExt | null => {
  const ext = file.name.split(".").pop()?.toLowerCase();
  return (VIDEO_EXTENSIONS as readonly string[]).includes(ext ?? "") ? (ext as VideoExt) : null;
};

/** Why this file cannot be uploaded, or undefined when it can. */
export function videoProblem(file: File): string | undefined {
  if (!videoExtOf(file)) return "Choose an MP4, WebM or MOV video file.";
  if (file.size > MAX_VIDEO_BYTES)
    return `This video is ${(file.size / 1024 / 1024).toFixed(0)} MB. Videos can be up to ${MAX_VIDEO_MB} MB; export a shorter or smaller copy, or put it on YouTube and paste the link instead.`;
  return undefined;
}

const once = (el: HTMLVideoElement, event: string) =>
  new Promise<void>((resolve, reject) => {
    el.addEventListener(event, () => resolve(), { once: true });
    el.addEventListener("error", () => reject(new Error("unreadable")), { once: true });
  });

/** Grabs a frame about a second in. Browsers that cannot decode the file (HEVC in some) return null. */
async function capturePoster(file: File): Promise<PreparedVideo["poster"]> {
  const url = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  try {
    const loaded = once(video, "loadeddata");
    video.src = url;
    await Promise.race([loaded, new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 15_000))]);
    const seeked = once(video, "seeked");
    video.currentTime = Math.min(1, (video.duration || 0) / 4);
    await Promise.race([seeked, new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 10_000))]);
    if (!video.videoWidth) return null;
    const scale = Math.min(1, POSTER_WIDTH / video.videoWidth);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const encode = (type: string) => new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.84));
    let blob = await encode("image/webp");
    let ext: "webp" | "jpg" = "webp";
    if (!blob || blob.type !== "image/webp") {
      blob = await encode("image/jpeg");
      ext = "jpg";
    }
    return blob ? { base64: await toBase64(blob), ext } : null;
  } catch {
    return null;
  } finally {
    video.removeAttribute("src");
    video.load();
    URL.revokeObjectURL(url);
  }
}

/** Reads the file for upload and takes a still frame from it, all in the browser. */
export async function prepareVideo(file: File): Promise<PreparedVideo> {
  const problem = videoProblem(file);
  if (problem) throw new Error(problem);
  const [base64, poster] = await Promise.all([toBase64(file), capturePoster(file)]);
  return { base64, ext: videoExtOf(file)!, poster };
}
