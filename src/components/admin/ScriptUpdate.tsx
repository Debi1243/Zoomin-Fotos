"use client";

import { useState } from "react";
import { Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { dashboardScript } from "@/lib/dashboard-script";

/** Shown when the sheet runs an older copy of the script than this page needs. The web address stays the same. */
export default function ScriptUpdate({ onDone, reason }: { onDone: () => void; reason: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(dashboardScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // The code is also in the box below to select by hand.
    }
  };
  return (
    <section aria-labelledby="update-title" className="max-w-3xl rounded-lg border border-border-strong bg-surface p-6">
      <h2 id="update-title" className="font-display text-2xl">
        Update your sheet script
      </h2>
      <p className="mt-2 text-sm text-muted">{reason} It takes about two minutes, and the web address stays the same.</p>
      <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm leading-relaxed">
        <li>Open your “Zoomin Fotos dashboard” Google Sheet and choose <b>Extensions › Apps Script</b>.</li>
        <li>Delete all the code there, paste the new code, and click the save icon.</li>
        <li>
          Click <b>Deploy › Manage deployments</b>, click the pencil icon, set <b>Version</b> to <b>New version</b>, and click{" "}
          <b>Deploy</b>. If Google asks, authorise it again.
        </li>
        <li>Come back here and press Check again.</li>
      </ol>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button type="button" variant="secondary" onClick={() => void copy()}>
          <Copy aria-hidden className="size-4" /> {copied ? "Copied" : "Copy the new code"}
        </Button>
        <Button type="button" onClick={onDone}>
          <RefreshCw aria-hidden className="size-4" /> Check again
        </Button>
      </div>
      <textarea
        readOnly
        value={dashboardScript}
        aria-label="Sheet script"
        onFocus={(e) => e.currentTarget.select()}
        className="mt-4 h-28 w-full rounded-md border border-border bg-bg p-3 font-mono text-xs"
      />
    </section>
  );
}
