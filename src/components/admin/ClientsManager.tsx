"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CircleAlert,
  CircleCheck,
  Copy,
  FileSignature,
  KeyRound,
  LoaderCircle,
  LogOut,
  MessageCircle,
  Plus,
  Trash2,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/forms/Field";
import RowsEditor from "@/components/forms/RowsEditor";
import { bookingFields, blanks } from "@/components/forms/booking-fields";
import ScriptUpdate from "@/components/admin/ScriptUpdate";
import { explain, readStoredToken, remembered, SignIn, storeToken, type Notice } from "@/components/admin/auth";
import {
  blankBooking,
  bookingSchema,
  deliveryNames,
  deliveryStatuses,
  money,
  newPin,
  stage,
  stageLabel,
  standardAgreement,
  type Booking,
} from "@/lib/booking";
import { commitChange, GitHubError, loadContent, verifyToken } from "@/lib/github";
import { SCRIPT_VERSION } from "@/lib/dashboard-script";
import { callSheet } from "@/lib/sheet";
import { UPI_PATTERN, type Settings } from "@/lib/settings";
import { brand, formatRupees } from "@/lib/data";
import { absoluteUrl } from "@/lib/site";
import { cn } from "@/lib/cn";

type Entry = { data: Booking; signature: string; hasPin: boolean };

const portalUrl = absoluteUrl("/portal");

const shortDate = (iso: string) => {
  const t = Date.parse(iso);
  return Number.isNaN(t) ? "Date to be set" : new Date(t).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const stageTone: Record<ReturnType<typeof stage>, string> = {
  agreement: "border-border text-muted",
  payment: "border-[var(--marigold)] text-[var(--marigold)]",
  verifying: "border-[var(--rani)] text-[var(--rani)]",
  confirmed: "border-success text-success",
};

function inviteText(b: Booking, pin: string) {
  return `Hello ${b.client.names.split(/[ &]/)[0] || "there"}, your ${brand.name} client portal is ready.

Open ${portalUrl}
Booking code: ${b.code}
PIN: ${pin}

You can review and sign the agreement, pay the advance, and share your plans and family details there.`;
}

/** Admin page for client bookings: create them, fill in each section, confirm payments and share portal access. */
export default function ClientsManager() {
  const [token, setToken] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [settings, setSettings] = useState<Settings>({});
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [outdated, setOutdated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<{ entry: Entry; pin?: string; isNew: boolean } | null>(null);

  const endpoint = settings.dataEndpoint;

  const signIn = useCallback(async (key: string, remember: boolean) => {
    setChecking(true);
    setNotice(null);
    try {
      const { canSave } = await verifyToken(key);
      if (!canSave) throw new GitHubError("forbidden", 403);
      const { content } = await loadContent(key);
      storeToken(key, remember);
      setToken(key);
      setSettings(content.settings);
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
    setNotice(null);
    try {
      const result = await callSheet<{ bookings?: { data: unknown; signature: string; hasPin: boolean }[] }>(endpoint, { type: "bookings", token });
      if (!result.ok && result.error === "Unknown request") {
        setOutdated(true);
        return;
      }
      if (!result.ok) throw new Error(result.error === "not-allowed" ? "The sheet did not accept your access key." : result.error);
      setOutdated((result.version ?? 1) < SCRIPT_VERSION);
      const list = (result.bookings ?? []).flatMap((b) => {
        const parsed = bookingSchema.safeParse(b.data);
        return parsed.success ? [{ data: parsed.data, signature: b.signature, hasPin: b.hasPin }] : [];
      });
      setEntries(list.sort((a, b) => (a.data.eventDate || "9").localeCompare(b.data.eventDate || "9")));
    } catch (err) {
      setNotice({ kind: "error", text: explain(err) });
    } finally {
      setLoading(false);
    }
  }, [token, endpoint]);

  useEffect(() => {
    // Loading the bookings follows signing in.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

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
    setEntries(null);
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
      <p className="max-w-[60ch] text-sm text-muted">
        Each booking gets a code and PIN for the client portal at <span className="text-fg">{portalUrl.replace(/^https:\/\//, "")}</span>.
      </p>
      <button type="button" onClick={signOut} className="inline-flex items-center gap-2 text-sm font-medium hover:text-accent">
        <LogOut aria-hidden className="size-4" /> Sign out
      </button>
    </div>
  );

  if (!endpoint) {
    return (
      <div className="space-y-8">
        {header}
        <p className="max-w-[60ch]">
          Client bookings are kept in your Google Sheet. Connect it first on the{" "}
          <Link href="/admin/dashboard" className="underline underline-offset-2">
            Dashboard
          </Link>{" "}
          tab, then come back here.
        </p>
      </div>
    );
  }

  if (editing) {
    return (
      <div className="space-y-8">
        {header}
        <BookingEditor
          key={editing.entry.data.code}
          initial={editing}
          token={token}
          endpoint={endpoint}
          onClose={(changed) => {
            setEditing(null);
            if (changed) void load();
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {header}
      {notice && <NoticeLine notice={notice} />}
      {outdated && <ScriptUpdate reason="Client bookings need the newer sheet script." onDone={() => void load()} />}

      {!outdated && (
        <section aria-labelledby="bookings-title">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="bookings-title" className="font-display text-h3">
              Bookings
            </h2>
            <Button type="button" onClick={() => setEditing({ entry: { data: blankBooking(), signature: "", hasPin: false }, pin: newPin(), isNew: true })}>
              <Plus aria-hidden className="size-4" /> New booking
            </Button>
          </div>
          {loading && !entries ? (
            <p className="mt-6 flex items-center gap-2 text-muted" role="status">
              <LoaderCircle aria-hidden className="size-4 animate-spin" /> Loading bookings…
            </p>
          ) : entries && entries.length === 0 ? (
            <p className="mt-6 text-sm text-muted">No bookings yet. Create one when a client accepts a quote.</p>
          ) : (
            <ul className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {entries?.map((e) => {
                const s = stage(e.data);
                const m = money(e.data);
                return (
                  <li key={e.data.code}>
                    <button
                      type="button"
                      onClick={() => setEditing({ entry: e, isNew: false })}
                      className="block w-full rounded-lg border border-border bg-surface p-5 text-left transition-colors hover:border-fg"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-medium">{e.data.title || e.data.client.names || "Untitled booking"}</p>
                        <span className={cn("shrink-0 rounded-full border px-2.5 py-0.5 text-xs", stageTone[s])}>{stageLabel[s]}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted">
                        {shortDate(e.data.eventDate)} · {e.data.code}
                      </p>
                      <p className="tabular mt-4 text-sm">
                        {formatRupees(m.total)} total · {formatRupees(m.paid)} received
                        {m.claimed > 0 && <span className="text-[var(--rani)]"> · {formatRupees(m.claimed)} to check</span>}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}

      <UpiSettings token={token} settings={settings} onSaved={setSettings} />
    </div>
  );
}

function NoticeLine({ notice }: { notice: Notice }) {
  const error = notice.kind === "error";
  return (
    <p role={error ? "alert" : "status"} className={cn("flex items-start gap-2 rounded-md border p-4 text-sm", error ? "border-error/40 text-error" : "border-success/40")}>
      {error ? <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" /> : <CircleCheck aria-hidden className="mt-0.5 size-4 shrink-0 text-success" />}
      {notice.text}
    </p>
  );
}

function UpiSettings({ token, settings, onSaved }: { token: string; settings: Settings; onSaved: (s: Settings) => void }) {
  const [upiId, setUpiId] = useState(settings.upiId ?? "");
  const [upiName, setUpiName] = useState(settings.upiName ?? brand.name);
  const [state, setState] = useState<{ busy?: boolean; error?: string; done?: boolean }>({});
  const save = async () => {
    if (upiId && !UPI_PATTERN.test(upiId.trim())) return setState({ error: "That doesn't look like a UPI ID. It should look like name@bank." });
    setState({ busy: true });
    try {
      const next = { ...settings, upiId: upiId.trim(), upiName: upiName.trim() };
      await commitChange(token, (c) => ({ content: { settings: { ...c.settings, upiId: next.upiId, upiName: next.upiName } }, message: "Update UPI details for client payments" }));
      onSaved(next);
      setState({ done: true });
    } catch (err) {
      setState({ error: explain(err) });
    }
  };
  return (
    <section aria-labelledby="upi-title" className="max-w-2xl rounded-lg border border-border bg-surface p-6">
      <h2 id="upi-title" className="font-display text-2xl">
        Advance payments
      </h2>
      <p className="mt-2 text-sm text-muted">
        Clients pay the advance by UPI from the portal: on a phone it opens Google Pay, PhonePe or Paytm with the amount filled in; on a
        computer it shows a QR code. They then enter the payment reference, and you confirm it here once it reaches your account.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <TextField id="upi-id" label="UPI ID" placeholder="zoominfotos@okhdfcbank" value={upiId} onChange={(e) => setUpiId(e.target.value)} error={state.error} />
        <TextField id="upi-name" label="Name shown to clients" value={upiName} onChange={(e) => setUpiName(e.target.value)} />
      </div>
      <div className="mt-4 flex items-center gap-4">
        <Button type="button" variant="secondary" onClick={() => void save()} loading={state.busy} loadingLabel="Saving…">
          Save UPI details
        </Button>
        {state.done && <span className="text-sm text-muted">Saved. The portal uses it in about two minutes.</span>}
      </div>
    </section>
  );
}

function Section({ title, icon, children, note }: { title: string; icon?: ReactNode; note?: string; children: ReactNode }) {
  return (
    <details open className="group rounded-lg border border-border bg-surface">
      <summary className="flex cursor-pointer list-none items-center gap-3 p-5 [&::-webkit-details-marker]:hidden">
        {icon && <span aria-hidden className="text-muted">{icon}</span>}
        <span className="font-display text-2xl">{title}</span>
        {note && <span className="hidden text-sm text-muted sm:inline">{note}</span>}
        <span aria-hidden className="ml-auto text-muted transition-transform group-open:rotate-180">⌄</span>
      </summary>
      <div className="border-t border-border p-5">{children}</div>
    </details>
  );
}

const input = "h-11 w-full rounded-md border border-border-strong bg-bg px-3 text-sm outline-none focus:border-fg";

function BookingEditor({
  initial,
  token,
  endpoint,
  onClose,
}: {
  initial: { entry: Entry; pin?: string; isNew: boolean };
  token: string;
  endpoint: string;
  onClose: (changed: boolean) => void;
}) {
  const [b, setB] = useState<Booking>(initial.entry.data);
  const [signature, setSignature] = useState(initial.entry.signature);
  const [pin, setPin] = useState<string | undefined>(initial.pin);
  const [saved, setSaved] = useState(!initial.isNew);
  const [dirty, setDirty] = useState(initial.isNew);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pay, setPay] = useState({ amount: "", reference: "" });

  const update = (patch: Partial<Booking>) => {
    setB((prev) => ({ ...prev, ...patch }));
    setDirty(true);
  };
  const m = money(b);
  const s = stage(b);

  async function save() {
    setBusy(true);
    setNotice(null);
    try {
      const data = { ...b, status: stageLabel[stage(b)] };
      const result = await callSheet<{ booking: unknown; signature: string }>(endpoint, { type: "save-booking", token, booking: data, pin });
      if (!result.ok) throw new Error(result.error);
      setB(bookingSchema.parse(result.booking));
      setSignature(result.signature);
      setSaved(true);
      setDirty(false);
      setNotice({ kind: "success", text: pin ? "Saved. Share the code and PIN with the client." : "Saved." });
    } catch (err) {
      setNotice({ kind: "error", text: explain(err) });
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    try {
      const result = await callSheet(endpoint, { type: "delete-booking", token, code: b.code });
      if (!result.ok) throw new Error(result.error);
      onClose(true);
    } catch (err) {
      setNotice({ kind: "error", text: explain(err) });
      setBusy(false);
    }
  }

  const invite = pin ? inviteText(b, pin) : "";
  const phoneDigits = b.client.phone.replace(/\D/g, "");
  const wa = pin && phoneDigits.length >= 10 ? `https://wa.me/${phoneDigits.length === 10 ? `91${phoneDigits}` : phoneDigits}?text=${encodeURIComponent(invite)}` : null;

  return (
    <div className="space-y-6 pb-28">
      <button type="button" onClick={() => (!dirty || confirm("Leave without saving your changes?")) && onClose(saved)} className="inline-flex items-center gap-2 text-sm text-muted hover:text-fg">
        <ArrowLeft aria-hidden className="size-4" /> All bookings
      </button>
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-display text-h3">{b.title || "New booking"}</h2>
        <span className={cn("rounded-full border px-2.5 py-0.5 text-xs", stageTone[s])}>{stageLabel[s]}</span>
      </div>

      <Section title="Client and event" icon={<UserRound className="size-5" />}>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField id="b-title" label="Booking name" placeholder="Priya and Arjun's wedding" value={b.title} onChange={(e) => update({ title: e.target.value })} />
          <TextField id="b-date" label="Main event date" type="date" value={b.eventDate} onChange={(e) => update({ eventDate: e.target.value })} />
          <TextField id="b-names" label="Client names" placeholder="Priya Mohanty and Arjun Das" value={b.client.names} onChange={(e) => update({ client: { ...b.client, names: e.target.value } })} />
          <TextField id="b-phone" label="Client phone or WhatsApp" type="tel" value={b.client.phone} onChange={(e) => update({ client: { ...b.client, phone: e.target.value } })} />
          <TextField id="b-email" label="Client email" type="email" value={b.client.email} onChange={(e) => update({ client: { ...b.client, email: e.target.value } })} />
        </div>
      </Section>

      <Section title="Portal access" icon={<KeyRound className="size-5" />}>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
          <p>
            Booking code <span className="tabular ml-1 rounded bg-fg/[0.06] px-2 py-1 font-medium">{b.code}</span>
          </p>
          <p>
            PIN{" "}
            {pin ? (
              <span className="tabular ml-1 rounded bg-fg/[0.06] px-2 py-1 font-medium">{pin}</span>
            ) : (
              <span className="text-muted">set (hidden for safety)</span>
            )}
          </p>
          <button
            type="button"
            onClick={() => {
              setPin(newPin());
              setDirty(true);
            }}
            className="text-muted underline underline-offset-2 hover:text-fg"
          >
            {pin ? "Make a different PIN" : "Reset PIN"}
          </button>
        </div>
        {pin && (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-muted">{saved && !dirty ? "Send this to the client:" : "Save the booking first, then send this to the client:"}</p>
            <pre className="whitespace-pre-wrap rounded-md border border-border bg-bg p-3 font-sans text-sm">{invite}</pre>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                disabled={!saved || dirty}
                onClick={() => {
                  void navigator.clipboard?.writeText(invite).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  });
                }}
              >
                <Copy aria-hidden className="size-4" /> {copied ? "Copied" : "Copy message"}
              </Button>
              {wa && saved && !dirty && (
                <a href={wa} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center gap-2 rounded-md border border-border-strong px-4 text-sm font-medium hover:border-fg">
                  <MessageCircle aria-hidden className="size-4" /> Send on WhatsApp
                </a>
              )}
            </div>
          </div>
        )}
      </Section>

      <Section title="Package and invoice" note="What the agreement and invoice list">
        <div className="space-y-5">
          <TextField id="b-package" label="Package name" placeholder="Signature, with drone" value={b.package.name} onChange={(e) => update({ package: { ...b.package, name: e.target.value } })} />
          <RowsEditor
            label="Package items"
            fields={bookingFields.items}
            rows={b.package.items}
            blank={blanks.items}
            addLabel="Add item"
            empty="Add each part of the package with its price."
            onChange={(items) => update({ package: { ...b.package, items } })}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <NumberField id="b-discount" label="Discount (₹)" value={b.package.discount} onChange={(discount) => update({ package: { ...b.package, discount } })} />
            <NumberField id="b-gst" label="GST (%)" value={b.package.gstRate} onChange={(gstRate) => update({ package: { ...b.package, gstRate: Math.min(28, gstRate) } })} />
            <NumberField id="b-advance" label="Advance to confirm (₹)" value={b.advance} onChange={(advance) => update({ advance })} />
          </div>
          <label className="block text-sm">
            <span className="font-medium">Notes for the client</span>
            <textarea value={b.package.notes} onChange={(e) => update({ package: { ...b.package, notes: e.target.value } })} rows={2} className="mt-2 w-full rounded-md border border-border-strong bg-bg p-3 outline-none focus:border-fg" />
          </label>
          <p className="tabular rounded-md bg-fg/[0.04] p-4 text-sm">
            Subtotal {formatRupees(m.subtotal)}
            {b.package.discount > 0 && <> − discount {formatRupees(b.package.discount)}</>} + GST {formatRupees(m.gst)} ={" "}
            <b>{formatRupees(m.total)}</b>. Advance {formatRupees(b.advance)}
            {m.total > 0 && <> ({Math.round((b.advance / m.total) * 100)}%)</>}.
          </p>
        </div>
      </Section>

      <Section title="Agreement" icon={<FileSignature className="size-5" />}>
        {b.contract.signed ? (
          <div className="space-y-4 text-sm">
            <p className="flex items-center gap-2 text-success">
              <CircleCheck aria-hidden className="size-4" /> Signed by {b.contract.signed.name} on{" "}
              {new Date(b.contract.signed.at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element -- the client's drawn signature, stored as an image */}
            {signature && <img src={signature} alt={`Signature of ${b.contract.signed.name}`} className="h-20 rounded border border-border bg-white p-1" />}
            <details>
              <summary className="cursor-pointer text-muted hover:text-fg">Read the signed agreement</summary>
              <pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap rounded-md border border-border bg-bg p-4 font-sans">{b.contract.signed.text}</pre>
            </details>
            <button
              type="button"
              onClick={() => {
                if (!confirm("Clear the signature? The client will need to sign again.")) return;
                update({ contract: { text: b.contract.text } });
              }}
              className="text-muted underline underline-offset-2 hover:text-error"
            >
              Change the agreement and ask for a new signature
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted">The client reads this in the portal and signs it. Fill in the client and package first.</p>
              <Button
                type="button"
                variant="secondary"
                onClick={() => (!b.contract.text || confirm("Replace the agreement text with the standard agreement?")) && update({ contract: { text: standardAgreement(b) } })}
              >
                {b.contract.text ? "Refill the standard agreement" : "Use the standard agreement"}
              </Button>
            </div>
            <textarea
              aria-label="Agreement text"
              value={b.contract.text}
              onChange={(e) => update({ contract: { text: e.target.value } })}
              rows={14}
              className="w-full rounded-md border border-border-strong bg-bg p-4 font-sans text-sm leading-relaxed outline-none focus:border-fg"
            />
          </div>
        )}
      </Section>

      <Section title="Payments" note={`${formatRupees(m.paid)} received of ${formatRupees(m.total)}`}>
        <div className="space-y-4">
          {b.payments.length === 0 && <p className="text-sm text-muted">No payments yet.</p>}
          <ul className="space-y-2">
            {b.payments.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-md border border-border p-3 text-sm">
                <span className="tabular font-medium">{formatRupees(p.amount)}</span>
                <span className="text-muted">
                  {p.method} · {p.reference || "no reference"} · {new Date(p.at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </span>
                {p.status === "confirmed" ? (
                  <span className="ml-auto inline-flex items-center gap-1 text-success">
                    <Check aria-hidden className="size-4" /> Received
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => update({ payments: b.payments.map((x) => (x.id === p.id ? { ...x, status: "confirmed" } : x)) })}
                    className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-md bg-fg px-3 text-bg"
                  >
                    <Check aria-hidden className="size-4" /> Mark as received
                  </button>
                )}
                <button type="button" onClick={() => update({ payments: b.payments.filter((x) => x.id !== p.id) })} className="text-muted hover:text-error" aria-label={`Remove payment of ${formatRupees(p.amount)}`}>
                  <Trash2 aria-hidden className="size-4" />
                </button>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-end gap-3">
            <label className="text-sm">
              <span className="font-medium">Amount (₹)</span>
              <input inputMode="numeric" value={pay.amount} onChange={(e) => setPay({ ...pay, amount: e.target.value.replace(/\D/g, "") })} className={cn(input, "mt-2 w-36")} />
            </label>
            <label className="text-sm">
              <span className="font-medium">Reference or method</span>
              <input value={pay.reference} placeholder="Cash, bank transfer…" onChange={(e) => setPay({ ...pay, reference: e.target.value })} className={cn(input, "mt-2 w-56")} />
            </label>
            <Button
              type="button"
              variant="secondary"
              disabled={!Number(pay.amount)}
              onClick={() => {
                update({
                  payments: [
                    ...b.payments,
                    { id: crypto.randomUUID().slice(0, 8), amount: Number(pay.amount), reference: pay.reference, at: Date.now(), method: "Recorded by studio", status: "confirmed" },
                  ],
                });
                setPay({ amount: "", reference: "" });
              }}
            >
              Add a received payment
            </Button>
          </div>
        </div>
      </Section>

      <Section title="Planning" note="The client can edit these too">
        <div className="space-y-8">
          <Sub title="Timeline">
            <RowsEditor label="Timeline" fields={bookingFields.timeline} rows={b.planning.timeline} blank={blanks.timeline} addLabel="Add an event" onChange={(timeline) => update({ planning: { ...b.planning, timeline } })} />
          </Sub>
          <Sub title="Venues">
            <RowsEditor label="Venues" fields={bookingFields.venues} rows={b.planning.venues} blank={blanks.venues} addLabel="Add a venue" onChange={(venues) => update({ planning: { ...b.planning, venues } })} />
          </Sub>
          <Sub title="Shot list">
            <RowsEditor label="Shot list" fields={bookingFields.shots} rows={b.planning.shots} blank={() => ({ text: "", by: "Studio" })} addLabel="Add a shot" onChange={(shots) => update({ planning: { ...b.planning, shots } })} />
          </Sub>
          <Sub title="Family details">
            <RowsEditor label="Family" fields={bookingFields.family} rows={b.planning.family} blank={blanks.family} addLabel="Add a person" onChange={(family) => update({ planning: { ...b.planning, family } })} />
          </Sub>
        </div>
      </Section>

      <Section title="Wedding day">
        <div className="space-y-8">
          <Sub title="Your team">
            <RowsEditor label="Team" fields={bookingFields.team} rows={b.team} blank={blanks.team} addLabel="Add a team member" onChange={(team) => update({ team })} />
          </Sub>
          <Sub title="Schedule">
            <RowsEditor label="Schedule" fields={bookingFields.schedule} rows={b.schedule} blank={blanks.schedule} addLabel="Add a time" onChange={(schedule) => update({ schedule })} />
          </Sub>
        </div>
      </Section>

      <Section title="Delivery">
        <ul className="space-y-5">
          {b.delivery.map((d, i) => (
            <li key={d.kind}>
              <p className="mb-2 font-medium">{deliveryNames[d.kind]}</p>
              <div className="grid gap-2 sm:grid-cols-12">
                <select
                  aria-label={`${deliveryNames[d.kind]} status`}
                  value={d.status}
                  onChange={(e) => update({ delivery: b.delivery.map((x, j) => (j === i ? { ...x, status: e.target.value as typeof d.status } : x)) })}
                  className={cn(input, "sm:col-span-2")}
                >
                  {deliveryStatuses.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
                {(["expected", "url", "note"] as const).map((key) => (
                  <input
                    key={key}
                    aria-label={`${deliveryNames[d.kind]} ${key === "expected" ? "expected date" : key === "url" ? "link" : "note"}`}
                    type={key === "expected" ? "date" : key === "url" ? "url" : "text"}
                    placeholder={key === "url" ? "Link: YouTube, Google Drive or gallery" : key === "note" ? "Note for the client" : undefined}
                    value={d[key]}
                    onChange={(e) => update({ delivery: b.delivery.map((x, j) => (j === i ? { ...x, [key]: e.target.value } : x)) })}
                    className={cn(input, key === "expected" ? "sm:col-span-2" : "sm:col-span-4")}
                  />
                ))}
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <div className="flex flex-wrap items-center gap-4">
        {confirmDelete ? (
          <>
            <button type="button" onClick={() => void remove()} className="inline-flex h-11 items-center gap-2 rounded-md bg-error px-4 text-sm font-medium text-white">
              <Trash2 aria-hidden className="size-4" /> Yes, delete this booking
            </button>
            <button type="button" onClick={() => setConfirmDelete(false)} className="text-sm text-muted">
              Keep it
            </button>
          </>
        ) : (
          saved && (
            <button type="button" onClick={() => setConfirmDelete(true)} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-error">
              <Trash2 aria-hidden className="size-4" /> Delete booking
            </button>
          )
        )}
      </div>

      {/* Save bar, always in reach on long bookings. */}
      <div className="sticky bottom-[calc(var(--tabbar-h)+env(safe-area-inset-bottom)+0.75rem)] z-30 lg:bottom-4">
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface/95 p-3 shadow-lg backdrop-blur-md">
          <Button type="button" onClick={() => void save()} loading={busy} loadingLabel="Saving…" disabled={!dirty && saved}>
            {saved ? "Save changes" : "Create booking"}
          </Button>
          <span className="min-w-0 flex-1 text-sm text-muted">
            {notice ? <span className={notice.kind === "error" ? "text-error" : ""}>{notice.text}</span> : dirty ? "Unsaved changes" : "All changes saved"}
          </span>
        </div>
      </div>
    </div>
  );
}

function Sub({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted">{title}</h3>
      {children}
    </div>
  );
}

function NumberField({ id, label, value, onChange }: { id: string; label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label htmlFor={id} className="block text-sm">
      <span className="font-medium">{label}</span>
      <input id={id} inputMode="numeric" value={value ? String(value) : ""} placeholder="0" onChange={(e) => onChange(Number(e.target.value.replace(/\D/g, "")) || 0)} className={cn(input, "tabular mt-2")} />
    </label>
  );
}
