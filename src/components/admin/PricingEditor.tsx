"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { CircleAlert, CircleCheck, LoaderCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { explain, readStoredToken, remembered, SignIn, storeToken, type Notice } from "@/components/admin/auth";
import { commitChange, GitHubError, loadContent, verifyToken } from "@/lib/github";
import { pricedItems, type Pricing } from "@/lib/package-builder";
import { formatRupees } from "@/lib/data";
import { cn } from "@/lib/cn";

type Draft = { prices: Record<string, string>; eventShare: Record<string, string> };

const toDraft = (p: Pricing): Draft => ({
  prices: Object.fromEntries([...pricedItems.perEvent, ...pricedItems.once].map((i) => [i.id, String(p.prices[i.id] ?? i.price)])),
  eventShare: Object.fromEntries(pricedItems.baseEvents.map((e) => [e.id, String(p.eventShare[e.id] ?? Math.round(e.weight * 100))])),
});

const num = (v: string | undefined) => (v !== undefined && /^\d+$/.test(v.trim()) ? Number(v) : NaN);

/** Admin page for the package builder's rates, saved to src/content/pricing.json. */
export default function PricingEditor() {
  const [token, setToken] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saved, setSaved] = useState<Draft | null>(null);
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
      const d = toDraft(content.pricing);
      setDraft(d);
      setSaved(d);
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

  if (checking) {
    return (
      <p className="flex items-center gap-2 text-muted" role="status">
        <LoaderCircle aria-hidden className="size-4 animate-spin" /> Checking your sign-in…
      </p>
    );
  }
  if (!token || !draft) return <SignIn onSignIn={signIn} notice={notice} />;

  const allIds = [...pricedItems.perEvent, ...pricedItems.once].map((i) => i.id);
  const invalid = [
    ...allIds.filter((id) => Number.isNaN(num(draft.prices[id]))),
    ...pricedItems.baseEvents.map((e) => e.id).filter((id) => Number.isNaN(num(draft.eventShare[id])) || num(draft.eventShare[id]) > 300),
  ];
  const changed = JSON.stringify(draft) !== JSON.stringify(saved);
  const p = (id: string) => num(draft.prices[id]) || 0;
  const essence = (p("photographer") + p("cinematographer")) * ((num(draft.eventShare.wedding) || 0) / 100) + p("album") + p("film");

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!token || !draft || invalid.length) return;
    setBusy(true);
    setNotice(null);
    const pricing: Pricing = {
      prices: Object.fromEntries(allIds.map((id) => [id, num(draft.prices[id])])),
      eventShare: Object.fromEntries(pricedItems.baseEvents.map((ev) => [ev.id, num(draft.eventShare[ev.id])])),
    };
    try {
      await commitChange(token, () => ({ content: { pricing }, message: "Update package builder prices" }));
      setSaved(draft);
      setNotice({ kind: "success", text: "Prices saved. The website shows them in about two minutes." });
    } catch (err) {
      setNotice({ kind: "error", text: explain(err) });
    } finally {
      setBusy(false);
    }
  }

  const signOut = () => {
    storeToken(null, false);
    setToken(null);
  };

  const field = (id: string, label: string, note: string, kind: "price" | "share") => {
    const value = kind === "price" ? draft.prices[id] : draft.eventShare[id];
    const bad = invalid.includes(id);
    return (
      <li key={id} className="flex items-center justify-between gap-4 py-3">
        <label htmlFor={`price-${id}`} className="min-w-0">
          <span className="block font-medium">{label}</span>
          <span className="block text-xs text-muted">{note}</span>
        </label>
        <span className={cn("flex h-11 w-32 shrink-0 items-center sm:w-40 rounded-md border bg-bg px-3 focus-within:border-fg", bad ? "border-error" : "border-border-strong")}>
          {kind === "price" && <span className="text-muted">₹</span>}
          <input
            id={`price-${id}`}
            inputMode="numeric"
            value={value}
            aria-invalid={bad || undefined}
            onChange={(e) => {
              const v = e.target.value.replace(/[^\d]/g, "");
              setDraft((d) => d && (kind === "price" ? { ...d, prices: { ...d.prices, [id]: v } } : { ...d, eventShare: { ...d.eventShare, [id]: v } }));
            }}
            className="tabular min-w-0 flex-1 bg-transparent px-1.5 text-right outline-none"
          />
          {kind === "share" && <span className="text-muted">%</span>}
        </span>
      </li>
    );
  };

  return (
    <form onSubmit={save} className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <p className="max-w-[60ch] text-sm text-muted">
          These rates drive the package builder on the Services and Weddings pages. The fixed packages are not affected.
        </p>
        <button type="button" onClick={signOut} className="inline-flex items-center gap-2 text-sm font-medium hover:text-accent">
          <LogOut aria-hidden className="size-4" /> Sign out
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <section className="min-w-0 rounded-lg border border-border bg-surface p-5">
          <h2 className="font-display text-2xl">For each event</h2>
          <p className="mt-1 text-sm text-muted">Charged once for every event the client picks.</p>
          <ul className="mt-3 divide-y divide-border">{pricedItems.perEvent.map((i) => field(i.id, i.label, i.note, "price"))}</ul>
        </section>
        <section className="min-w-0 rounded-lg border border-border bg-surface p-5">
          <h2 className="font-display text-2xl">Once per booking</h2>
          <p className="mt-1 text-sm text-muted">Add-ons, charged once whatever the number of events. Extra hours are per hour.</p>
          <ul className="mt-3 divide-y divide-border">{pricedItems.once.map((i) => field(i.id, i.label, i.note, "price"))}</ul>
        </section>
        <section className="min-w-0 rounded-lg border border-border bg-surface p-5">
          <h2 className="font-display text-2xl">Event length</h2>
          <p className="mt-1 text-sm text-muted">How much of a full day each event costs. 100% charges the full rates above; 60% charges a little over half.</p>
          <ul className="mt-3 divide-y divide-border">{pricedItems.baseEvents.map((e) => field(e.id, e.label, e.note, "share"))}</ul>
        </section>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-border pt-6">
        <Button type="submit" loading={busy} loadingLabel="Saving…" disabled={!changed || invalid.length > 0}>
          Save prices
        </Button>
        {changed && (
          <button type="button" onClick={() => setDraft(saved)} className="text-sm text-muted hover:text-fg">
            Undo changes
          </button>
        )}
        <p className="text-sm text-muted">
          Check: 1 photographer, 1 cinematographer, album and full film for a wedding day comes to{" "}
          <span className="tabular font-medium text-fg">{formatRupees(Math.round(essence / 500) * 500)}</span>.
        </p>
      </div>
      {invalid.length > 0 && <p className="text-sm text-error">Fill in every box with a whole number. Event length can go up to 300%.</p>}
      {notice && (
        <p role={notice.kind === "error" ? "alert" : "status"} className={cn("flex items-start gap-2 text-sm", notice.kind === "error" && "text-error")}>
          {notice.kind === "error" ? <CircleAlert aria-hidden className="mt-0.5 size-4" /> : <CircleCheck aria-hidden className="mt-0.5 size-4 text-success" />}
          {notice.text}
        </p>
      )}
    </form>
  );
}
