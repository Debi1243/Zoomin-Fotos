import type { Photo, Video } from "@/lib/data";
import type { Settings } from "@/lib/settings";
import type { Pricing } from "@/lib/package-builder";
import type { Testimonial } from "@/lib/testimonials";
import { contentRepo } from "@/lib/site";

/**
 * The few GitHub calls the admin page needs. Each save commits the changed content lists
 * (and any image files) to the repository in one commit; the deploy workflow then rebuilds
 * the site.
 */

const API = "https://api.github.com";
const { owner, repo, branch } = contentRepo;
const REPO = `/repos/${owner}/${repo}`;
export const CONTENT_FILES = {
  photos: "src/content/photos.json",
  videos: "src/content/videos.json",
  settings: "src/content/settings.json",
  pricing: "src/content/pricing.json",
  testimonials: "src/content/testimonials.json",
} as const;
export type Content = { photos: Photo[]; videos: Video[]; settings: Settings; pricing: Pricing; testimonials: Testimonial[] };
type ContentKey = keyof Content;

export class GitHubError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function gh<T>(token: string, path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new GitHubError(body.message ?? res.statusText, res.status);
  }
  return res.json() as Promise<T>;
}

/** Checks the key and that it is allowed to save to the website's repository. */
export async function verifyToken(token: string) {
  const [user, info] = await Promise.all([
    gh<{ login: string }>(token, "/user").catch(() => ({ login: "" })),
    gh<{ permissions?: { push?: boolean } }>(token, REPO),
  ]);
  return { login: user.login, canSave: !!info.permissions?.push };
}

const decodeBase64Utf8 = (b64: string) =>
  new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\s/g, "")), (c) => c.charCodeAt(0)));

async function headSha(token: string) {
  const ref = await gh<{ object: { sha: string } }>(token, `${REPO}/git/ref/heads/${branch}`);
  return ref.object.sha;
}

async function contentAt(token: string, ref: string): Promise<Content> {
  const read = async (path: string, missing: unknown = []) => {
    try {
      const file = await gh<{ content: string }>(token, `${REPO}/contents/${path}?ref=${ref}`);
      return JSON.parse(decodeBase64Utf8(file.content));
    } catch (err) {
      if (err instanceof GitHubError && err.status === 404) return missing;
      throw err;
    }
  };
  const [photos, videos, settings, pricing, testimonials] = await Promise.all([
    read(CONTENT_FILES.photos),
    read(CONTENT_FILES.videos),
    read(CONTENT_FILES.settings, {}),
    read(CONTENT_FILES.pricing, { prices: {}, eventShare: {} }),
    read(CONTENT_FILES.testimonials),
  ]);
  return { photos, videos, settings, pricing, testimonials };
}

/** The photo and video lists and site settings as they are in the repository right now. */
export async function loadContent(token: string) {
  const sha = await headSha(token);
  return { sha, content: await contentAt(token, sha) };
}

export type FileChange = { path: string; base64: string | null };
export type Change = (current: Content) => { content: Partial<Content>; files?: FileChange[]; message: string };

/**
 * Applies `change` to the latest content and commits the result, together with any
 * image files added or removed, as a single commit. If someone else saved in between,
 * it starts again from their version rather than overwriting it.
 */
export async function commitChange(token: string, change: Change, attempt = 0): Promise<{ sha: string; content: Content }> {
  const parent = await headSha(token);
  const [current, parentCommit] = await Promise.all([
    contentAt(token, parent),
    gh<{ tree: { sha: string } }>(token, `${REPO}/git/commits/${parent}`),
  ]);
  const { content, files = [], message } = change(current);

  const blob = (content: string, encoding: "utf-8" | "base64") =>
    gh<{ sha: string }>(token, `${REPO}/git/blobs`, { method: "POST", body: JSON.stringify({ content, encoding }) });

  const entries = await Promise.all([
    ...(Object.keys(content) as ContentKey[]).map(async (key) => ({
      path: CONTENT_FILES[key],
      sha: (await blob(`${JSON.stringify(content[key], null, 2)}\n`, "utf-8")).sha as string | null,
    })),
    ...files.map(async (f) => ({ path: f.path, sha: f.base64 === null ? null : (await blob(f.base64, "base64")).sha })),
  ]);
  const tree = await gh<{ sha: string }>(token, `${REPO}/git/trees`, {
    method: "POST",
    body: JSON.stringify({
      base_tree: parentCommit.tree.sha,
      tree: entries.map((e) => ({ path: e.path, mode: "100644", type: "blob", sha: e.sha })),
    }),
  });
  const commit = await gh<{ sha: string }>(token, `${REPO}/git/commits`, {
    method: "POST",
    body: JSON.stringify({ message, tree: tree.sha, parents: [parent] }),
  });
  try {
    await gh(token, `${REPO}/git/refs/heads/${branch}`, { method: "PATCH", body: JSON.stringify({ sha: commit.sha, force: false }) });
  } catch (err) {
    if (err instanceof GitHubError && err.status === 422 && attempt < 2) return commitChange(token, change, attempt + 1);
    throw err;
  }
  return { sha: commit.sha, content: { ...current, ...content } };
}

/** True once the deploy workflow has published the site built from `sha`. */
export async function isPublished(token: string, sha: string) {
  const pages = await gh<{ commit: { message: string } }>(token, `${REPO}/commits/gh-pages`);
  return pages.commit.message.includes(sha);
}

/** Where to show an image straight from the repository, before the site has redeployed. */
export const rawUrl = (src: string, ref: string) =>
  `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/public${src}`;
