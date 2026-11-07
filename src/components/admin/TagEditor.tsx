"use client";

import { useState, type FormEvent } from "react";
import { InstagramLogoIcon as Instagram } from "@phosphor-icons/react/dist/ssr";
import { TextField } from "@/components/forms/Field";
import { formatHandles, handlesProblem, instagramUrl, parseHandles } from "@/lib/instagram";

export const TAGS_HINT = "Instagram usernames, separated by commas, e.g. @ananya, @rohit.";

/** The optional "Tag on Instagram" field used when adding a photo or video. */
export function TagsField({
  id,
  value,
  onChange,
  error,
  className,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}) {
  return (
    <TextField
      id={id}
      label="Tag on Instagram"
      optional
      value={value}
      placeholder="@ananya, @rohit"
      autoCapitalize="none"
      autoCorrect="off"
      spellCheck={false}
      onChange={(e) => onChange(e.target.value)}
      error={error}
      hint={TAGS_HINT}
      className={className}
    />
  );
}

/**
 * Shows the people tagged on a photo or video in the library and lets the owner change
 * them. `onSave` receives the cleaned list (empty to remove every tag).
 */
export function TagEditor({
  id,
  title,
  tagged = [],
  busy,
  onSave,
}: {
  id: string;
  title: string;
  tagged?: string[];
  busy: boolean;
  onSave: (handles: string[]) => Promise<boolean>;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState<string>();

  function start() {
    setText(formatHandles(tagged));
    setError(undefined);
    setEditing(true);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    const problem = handlesProblem(text);
    setError(problem);
    if (problem) return;
    if (await onSave(parseHandles(text).handles)) setEditing(false);
  }

  if (editing)
    return (
      <form onSubmit={submit} noValidate className="space-y-3">
        <TagsField id={`tags-${id}`} value={text} onChange={(v) => (setText(v), setError(undefined))} error={error} className="h-11" />
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={busy}
            className="inline-flex min-h-11 items-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-fg hover:bg-primary-hover disabled:opacity-50"
          >
            Save tags
          </button>
          <button type="button" onClick={() => setEditing(false)} className="min-h-11 px-1 text-sm text-muted hover:text-fg">
            Cancel
          </button>
        </div>
      </form>
    );

  return (
    <div className="space-y-2">
      {tagged.length > 0 && (
        <ul aria-label={`Tagged on ${title}`} className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
          {tagged.map((handle) => (
            <li key={handle}>
              <a href={instagramUrl(handle)} target="_blank" rel="noopener noreferrer" className="text-muted underline-offset-4 hover:text-fg hover:underline">
                @{handle}
                <span className="sr-only"> (opens Instagram in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        onClick={start}
        disabled={busy}
        className="inline-flex min-h-11 items-center gap-1.5 text-sm text-muted hover:text-fg disabled:opacity-50"
        aria-label={tagged.length ? `Edit Instagram tags on ${title}` : `Tag people on Instagram in ${title}`}
      >
        <Instagram aria-hidden className="size-4" /> {tagged.length ? "Edit tags" : "Tag people"}
      </button>
    </div>
  );
}
