"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Copy, FilePlus2, FileText, LoaderCircle, MessageCircle, Plus, Printer, ReceiptIndianRupee, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { control } from "@/components/forms/Field";
import BillDocument, { docTitle } from "./BillDocument";
import { explain, readStoredToken, remembered, SignIn, storeToken, type Notice } from "./auth";
import { GitHubError, verifyToken } from "@/lib/github";
import { formatRupees } from "@/lib/brand";
import {
  catalog,
  duplicateDoc,
  emptyProfile,
  loadDocs,
  loadProfile,
  newDoc,
  newItem,
  nextNumber,
  quoteToBill,
  saveDocs,
  saveProfile,
  shareText,
  totals,
  waNumber,
  type BillDoc,
  type DocKind,
  type LineItem,
  type StudioProfile,
} from "@/lib/billing";
import { cn } from "@/lib/cn";

const input = cn(control, "h-11 border-border");
const area = cn(control, "min-h-20 border-border py-2.5 leading-relaxed");
const num = (v: string) => (Number.isFinite(Number(v)) ? Math.max(0, Number(v)) : 0);

/** The quote and bill maker on /admin/billing, for the studio only. */
export default function BillingDesk() {
  const [token, setToken] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [notice, setNotice] = useState<Notice | null>(null);

  const signIn = useCallback(async (key: string, remember: boolean) => {
    setChecking(true);
    setNotice(null);
    try {
      const { canSave } = await verifyToken(key);
      if (!canSave) throw new GitHubError("forbidden", 403);
      storeToken(key, remember);
      setToken(key);
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
  if (!token) return <SignIn onSignIn={signIn} notice={notice} />;
  return <Desk />;
}

function Desk() {
  const [docs, setDocs] = useState<BillDoc[]>([]);
  const [profile, setProfile] = useState<StudioProfile>(emptyProfile);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Saved documents live in this browser's storage, which exists only after mount.
    const saved = loadDocs().sort((a, b) => b.updatedAt - a.updatedAt);
    const p = loadProfile();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfile(p);
    if (saved.length) {
      setDocs(saved);
      setCurrentId(saved[0].id);
    } else {
      const first = newDoc("quote", nextNumber("quote", []), p);
      setDocs([first]);
      setCurrentId(first.id);
    }
    setMounted(true);
    const done = () => document.documentElement.classList.remove("printing");
    window.addEventListener("afterprint", done);
    return () => window.removeEventListener("afterprint", done);
  }, []);

  // Every change is kept straight away.
  useEffect(() => {
    if (mounted) saveDocs(docs);
  }, [docs, mounted]);
  useEffect(() => {
    if (mounted) saveProfile(profile);
  }, [profile, mounted]);

  const doc = docs.find((d) => d.id === currentId) ?? null;
  const update = (patch: Partial<BillDoc>) =>
    setDocs((all) => all.map((d) => (d.id === currentId ? { ...d, ...patch, updatedAt: Date.now() } : d)));
  const setItem = (id: string, patch: Partial<LineItem>) => doc && update({ items: doc.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) });

  const create = (kind: DocKind) => {
    const d = newDoc(kind, nextNumber(kind, docs), profile);
    setDocs((all) => [d, ...all]);
    setCurrentId(d.id);
  };
  const toBill = () => {
    if (!doc) return;
    const b = quoteToBill(doc, nextNumber("bill", docs));
    setDocs((all) => [b, ...all]);
    setCurrentId(b.id);
  };
  const duplicate = () => {
    if (!doc) return;
    const copy = duplicateDoc(doc, nextNumber(doc.kind, docs));
    setDocs((all) => [copy, ...all]);
    setCurrentId(copy.id);
  };
  const remove = () => {
    if (!doc || !window.confirm(`Delete ${doc.number}? This can't be undone.`)) return;
    const rest = docs.filter((d) => d.id !== doc.id);
    setDocs(rest);
    setCurrentId(rest[0]?.id ?? null);
  };
  const print = () => {
    document.documentElement.classList.add("printing");
    window.print();
  };

  if (!mounted) return null;

  if (!doc) {
    return (
      <div className="rounded-lg border border-border bg-surface p-8 text-center">
        <p className="text-muted">No documents yet.</p>
        <div className="mt-4 flex justify-center gap-3">
          <Button onClick={() => create("quote")} arrow={false}>New quotation</Button>
          <Button variant="secondary" onClick={() => create("bill")} arrow={false}>New bill</Button>
        </div>
      </div>
    );
  }

  const t = totals(doc);
  const share = doc.client.phone ? `https://wa.me/${waNumber(doc.client.phone)}?text=${encodeURIComponent(shareText(doc))}` : null;

  return (
    <div className="grid gap-8 xl:grid-cols-12">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 xl:col-span-12">
        <Button size="md" onClick={() => create("quote")} arrow={false}>
          <FilePlus2 aria-hidden className="size-4" /> New quotation
        </Button>
        <Button size="md" variant="secondary" onClick={() => create("bill")} arrow={false}>
          <ReceiptIndianRupee aria-hidden className="size-4" /> New bill
        </Button>
        <label className="ml-auto flex items-center gap-2 text-sm">
          <span className="text-muted">Open</span>
          <select className={cn(input, "h-11 w-auto min-w-56")} value={doc.id} onChange={(e) => setCurrentId(e.target.value)}>
            {docs.map((d) => (
              <option key={d.id} value={d.id}>
                {d.number} · {d.client.name || "No client yet"} · {formatRupees(totals(d).total)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Editor */}
      <div className="space-y-6 xl:col-span-5">
        <Panel title={`${docTitle(doc, profile)} details`}>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Number">
              <input className={input} value={doc.number} onChange={(e) => update({ number: e.target.value })} />
            </Field>
            <Field label="Date">
              <input type="date" className={input} value={doc.date} onChange={(e) => update({ date: e.target.value })} />
            </Field>
            <Field label={doc.kind === "quote" ? "Valid until" : "Due by"}>
              <input type="date" className={input} value={doc.until} onChange={(e) => update({ until: e.target.value })} />
            </Field>
          </div>
        </Panel>

        <Panel title="Client">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <input className={input} autoComplete="off" value={doc.client.name} onChange={(e) => update({ client: { ...doc.client, name: e.target.value } })} />
            </Field>
            <Field label="Mobile (for WhatsApp)">
              <input className={input} type="tel" inputMode="tel" value={doc.client.phone} onChange={(e) => update({ client: { ...doc.client, phone: e.target.value } })} />
            </Field>
            <Field label="Email">
              <input className={input} type="email" value={doc.client.email} onChange={(e) => update({ client: { ...doc.client, email: e.target.value } })} />
            </Field>
            <Field label="Client GSTIN (businesses)">
              <input className={input} value={doc.client.gstin} onChange={(e) => update({ client: { ...doc.client, gstin: e.target.value.toUpperCase() } })} />
            </Field>
            <Field label="Address" wide>
              <textarea className={area} rows={2} value={doc.client.address} onChange={(e) => update({ client: { ...doc.client, address: e.target.value } })} />
            </Field>
          </div>
        </Panel>

        <Panel title="Event">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="What" wide>
              <input className={input} placeholder="Wedding of Priya and Rahul" value={doc.event.title} onChange={(e) => update({ event: { ...doc.event, title: e.target.value } })} />
            </Field>
            <Field label="Date">
              <input type="date" className={input} value={doc.event.date} onChange={(e) => update({ event: { ...doc.event, date: e.target.value } })} />
            </Field>
            <Field label="Venue">
              <input className={input} value={doc.event.venue} onChange={(e) => update({ event: { ...doc.event, venue: e.target.value } })} />
            </Field>
          </div>
        </Panel>

        <Panel title="Items">
          <label className="block text-sm">
            <span className="font-semibold">Add from your packages and rates</span>
            <select
              className={cn(input, "mt-2")}
              value=""
              onChange={(e) => {
                const c = catalog[Number(e.target.value)];
                if (!c) return;
                const blank = doc.items.length === 1 && !doc.items[0].description && !doc.items[0].rate;
                const item = newItem(c.description, c.rate, c.detail);
                update({ items: blank ? [item] : [...doc.items, item] });
              }}
            >
              <option value="">Choose a package or rate…</option>
              {[...new Set(catalog.map((c) => c.group))].map((g) => (
                <optgroup key={g} label={g}>
                  {catalog.map((c, i) =>
                    c.group === g ? (
                      <option key={i} value={i}>
                        {c.description} · {formatRupees(c.rate)}
                      </option>
                    ) : null,
                  )}
                </optgroup>
              ))}
            </select>
          </label>

          <ul className="mt-5 space-y-4">
            {doc.items.map((i, n) => (
              <li key={i.id} className="rounded-md border border-border p-3">
                <div className="flex items-start gap-2">
                  <span className="tabular mt-3 w-5 shrink-0 text-sm text-muted">{n + 1}</span>
                  <div className="grid flex-1 gap-2">
                    <input aria-label={`Item ${n + 1} description`} className={input} placeholder="Description" value={i.description} onChange={(e) => setItem(i.id, { description: e.target.value })} />
                    <textarea aria-label={`Item ${n + 1} details`} className={cn(area, "min-h-14 text-sm")} rows={2} placeholder="Details (optional)" value={i.detail} onChange={(e) => setItem(i.id, { detail: e.target.value })} />
                    <div className="grid grid-cols-[5rem_1fr_auto] items-center gap-2">
                      <input aria-label={`Item ${n + 1} quantity`} className={input} type="number" min={0} step="any" inputMode="decimal" value={i.qty} onChange={(e) => setItem(i.id, { qty: num(e.target.value) })} />
                      <input aria-label={`Item ${n + 1} rate in rupees`} className={input} type="number" min={0} step="any" inputMode="decimal" value={i.rate} onChange={(e) => setItem(i.id, { rate: num(e.target.value) })} />
                      <span className="tabular w-24 text-right text-sm font-semibold">{formatRupees(i.qty * i.rate)}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove item ${n + 1}`}
                    onClick={() => update({ items: doc.items.filter((x) => x.id !== i.id) })}
                    className="grid size-11 shrink-0 place-items-center rounded-md text-muted hover:bg-sand-soft hover:text-error"
                  >
                    <Trash2 aria-hidden className="size-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <Button variant="secondary" className="mt-4" arrow={false} onClick={() => update({ items: [...doc.items, newItem()] })}>
            <Plus aria-hidden className="size-4" /> Add a line
          </Button>
        </Panel>

        <Panel title="Totals">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Discount (₹)">
              <input className={input} type="number" min={0} inputMode="numeric" value={doc.discount} onChange={(e) => update({ discount: num(e.target.value) })} />
            </Field>
            <Field label={doc.kind === "quote" ? "Advance to confirm (₹)" : "Advance received (₹)"}>
              <input className={input} type="number" min={0} inputMode="numeric" value={doc.advance} onChange={(e) => update({ advance: num(e.target.value) })} />
            </Field>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" className="size-5 accent-[var(--primary)]" checked={doc.gst.on} onChange={(e) => update({ gst: { ...doc.gst, on: e.target.checked } })} />
              Add GST
            </label>
            <Field label="GST rate (%)">
              <input className={input} type="number" min={0} max={28} step="any" disabled={!doc.gst.on} value={doc.gst.rate} onChange={(e) => update({ gst: { ...doc.gst, rate: Math.min(28, num(e.target.value)) } })} />
            </Field>
          </div>
          <p className="tabular mt-4 rounded-md bg-sand-soft px-4 py-3 text-sm">
            Total <strong className="font-bold">{formatRupees(t.total)}</strong>
            {t.advance > 0 && doc.kind === "bill" && <> · Balance due <strong className="font-bold">{formatRupees(t.balance)}</strong></>}
          </p>
          {doc.gst.on && !profile.gstin && doc.kind === "bill" && (
            <p className="mt-2 text-sm text-warning">Add your GSTIN under Studio details to issue this as a tax invoice.</p>
          )}
        </Panel>

        <Panel title="Notes and terms">
          <Field label="Notes for this client" wide>
            <textarea className={area} rows={3} value={doc.notes} onChange={(e) => update({ notes: e.target.value })} />
          </Field>
          <div className="mt-4">
            <Field label="Terms" wide>
              <textarea
                className={area}
                rows={4}
                placeholder="Your payment, delivery, date-change and cancellation terms"
                value={doc.terms}
                onChange={(e) => update({ terms: e.target.value })}
              />
            </Field>
            <button type="button" className="mt-2 text-sm font-semibold text-accent hover:underline" onClick={() => setProfile({ ...profile, terms: doc.terms })}>
              Use these terms on every new document
            </button>
          </div>
        </Panel>

        <details className="rounded-lg border border-border bg-surface p-5">
          <summary className="cursor-pointer font-display font-semibold">Studio details (on every document)</summary>
          <div className="mt-4 grid gap-4">
            <Field label="Studio GSTIN">
              <input className={input} value={profile.gstin} onChange={(e) => setProfile({ ...profile, gstin: e.target.value.toUpperCase() })} />
            </Field>
            <Field label="Studio address">
              <textarea className={area} rows={2} value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} />
            </Field>
            <Field label="UPI ID">
              <input className={input} placeholder="studio@okhdfcbank" value={profile.upiId} onChange={(e) => setProfile({ ...profile, upiId: e.target.value })} />
            </Field>
            <Field label="Bank details">
              <textarea className={area} rows={3} placeholder={"Account name, number, IFSC"} value={profile.bank} onChange={(e) => setProfile({ ...profile, bank: e.target.value })} />
            </Field>
          </div>
        </details>
      </div>

      {/* Preview and actions */}
      <div className="xl:col-span-7">
        <div className="xl:sticky xl:top-24">
          <div className="flex flex-wrap gap-2">
            <Button onClick={print} arrow={false}>
              <Printer aria-hidden className="size-4" /> Print or save PDF
            </Button>
            {share ? (
              <a
                href={share}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-md bg-whatsapp px-4 text-sm font-semibold text-white hover:bg-whatsapp-hover"
              >
                <MessageCircle aria-hidden className="size-4" /> Send on WhatsApp
              </a>
            ) : (
              <span className="inline-flex h-11 items-center px-1 text-sm text-muted">Add the client&apos;s mobile to send on WhatsApp</span>
            )}
            {doc.kind === "quote" && (
              <Button variant="secondary" onClick={toBill} arrow={false}>
                <FileText aria-hidden className="size-4" /> Make bill from this quote
              </Button>
            )}
            <Button variant="secondary" onClick={duplicate} arrow={false}>
              <Copy aria-hidden className="size-4" /> Duplicate
            </Button>
            <Button variant="secondary" onClick={remove} arrow={false} className="text-error">
              <Trash2 aria-hidden className="size-4" /> Delete
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted">
            Saved on this device only. To send a PDF: Print or save PDF, choose “Save as PDF”, then attach it in WhatsApp.
          </p>
          <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-white shadow-sm">
            <div className="min-w-[38rem]">
              <BillDocument d={doc} profile={profile} />
            </div>
          </div>
        </div>
      </div>

      {createPortal(
        <div className="print-only">
          <BillDocument d={doc} profile={profile} />
        </div>,
        document.body,
      )}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-surface p-5">
      <h2 className="font-display text-base font-semibold">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Field({ label, wide, children }: { label: string; wide?: boolean; children: ReactNode }) {
  return (
    <label className={cn("block text-sm", wide && "sm:col-span-full")}>
      <span className="font-semibold">{label}</span>
      <span className="mt-1.5 block">{children}</span>
    </label>
  );
}
