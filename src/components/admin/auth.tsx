"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/forms/Field";
import { GitHubError } from "@/lib/github";
import { NO_TRACK_KEY } from "@/lib/track";

/** Sign-in shared by the admin pages: one GitHub access key, kept on this device only. */

const TOKEN_KEY = "zf-admin-token";

export type Notice = { kind: "error" | "success" | "info"; text: string };

export function readStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function remembered() {
  try {
    return localStorage.getItem(TOKEN_KEY) !== null;
  } catch {
    return false;
  }
}

export function storeToken(token: string | null, remember: boolean) {
  try {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    if (!token) return;
    (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, token);
    // A device the studio signs in on stays out of the visit counts from then on.
    localStorage.setItem(NO_TRACK_KEY, "1");
  } catch {
    // Private browsing: the key lasts until the page is closed.
  }
}

export function explain(err: unknown) {
  if (err instanceof GitHubError) {
    if (err.status === 401) return "That access key was not accepted. It may have expired; create a new one and sign in again.";
    if (err.status === 403 || err.status === 404)
      return "This access key cannot change the website. Check it has Contents: Read and write access to the Zoomin-Fotos repository.";
    return `GitHub said: ${err.message}`;
  }
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}

export function SignIn({ onSignIn, notice }: { onSignIn: (token: string, remember: boolean) => void; notice: Notice | null }) {
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
          hint="Your GitHub access key for the website. It stays on this device and is only sent to GitHub and to your own dashboard sheet."
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
