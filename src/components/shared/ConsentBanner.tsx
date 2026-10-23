"use client";

import { useEffect, useState } from "react";
import { GA_ID, loadAnalytics, readConsent, saveConsent } from "@/lib/conversions";

/**
 * Asks once before Google Analytics loads. Shown only when GA is configured (NEXT_PUBLIC_GA_ID).
 * A small bar above the booking bar, never a popup that blocks the page.
 */
export default function ConsentBanner() {
  const [ask, setAsk] = useState(false);

  useEffect(() => {
    if (!GA_ID) return;
    const choice = readConsent();
    if (choice === "granted") loadAnalytics();
    // Deciding after mount keeps the server and first client render identical.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    else if (choice === null) setAsk(true);
  }, []);

  if (!ask) return null;

  const choose = (value: "granted" | "denied") => {
    saveConsent(value);
    if (value === "granted") loadAnalytics();
    setAsk(false);
  };

  return (
    <div
      role="region"
      aria-label="Analytics consent"
      className="fixed inset-x-3 bottom-[calc(var(--tabbar-h)+env(safe-area-inset-bottom)+0.75rem)] z-40 mx-auto max-w-xl rounded-lg border border-border bg-surface p-4 text-sm shadow-md lg:bottom-6"
    >
      <p className="text-muted">
        We use Google Analytics to see which pages help people book. No ads, and nothing is shared for marketing. Is that okay?
      </p>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => choose("granted")} className="h-10 rounded-md bg-fg px-4 font-semibold text-bg">
          Allow
        </button>
        <button type="button" onClick={() => choose("denied")} className="h-10 rounded-md border border-border-strong px-4 font-semibold">
          No thanks
        </button>
      </div>
    </div>
  );
}
