import type { Aspect } from "@/lib/data";

/** Same treatment as the photos already on the site: at most 2000px wide, WebP at quality 86. */
const MAX_WIDTH = 2000;
const QUALITY = 0.86;

export type PreparedImage = { base64: string; ext: "webp" | "jpg"; width: number; height: number; aspect: Aspect; bytes: number };

async function decode(file: File): Promise<CanvasImageSource & { width: number; height: number }> {
  try {
    return await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    // Some browsers only decode certain formats (HEIC on Safari, for one) through <img>.
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      return Object.assign(img, { width: img.naturalWidth, height: img.naturalHeight });
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}

const toBlob = (canvas: HTMLCanvasElement, type: string) =>
  new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, QUALITY));

const toBase64 = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

export function aspectOf(width: number, height: number): Aspect {
  const ratio = width / height;
  return ratio > 1.15 ? "landscape" : ratio < 0.87 ? "portrait" : "square";
}

/** Resizes and re-encodes a photo in the browser, so only a web-sized file is uploaded. */
export async function prepareImage(file: File): Promise<PreparedImage> {
  const source = await decode(file);
  const scale = Math.min(1, MAX_WIDTH / source.width);
  const width = Math.round(source.width * scale);
  const height = Math.round(source.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("This browser cannot process images.");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, width, height);
  if ("close" in source && typeof source.close === "function") source.close();

  // Browsers that cannot encode WebP hand back PNG; JPEG keeps those files small.
  let blob = await toBlob(canvas, "image/webp");
  let ext: PreparedImage["ext"] = "webp";
  if (!blob || blob.type !== "image/webp") {
    blob = await toBlob(canvas, "image/jpeg");
    ext = "jpg";
  }
  if (!blob) throw new Error("This photo could not be converted.");
  return { base64: await toBase64(blob), ext, width, height, aspect: aspectOf(width, height), bytes: blob.size };
}

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

/** A readable starting title from a file name such as "haldi_ceremony-02.jpg". */
export function titleFromFileName(name: string) {
  const base = name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim();
  if (!base || /^(img|dsc|pxl|image|photo)?\s*[\d\s]+$/i.test(base) || /^[0-9a-f-]{20,}$/i.test(base.replace(/\s/g, "-"))) return "";
  return base.charAt(0).toUpperCase() + base.slice(1);
}
