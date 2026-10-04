/** YouTube video ids are 11 characters of letters, digits, "-" and "_". */
const ID = /^[A-Za-z0-9_-]{11}$/;

/** The video id from any usual YouTube link (watch, youtu.be, shorts, embed, live) or a bare id. */
export function parseYouTubeId(input: string): string | null {
  const text = input.trim();
  if (ID.test(text)) return text;
  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(www\.|m\.|music\.)/, "");
  let id: string | null = null;
  if (host === "youtu.be") id = url.pathname.split("/")[1] ?? null;
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    id = url.searchParams.get("v");
    const [, kind, rest] = url.pathname.split("/");
    if (!id && ["shorts", "embed", "live", "v"].includes(kind)) id = rest ?? null;
  }
  return id && ID.test(id) ? id : null;
}

export const youtubeUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
export const youtubeThumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
