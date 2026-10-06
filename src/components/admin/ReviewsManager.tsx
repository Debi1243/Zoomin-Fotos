"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { CircleAlert, EyeOff, LoaderCircle, LogOut, Pencil, Plus, RefreshCw, Star, Trash2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { control, TextField, TextareaField } from "@/components/forms/Field";
import { explain, readStoredToken, remembered, SignIn, storeToken, type Notice } from "@/components/admin/auth";
import ScriptUpdate from "@/components/admin/ScriptUpdate";
import { commitChange, GitHubError, loadContent, verifyToken } from "@/lib/github";
import { SCRIPT_VERSION } from "@/lib/dashboard-script";
import { callSheet } from "@/lib/sheet";
import { realPhotos } from "@/lib/data";
import { monthLabel, reviewEvents, testimonialSchema, type Testimonial } from "@/lib/testimonials";
import { cn } from "@/lib/cn";

/** A review as it waits in the studio's sheet. */
type SheetReview = Omit<Testimonial, "photoId"> & { received: number; status: string; email: string };

const newId = () => crypto.randomUUID().slice(0, 8);

/**
 * Reviews sent from /testimonials wait here until the studio publishes them. Publishing writes
 * the review to src/content/testimonials.json, which the website rebuilds from.
 */
export default function ReviewsManager() {
  const [token, setToken] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [endpoint, setEndpoint] = useState("");
  const [published, setPublished] = useState<Testimonial[]>([]);
  const [inbox, setInbox] = useState<SheetReview[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outdated, setOutdated] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);
  /** The review open in the editor: one from the sheet, one already published, or a new one. */
  const [editing, setEditing] = useState<{ review: Testimonial; from?: SheetReview } | null>(null);
  const [busy, setBusy] = useState(false);

  const signIn = useCallback(async (key: string, remember: boolean) => {
    setChecking(true);
    setNotice(null);
    try {
      const { canSave } = await verifyToken(key);
      if (!canSave) throw new GitHubError("forbidden", 403);
      const { content } = await loadContent(key);
      storeToken(key, remember);
      setToken(key);
      setEndpoint(content.settings.dataEndpoint ?? "");
      setPublished(content.testimonials);
    } catch (err) {
      storeToken(null, false);
      setToken(null);
      setNotice({ kind: "error", text: explain(err) });
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    const stored = readStoredToken();
    // Restoring a saved session reads browser storage and talks to GitHub, so it waits for mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) void signIn(stored, remembered());
    else setChecking(false);
  }, [signIn]);

  const load = useCallback(async () => {
    if (!token || !endpoint) return;
    setLoading(true);
    setError(null);
    try {
      const result = await callSheet<{ reviews: SheetReview[] }>(endpoint, { type: "reviews", token });
      if (!result.ok) {
        if (result.error === "Unknown request") {
          setOutdated(true);
          setInbox([]);
          return;
        }
        throw new Error(result.error === "not-allowed" ? "The sheet did not accept your access key." : (result.error ?? "The sheet sent an error."));
      }
      setInbox(result.reviews);
      setOutdated((result.version ?? 1) < SCRIPT_VERSION);
    } catch (err) {
      setError(explain(err));
    } finally {
      setLoading(false);
    }
  }, [token, endpoint]);

  useEffect(() => {
    // Fetching from the studio's sheet follows signing in.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function markInSheet(id: string, status: "New" | "Published" | "Hidden") {
    if (!token || !endpoint) return;
    setInbox((list) => list?.map((r) => (r.id === id ? { ...r, status } : r)) ?? null);
    try {
      const result = await callSheet(endpoint, { type: "review-status", token, id, status });
      if (!result.ok) throw new Error(result.error);
    } catch {
      setError("The website saved, but the sheet did not update that review's status. Refresh to try again.");
    }
  }

  async function save(review: Testimonial, message: string, from?: SheetReview) {
    if (!token) return;
    setBusy(true);
    setError(null);
    try {
      const { content } = await commitChange(token, (cur) => {
        const exists = cur.testimonials.some((t) => t.id === review.id);
        return {
          content: { testimonials: exists ? cur.testimonials.map((t) => (t.id === review.id ? review : t)) : [review, ...cur.testimonials] },
          message,
        };
      });
      setPublished(content.testimonials);
      setEditing(null);
      setSaved("Saved. The reviews page updates in about two minutes.");
      if (from) await markInSheet(from.id, "Published");
    } catch (err) {
      setError(explain(err));
    } finally {
      setBusy(false);
    }
  }

  async function remove(t: Testimonial) {
    if (!token || !confirm(`Take ${t.name}'s review off the website?`)) return;
    setBusy(true);
    setError(null);
    try {
      const { content } = await commitChange(token, (cur) => ({
        content: { testimonials: cur.testimonials.filter((x) => x.id !== t.id) },
        message: `Remove the review from ${t.name}`,
      }));
      setPublished(content.testimonials);
      setSaved("Removed. The reviews page updates in about two minutes.");
      if (inbox?.some((r) => r.id === t.id)) await markInSheet(t.id, "Hidden");
    } catch (err) {
      setError(explain(err));
    } finally {
      setBusy(false);
    }
  }

  if (checking) {
    return (
      <p className="flex items-center gap-2 text-muted" role="status">
        <LoaderCircle aria-hidden className="size-4 animate-spin" /> Checking your sign-in…
      </p>
    );
  }
  if (!token) return <SignIn onSignIn={signIn} notice={notice} />;

  const signOut = () => {
    storeToken(null, false);
    setToken(null);
    setInbox(null);
  };

  const waiting = inbox?.filter((r) => r.status === "New") ?? [];
  const hidden = inbox?.filter((r) => r.status === "Hidden") ?? [];

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setEditing({ review: { id: newId(), name: "", event: "Wedding", date: "", rating: 5, text: "" } })}>
            <Plus aria-hidden className="size-4" /> Add a review
          </Button>
          {endpoint && (
            <button type="button" onClick={() => void load()} disabled={loading} className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm text-muted hover:text-fg">
              <RefreshCw aria-hidden className={cn("size-4", loading && "animate-spin")} /> Refresh
            </button>
          )}
        </div>
        <button type="button" onClick={signOut} className="inline-flex items-center gap-2 text-sm font-medium hover:text-accent">
          <LogOut aria-hidden className="size-4" /> Sign out
        </button>
      </div>

      {error && (
        <p role="alert" className="flex items-start gap-2 rounded-md border border-error/40 p-4 text-sm text-error">
          <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" /> {error}
        </p>
      )}
      {saved && !error && (
        <p role="status" className="rounded-md border border-success/40 p-4 text-sm">
          {saved}
        </p>
      )}

      {editing && (
        <Editor
          key={editing.review.id}
          initial={editing.review}
          from={editing.from}
          busy={busy}
          onCancel={() => setEditing(null)}
          onSave={(review) =>
            void save(
              review,
              editing.from ? `Publish the review from ${review.name}` : published.some((t) => t.id === review.id) ? `Edit the review from ${review.name}` : `Add a review from ${review.name}`,
              editing.from,
            )
          }
        />
      )}

      {!endpoint ? (
        <p className="max-w-[60ch] rounded-lg border border-border bg-surface p-5 text-sm leading-relaxed text-muted">
          Clients can send reviews from the website once your Google Sheet is connected on the{" "}
          <a href="../dashboard/" className="link-underline text-fg">Dashboard</a> tab. Until then the reviews page asks them to email you, and you can add those here with <b>Add a review</b>.
        </p>
      ) : outdated ? (
        <ScriptUpdate reason="A newer version of the sheet script collects reviews from your website." onDone={() => void load()} />
      ) : (
        <section aria-labelledby="waiting-title">
          <h2 id="waiting-title" className="font-display text-2xl">
            Waiting for you {inbox && <span className="tabular text-muted">({waiting.length})</span>}
          </h2>
          {!inbox && loading ? (
            <p className="mt-4 flex items-center gap-2 text-muted" role="status">
              <LoaderCircle aria-hidden className="size-4 animate-spin" /> Loading reviews…
            </p>
          ) : waiting.length === 0 ? (
            <p className="mt-4 text-sm text-muted">No new reviews. When a client sends one from the reviews page, it shows up here and you get an email.</p>
          ) : (
            <ul className="mt-5 grid gap-4 md:grid-cols-2">
              {waiting.map((r) => (
                <li key={r.id}>
                  <ReviewCard review={r} meta={`Sent ${new Date(r.received).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}${r.email ? ` · ${r.email}` : ""}`}>
                    <Button disabled={busy} onClick={() => setEditing({ review: { id: r.id, name: r.name, event: r.event, date: r.date, rating: r.rating, text: r.text }, from: r })}>
                      Review and publish
                    </Button>
                    <button type="button" disabled={busy} onClick={() => void markInSheet(r.id, "Hidden")} className="inline-flex h-9 items-center gap-1.5 px-2 text-sm text-muted hover:text-fg">
                      <EyeOff aria-hidden className="size-4" /> Don&apos;t publish
                    </button>
                  </ReviewCard>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <section aria-labelledby="live-title">
        <h2 id="live-title" className="font-display text-2xl">
          On the website <span className="tabular text-muted">({published.length})</span>
        </h2>
        {published.length === 0 ? (
          <p className="mt-4 text-sm text-muted">Nothing published yet. The reviews page shows a short note until you publish the first review.</p>
        ) : (
          <ul className="mt-5 grid gap-4 md:grid-cols-2">
            {published.map((t) => (
              <li key={t.id}>
                <ReviewCard review={t} meta={t.photoId ? `Photo: ${realPhotos.find((p) => p.id === t.photoId)?.title ?? t.photoId}` : undefined}>
                  <button type="button" disabled={busy} onClick={() => setEditing({ review: t })} className="inline-flex h-9 items-center gap-1.5 px-2 text-sm hover:text-accent">
                    <Pencil aria-hidden className="size-4" /> Edit
                  </button>
                  <button type="button" disabled={busy} onClick={() => void remove(t)} className="inline-flex h-9 items-center gap-1.5 px-2 text-sm text-muted hover:text-error">
                    <Trash2 aria-hidden className="size-4" /> Remove
                  </button>
                </ReviewCard>
              </li>
            ))}
          </ul>
        )}
      </section>

      {hidden.length > 0 && (
        <details className="group">
          <summary className="cursor-pointer text-sm text-muted hover:text-fg">Not published ({hidden.length})</summary>
          <ul className="mt-5 grid gap-4 md:grid-cols-2">
            {hidden.map((r) => (
              <li key={r.id}>
                <ReviewCard review={r} muted>
                  <button type="button" disabled={busy} onClick={() => void markInSheet(r.id, "New")} className="inline-flex h-9 items-center gap-1.5 px-2 text-sm hover:text-accent">
                    <Undo2 aria-hidden className="size-4" /> Move back to waiting
                  </button>
                </ReviewCard>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

function ReviewCard({ review, meta, muted, children }: { review: Omit<Testimonial, "photoId">; meta?: string; muted?: boolean; children: React.ReactNode }) {
  return (
    <article className={cn("flex h-full flex-col rounded-lg border border-border bg-surface p-5", muted && "opacity-70")}>
      <div className="flex items-center justify-between gap-3">
        <span role="img" aria-label={`${review.rating} out of 5 stars`}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} aria-hidden className={cn("inline size-4", i <= review.rating ? "fill-[var(--marigold-glow)] text-[var(--marigold-glow)]" : "text-border-strong")} />
          ))}
        </span>
        <span className="truncate text-xs text-muted">{[review.event, monthLabel(review.date), "source" in review && review.source === "google" && "Google"].filter(Boolean).join(" · ")}</span>
      </div>
      <p className="mt-3 line-clamp-6 whitespace-pre-line text-sm leading-relaxed">{review.text}</p>
      <p className="mt-3 text-sm font-medium">{review.name}</p>
      {meta && <p className="truncate text-xs text-muted">{meta}</p>}
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">{children}</div>
    </article>
  );
}

function Editor({
  initial,
  from,
  busy,
  onSave,
  onCancel,
}: {
  initial: Testimonial;
  from?: SheetReview;
  busy: boolean;
  onSave: (t: Testimonial) => void;
  onCancel: () => void;
}) {
  const [t, setT] = useState(initial);
  const [problem, setProblem] = useState<string | null>(null);
  const set = <K extends keyof Testimonial>(k: K, v: Testimonial[K]) => setT((cur) => ({ ...cur, [k]: v }));
  const events: string[] = reviewEvents.includes(t.event as (typeof reviewEvents)[number]) || !t.event ? [...reviewEvents] : [t.event, ...reviewEvents];

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = testimonialSchema.safeParse({ ...t, name: t.name.trim(), text: t.text.trim(), photoId: t.photoId || undefined });
    if (!parsed.success) {
      setProblem("Please fill in the name, a rating and the review.");
      return;
    }
    onSave(parsed.data);
  };

  return (
    <form onSubmit={submit} aria-labelledby="editor-title" className="space-y-6 rounded-lg border border-border-strong bg-surface p-5 sm:p-8">
      <div>
        <h2 id="editor-title" className="font-display text-2xl">
          {from ? "Publish this review" : initial.name ? "Edit review" : "Add a review"}
        </h2>
        <p className="mt-1 text-sm text-muted">
          {from
            ? "Fix a typo if you need to, but keep the client's words. Choose a photo from their shoot to show beside it."
            : "Only add reviews clients really wrote, for example on WhatsApp or Google, with their permission."}
        </p>
      </div>
      <fieldset>
        <legend className="text-sm font-medium">Rating</legend>
        <div className="mt-2 flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="cursor-pointer">
              <input type="radio" name="edit-rating" checked={t.rating === n} onChange={() => set("rating", n)} className="peer sr-only" />
              <span className="sr-only">{n} stars</span>
              <Star aria-hidden className={cn("size-8 rounded peer-focus-visible:ring-2 peer-focus-visible:ring-fg", n <= t.rating ? "fill-[var(--marigold-glow)] text-[var(--marigold-glow)]" : "text-border-strong")} />
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-6 sm:grid-cols-3">
        <TextField id="edit-name" label="Name shown" value={t.name} maxLength={120} onChange={(e) => set("name", e.target.value)} />
        <div>
          <label htmlFor="edit-event" className="text-sm font-medium">
            Shoot
          </label>
          <select id="edit-event" value={t.event} onChange={(e) => set("event", e.target.value)} className={cn(control, "mt-2 h-12 border-border")}>
            {events.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
        <TextField id="edit-date" label="When" type="month" optional value={t.date} onChange={(e) => set("date", e.target.value)} />
      </div>
      {!from && (
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" checked={t.source === "google"} onChange={(e) => set("source", e.target.checked ? "google" : undefined)} className="size-4 accent-[var(--fg)]" />
          Copied from your Google reviews (shows &ldquo;on Google&rdquo; beside it)
        </label>
      )}
      <TextareaField id="edit-text" label="Review" rows={6} maxLength={2000} value={t.text} onChange={(e) => set("text", e.target.value)} />
      <div>
        <label htmlFor="edit-photo" className="text-sm font-medium">
          Photo beside the review <span className="font-normal text-muted">(optional)</span>
        </label>
        <select id="edit-photo" value={t.photoId ?? ""} onChange={(e) => set("photoId", e.target.value || undefined)} className={cn(control, "mt-2 h-12 border-border")}>
          <option value="">No photo</option>
          {realPhotos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title} ({p.id})
            </option>
          ))}
        </select>
      </div>
      {problem && (
        <p role="alert" className="flex items-start gap-2 text-sm text-error">
          <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" /> {problem}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" loading={busy} loadingLabel="Saving…">
          {from ? "Publish" : "Save"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
