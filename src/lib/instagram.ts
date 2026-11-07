/**
 * Instagram handles tagged on a photo or film. Instagram usernames are 1 to 30
 * characters of letters, numbers, full stops and underscores, never starting or
 * ending with a full stop and never with two in a row. Stored without the "@",
 * in lower case, because Instagram treats usernames as case-insensitive.
 */
export const HANDLE_PATTERN = /^(?!.*\.\.)(?!\.)(?!.*\.$)[a-z0-9._]{1,30}$/;

export const MAX_TAGS = 10;

/** Accepts "@name", "name", or a pasted instagram.com/name link, and returns "name". */
export function normaliseHandle(raw: string): string {
  let text = raw.trim();
  const link = text.match(/instagram\.com\/([^/?#\s]+)/i);
  if (link) text = link[1];
  return text.replace(/^@+/, "").toLowerCase();
}

/**
 * Reads a list of handles typed into one field, split by commas, spaces or new lines.
 * Returns the cleaned handles (duplicates dropped) and any entries that are not valid.
 */
export function parseHandles(text: string): { handles: string[]; invalid: string[] } {
  const handles: string[] = [];
  const invalid: string[] = [];
  for (const part of text.split(/[\s,]+/)) {
    if (!part) continue;
    const handle = normaliseHandle(part);
    if (!handle) continue;
    if (!HANDLE_PATTERN.test(handle)) invalid.push(part);
    else if (!handles.includes(handle)) handles.push(handle);
  }
  return { handles, invalid };
}

/** The problem with a typed list of handles, in plain words, or undefined when it is fine. */
export function handlesProblem(text: string): string | undefined {
  const { handles, invalid } = parseHandles(text);
  if (invalid.length)
    return `${invalid.map((h) => `“${h}”`).join(", ")} ${invalid.length === 1 ? "is not a valid Instagram username" : "are not valid Instagram usernames"}. Use letters, numbers, full stops and underscores, up to 30 characters.`;
  if (handles.length > MAX_TAGS) return `Tag up to ${MAX_TAGS} people.`;
  return undefined;
}

/** Shows stored handles back in a text field, e.g. "@ananya, @rohit". */
export const formatHandles = (handles: string[] = []) => handles.map((h) => `@${h}`).join(", ");

export const instagramUrl = (handle: string) => `https://www.instagram.com/${handle}/`;
