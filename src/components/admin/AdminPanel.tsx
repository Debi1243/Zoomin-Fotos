"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { CircleAlert, CircleCheck, ImagePlus, LoaderCircle, LogOut, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/forms/Field";
import { cn } from "@/lib/cn";
import { services, type Photo, type ServiceSlug, type Tone, type Video } from "@/lib/data";
import { commitChange, GitHubError, isPublished, loadContent, rawUrl, verifyToken, type Change } from "@/lib/github";
import VideoManager from "@/components/admin/VideoManager";
import { CategorySelect, categoryName } from "@/components/admin/CategorySelect";
import { prepareImage, slugify, titleFromFileName } from "@/lib/image-prep";

const TOKEN_KEY = "zf-admin-token";
const DEFAULT_PLACE = "Odisha";

const defaultTone: Record<ServiceSlug, Tone> = {
  weddings: "amber",
  "pre-wedding": "rose",
  portraits: "rose",
  "maternity-newborn": "rose",
  events: "ink",
  commercial: "amber",
};


type Pending = { key: string; file: File; preview: string; title: string; category: ServiceSlug; place: string };
type Notice = { kind: "error" | "success" | "info"; text: string };
type Publish = { sha: string; state: "waiting" | "live" | "slow" };

function readStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function remembered() {
  try {
    return localStorage.getItem(TOKEN_KEY) !== null;
  } catch {
    return false;
  }
}

function storeToken(token: string | null, remember: boolean) {
  try {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    if (token) (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, token);
  } catch {
    // Private browsing: the key lasts until the page is closed.
  }
}

function explain(err: unknown) {
  if (err instanceof GitHubError) {
    if (err.status === 401) return "That access key was not accepted. It may have expired; create a new one and sign in again.";
    if (err.status === 403 || err.status === 404)
      return "This access key cannot change the website. Check it has Contents: Read and write access to the Zoomin-Fotos repository.";
    return `GitHub said: ${err.message}`;
  }
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}

const nextId = (list: Photo[]) => String(Math.max(18, ...list.map((p) => Number(p.id)).filter(Number.isFinite)) + 1).padStart(2, "0");

export default function AdminPanel() {
  const [token, setToken] = useState<string | null>(null);
  const [login, setLogin] = useState("");
  const [checking, setChecking] = useState(true);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [ref, setRef] = useState("main");
  const [pending, setPending] = useState<Pending[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [publish, setPublish] = useState<Publish | null>(null);
  const [filter, setFilter] = useState<ServiceSlug | "all">("all");
  const [confirming, setConfirming] = useState<string | null>(null);
  const [batchCategory, setBatchCategory] = useState<ServiceSlug>("weddings");
  const fileInput = useRef<HTMLInputElement>(null);

  const signIn = useCallback(async (key: string, remember: boolean) => {
    setChecking(true);
    setNotice(null);
    try {
      const { login, canSave } = await verifyToken(key);
      if (!canSave) throw new GitHubError("forbidden", 403);
      const { sha, content } = await loadContent(key);
      storeToken(key, remember);
      setToken(key);
      setLogin(login);
      setPhotos(content.photos);
      setVideos(content.videos);
      setRef(sha);
    } catch (err) {
      storeToken(null, false);
      setToken(null);
      setNotice({ kind: "error", text: explain(err) });
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    const saved = readStoredToken();
    // Restoring a saved session reads browser storage and talks to GitHub, so it waits for mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) void signIn(saved, remembered());
    else setChecking(false);
  }, [signIn]);

  // Watch for the redeploy that carries the latest save.
  useEffect(() => {
    if (!token || !publish || publish.state === "live") return;
    const started = Date.now();
    const timer = setInterval(async () => {
      try {
        if (await isPublished(token, publish.sha)) {
          setPublish({ ...publish, state: "live" });
          clearInterval(timer);
        } else if (Date.now() - started > 6 * 60_000) {
          setPublish({ ...publish, state: "slow" });
          clearInterval(timer);
        }
      } catch {
        // A missed check is harmless; the next one will catch up.
      }
    }, 10_000);
    return () => clearInterval(timer);
  }, [token, publish]);

  // Free the in-memory previews of files that leave the upload list.
  const previews = useRef(new Set<string>());
  useEffect(() => {
    const live = new Set(pending.map((p) => p.preview));
    previews.current.forEach((url) => !live.has(url) && URL.revokeObjectURL(url));
    previews.current = live;
  }, [pending]);
  useEffect(() => () => previews.current.forEach((url) => URL.revokeObjectURL(url)), []);

  function signOut() {
    storeToken(null, false);
    setToken(null);
    setLogin("");
    setPhotos([]);
    setVideos([]);
    setPublish(null);
    setNotice(null);
  }

  async function save(label: string, change: Change, done: string) {
    if (!token) return false;
    setBusy(label);
    setNotice(null);
    try {
      const result = await commitChange(token, change);
      setPhotos(result.content.photos);
      setVideos(result.content.videos);
      setRef(result.sha);
      setPublish({ sha: result.sha, state: "waiting" });
      setNotice({ kind: "success", text: done });
      return true;
    } catch (err) {
      setNotice({ kind: "error", text: explain(err) });
      return false;
    } finally {
      setBusy(null);
    }
  }

  function addFiles(files: FileList | null) {
    if (!files?.length) return;
    const added = Array.from(files)
      .filter((f) => f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name))
      .map((file) => ({
        key: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
        title: titleFromFileName(file.name),
        category: batchCategory,
        place: DEFAULT_PLACE,
      }));
    setPending((list) => [...list, ...added]);
    if (fileInput.current) fileInput.current.value = "";
  }

  const updatePending = (key: string, patch: Partial<Pending>) =>
    setPending((list) => list.map((p) => (p.key === key ? { ...p, ...patch } : p)));

  async function upload(e: FormEvent) {
    e.preventDefault();
    if (pending.some((p) => !p.title.trim())) {
      setNotice({ kind: "error", text: "Give every photo a title. It appears as the caption on the website." });
      return;
    }
    setBusy(`Preparing ${pending.length === 1 ? "the photo" : `${pending.length} photos`}…`);
    let prepared;
    try {
      prepared = await Promise.all(pending.map(async (p) => ({ ...p, image: await prepareImage(p.file) })));
    } catch (err) {
      setBusy(null);
      setNotice({ kind: "error", text: `${explain(err)} Try saving the photo as a JPG first.` });
      return;
    }
    const count = prepared.length;
    const ok = await save(
      count === 1 ? "Uploading the photo…" : `Uploading ${count} photos…`,
      ({ photos: current }) => {
        let id = Number(nextId(current));
        const entries = prepared.map((p) => {
          const pid = String(id++).padStart(2, "0");
          const src = `/photos/${p.category}-${slugify(p.title) || "photo"}-${pid}.${p.image.ext}`;
          const photo: Photo = {
            id: pid,
            category: p.category,
            title: p.title.trim(),
            place: p.place.trim() || DEFAULT_PLACE,
            aspect: p.image.aspect,
            tone: defaultTone[p.category],
            src,
          };
          return { photo, file: { path: `public${src}`, base64: p.image.base64 } };
        });
        return {
          content: { photos: [...entries.map((e) => e.photo), ...current] },
          files: entries.map((e) => e.file),
          message: count === 1 ? `Add photo: ${entries[0].photo.title}` : `Add ${count} photos`,
        };
      },
      count === 1 ? "Photo uploaded." : `${count} photos uploaded.`,
    );
    if (ok) setPending([]);
  }

  async function remove(photo: Photo) {
    setConfirming(null);
    await save(
      `Deleting “${photo.title}”…`,
      ({ photos: current }) => {
        const photos = current.filter((p) => p.id !== photo.id);
        const stillUsed = photos.some((p) => p.src === photo.src);
        return {
          content: { photos },
          files: photo.src && !stillUsed ? [{ path: `public${photo.src}`, base64: null }] : [],
          message: `Remove photo: ${photo.title}`,
        };
      },
      `“${photo.title}” deleted.`,
    );
  }

  async function move(photo: Photo, category: ServiceSlug) {
    await save(
      `Moving “${photo.title}”…`,
      ({ photos: current }) => ({
        content: { photos: current.map((p) => (p.id === photo.id ? { ...p, category } : p)) },
        message: `Move photo to ${categoryName(category)}: ${photo.title}`,
      }),
      `“${photo.title}” moved to ${categoryName(category)}.`,
    );
  }

  if (checking) {
    return (
      <p className="flex items-center gap-2 text-muted" role="status">
        <LoaderCircle aria-hidden className="size-4 animate-spin" /> Checking your sign-in…
      </p>
    );
  }

  if (!token) return <SignIn onSignIn={signIn} notice={notice} />;

  const shown = filter === "all" ? photos : photos.filter((p) => p.category === filter);

  return (
    <div className="space-y-14">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <p className="text-sm text-muted">
          Signed in{login && <> as <span className="font-medium text-fg">{login}</span></>}. Changes go live about two minutes after
          you save.
        </p>
        <button type="button" onClick={signOut} className="inline-flex items-center gap-2 text-sm font-medium hover:text-accent">
          <LogOut aria-hidden className="size-4" /> Sign out
        </button>
      </div>

      <div aria-live="polite" className="space-y-3 empty:hidden">
        {busy && (
          <p className="flex items-center gap-2 rounded-md border border-border bg-surface p-4 text-sm">
            <LoaderCircle aria-hidden className="size-4 animate-spin" /> {busy}
          </p>
        )}
        {notice && !busy && <NoticeLine notice={notice} onClose={() => setNotice(null)} />}
        {publish && !busy && <PublishLine publish={publish} />}
      </div>

      <section aria-labelledby="upload-title">
        <h2 id="upload-title" className="font-display text-h3">
          Upload photos
        </h2>
        <p className="mt-2 max-w-[60ch] text-sm text-muted">
          Photos are resized for the web in your browser before uploading, so large camera files are fine. New photos appear first in
          their category.
        </p>

        <div className="mt-6 flex flex-wrap items-end gap-4">
          <div>
            <label htmlFor="batch-category" className="text-sm font-medium">
              Category for new photos
            </label>
            <CategorySelect id="batch-category" value={batchCategory} onChange={setBatchCategory} className="mt-2 w-60" />
          </div>
          <input
            ref={fileInput}
            id="photo-files"
            type="file"
            accept="image/*,.heic,.heif"
            multiple
            className="sr-only"
            onChange={(e) => addFiles(e.target.files)}
          />
          <label
            htmlFor="photo-files"
            className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-md border border-border-strong px-4 text-sm font-medium transition-colors hover:border-fg focus-within:ring-4 focus-within:ring-fg/10"
          >
            <ImagePlus aria-hidden className="size-4" /> Choose photos
          </label>
        </div>

        {pending.length > 0 && (
          <form onSubmit={upload} className="mt-8 space-y-4">
            <ul className="grid gap-4 md:grid-cols-2">
              {pending.map((p) => (
                <li key={p.key} className="flex gap-4 rounded-lg border border-border bg-surface p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element -- local preview of a file not yet uploaded */}
                  <img src={p.preview} alt="" className="size-28 shrink-0 rounded-sm object-cover sm:size-32" />
                  <div className="min-w-0 flex-1 space-y-3">
                    <TextField
                      id={`title-${p.key}`}
                      label="Title"
                      value={p.title}
                      placeholder="e.g. Haldi, a shower of petals"
                      onChange={(e) => updatePending(p.key, { title: e.target.value })}
                      required
                      className="h-10"
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label htmlFor={`cat-${p.key}`} className="text-sm font-medium">
                          Category
                        </label>
                        <CategorySelect
                          id={`cat-${p.key}`}
                          value={p.category}
                          onChange={(category) => updatePending(p.key, { category })}
                          className="mt-2"
                        />
                      </div>
                      <TextField
                        id={`place-${p.key}`}
                        label="Place"
                        value={p.place}
                        onChange={(e) => updatePending(p.key, { place: e.target.value })}
                        className="h-10"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPending((list) => list.filter((x) => x.key !== p.key))}
                    className="self-start rounded-md p-1 text-muted hover:text-fg"
                    aria-label={`Remove ${p.title || p.file.name} from the upload`}
                  >
                    <X aria-hidden className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit" loading={!!busy} loadingLabel="Uploading…">
                Upload {pending.length === 1 ? "photo" : `${pending.length} photos`}
              </Button>
              <button type="button" className="text-sm text-muted hover:text-fg" onClick={() => setPending([])} disabled={!!busy}>
                Clear
              </button>
            </div>
          </form>
        )}
      </section>

      <VideoManager videos={videos} busy={!!busy} save={save} />

      <section aria-labelledby="library-title">
        <h2 id="library-title" className="font-display text-h3">
          Photos on the website
        </h2>
        <div role="group" aria-label="Show category" className="mt-5 flex flex-wrap gap-2">
          {(["all", ...services.map((s) => s.slug)] as const).map((slug) => {
            const count = slug === "all" ? photos.length : photos.filter((p) => p.category === slug).length;
            return (
              <button
                key={slug}
                type="button"
                aria-pressed={filter === slug}
                onClick={() => setFilter(slug)}
                className={cn(
                  "h-9 rounded-full border px-3.5 text-sm transition-colors",
                  filter === slug ? "border-fg bg-fg text-bg" : "border-border hover:border-border-strong",
                )}
              >
                {slug === "all" ? "All" : categoryName(slug)} <span className="tabular opacity-70">{count}</span>
              </button>
            );
          })}
        </div>

        {shown.length === 0 ? (
          <p className="mt-8 text-sm text-muted">No photos in this category yet. The website shows sample frames there until you add some.</p>
        ) : (
          <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {shown.map((photo) => (
              <li key={photo.id} className="overflow-hidden rounded-lg border border-border bg-surface">
                {/* eslint-disable-next-line @next/next/no-img-element -- served from the repository so new uploads show before the redeploy */}
                <img
                  src={photo.src ? rawUrl(photo.src, ref) : undefined}
                  alt={photo.title}
                  loading="lazy"
                  className="aspect-[4/3] w-full bg-inverse object-cover"
                />
                <div className="space-y-3 p-4">
                  <div>
                    <p className="font-medium leading-snug">{photo.title}</p>
                    <p className="text-sm text-muted">{photo.place}</p>
                  </div>
                  <div>
                    <label htmlFor={`move-${photo.id}`} className="sr-only">
                      Category for {photo.title}
                    </label>
                    <CategorySelect
                      id={`move-${photo.id}`}
                      value={photo.category}
                      onChange={(category) => category !== photo.category && void move(photo, category)}
                      disabled={!!busy}
                    />
                  </div>
                  {confirming === photo.id ? (
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => void remove(photo)}
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
                      onClick={() => setConfirming(photo.id)}
                      disabled={!!busy}
                      className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-error disabled:opacity-50"
                      aria-label={`Delete ${photo.title}`}
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
    </div>
  );
}

function NoticeLine({ notice, onClose }: { notice: Notice; onClose: () => void }) {
  const Icon = notice.kind === "error" ? CircleAlert : CircleCheck;
  return (
    <p
      role={notice.kind === "error" ? "alert" : undefined}
      className={cn(
        "flex items-start gap-2 rounded-md border p-4 text-sm",
        notice.kind === "error" ? "border-error/40 text-error" : "border-success/40",
      )}
    >
      <Icon aria-hidden className={cn("mt-0.5 size-4 shrink-0", notice.kind !== "error" && "text-success")} />
      <span className="flex-1">{notice.text}</span>
      <button type="button" onClick={onClose} aria-label="Dismiss" className="text-muted hover:text-fg">
        <X aria-hidden className="size-4" />
      </button>
    </p>
  );
}

function PublishLine({ publish }: { publish: Publish }) {
  if (publish.state === "live")
    return (
      <p className="flex items-center gap-2 text-sm text-muted">
        <CircleCheck aria-hidden className="size-4 text-success" /> The website is up to date.
      </p>
    );
  if (publish.state === "slow")
    return (
      <p className="flex items-center gap-2 text-sm text-muted">
        <CircleAlert aria-hidden className="size-4" /> The website is taking longer than usual to update. Your change is saved and
        will appear once it finishes.
      </p>
    );
  return (
    <p className="flex items-center gap-2 text-sm text-muted">
      <LoaderCircle aria-hidden className="size-4 animate-spin" /> Updating the website. This usually takes about two minutes.
    </p>
  );
}

function SignIn({ onSignIn, notice }: { onSignIn: (token: string, remember: boolean) => void; notice: Notice | null }) {
  const [key, setKey] = useState("");
  const [remember, setRemember] = useState(true);
  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-10">
      <form
        className="space-y-5 lg:col-span-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (key.trim()) onSignIn(key.trim(), remember);
        }}
      >
        <TextField
          id="admin-key"
          label="Access key"
          type="password"
          autoComplete="current-password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          error={notice?.kind === "error" ? notice.text : undefined}
          hint="Your GitHub access key for the website. It stays on this device and is only sent to GitHub."
          required
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="size-4 accent-[var(--rani)]" />
          Keep me signed in on this device
        </label>
        <Button type="submit">Sign in</Button>
      </form>

      <div className="rounded-lg border border-border bg-surface p-6 text-sm leading-relaxed lg:col-span-6 lg:col-start-7">
        <h2 className="font-medium">Getting an access key (one time)</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-muted">
          <li>
            Sign in to GitHub and open{" "}
            <a
              className="text-fg underline underline-offset-2"
              href="https://github.com/settings/personal-access-tokens/new"
              target="_blank"
              rel="noreferrer"
            >
              new fine-grained token
            </a>
            .
          </li>
          <li>Name it “Zoomin Fotos admin” and pick an expiry date.</li>
          <li>
            Under <span className="text-fg">Repository access</span>, choose <span className="text-fg">Only select repositories</span> and
            pick <span className="text-fg">Zoomin-Fotos</span>.
          </li>
          <li>
            Under <span className="text-fg">Permissions</span>, set <span className="text-fg">Contents</span> to{" "}
            <span className="text-fg">Read and write</span>.
          </li>
          <li>Generate the token, copy it, and paste it here.</li>
        </ol>
      </div>
    </div>
  );
}
