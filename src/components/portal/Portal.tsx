"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  CalendarDays,
  Camera,
  Check,
  CircleAlert,
  ClipboardList,
  Clock,
  Download,
  ExternalLink,
  FileSignature,
  Film,
  Images,
  LoaderCircle,
  LogOut,
  MapPin,
  MessageCircle,
  NotebookPen,
  Phone,
  Play,
  Printer,
  ReceiptText,
  Wallet,
  X,
  BookOpen,
  PartyPopper,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/forms/Field";
import RowsEditor from "@/components/forms/RowsEditor";
import { bookingFields, blanks } from "@/components/forms/booking-fields";
import SignaturePad from "@/components/portal/SignaturePad";
import UpiQr from "@/components/portal/UpiQr";
import Invoice from "@/components/portal/Invoice";
import { bookingSchema, deliveryNames, money, stage, type Booking, type Planning } from "@/lib/booking";
import { callSheet } from "@/lib/sheet";
import { dataEndpoint, settings } from "@/lib/settings";
import { brand, formatRupees, mailHref, telHref } from "@/lib/data";
import { parseYouTubeId, youtubeThumb } from "@/lib/youtube";
import { cn } from "@/lib/cn";

const STORE = "zf-portal";
type Auth = { code: string; pin: string };
type Tab = "booking" | "planning" | "day" | "delivery";

const tabs: { id: Tab; label: string; icon: typeof Wallet }[] = [
  { id: "booking", label: "Booking", icon: ReceiptText },
  { id: "planning", label: "Planning", icon: NotebookPen },
  { id: "day", label: "Wedding day", icon: CalendarDays },
  { id: "delivery", label: "Delivery", icon: Images },
];

const longDate = (iso: string, opts: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "long", year: "numeric" }) => {
  const t = Date.parse(iso);
  return Number.isNaN(t) ? iso : new Date(t).toLocaleDateString("en-IN", opts);
};

const whatsapp = (phone: string) => {
  let d = phone.replace(/\D/g, "");
  if (d.length === 10) d = `91${d}`;
  return d.length >= 11 ? `https://wa.me/${d}` : null;
};

function readAuth(): Auth | null {
  try {
    const raw = localStorage.getItem(STORE) ?? sessionStorage.getItem(STORE);
    return raw ? (JSON.parse(raw) as Auth) : null;
  } catch {
    return null;
  }
}
function writeAuth(auth: Auth | null, remember = true) {
  try {
    localStorage.removeItem(STORE);
    sessionStorage.removeItem(STORE);
    if (auth) (remember ? localStorage : sessionStorage).setItem(STORE, JSON.stringify(auth));
  } catch {
    // Private browsing: the client signs in again next time.
  }
}

const errorText = (code?: string) =>
  code === "wrong"
    ? "That booking code and PIN don't match. Check the message we sent you."
    : code === "too-many"
      ? "Too many tries. Please wait 15 minutes and try again, or call us."
      : code || "Something went wrong. Please try again.";

/** The client portal: everything about one booking, for the couple, after they book. */
export default function Portal() {
  const [auth, setAuth] = useState<Auth | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [signature, setSignature] = useState("");
  const [checking, setChecking] = useState(false);
  const [restoring, setRestoring] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("booking");

  const apply = (result: { booking?: unknown; signature?: string }) => {
    const parsed = bookingSchema.safeParse(result.booking);
    if (!parsed.success) throw new Error("This booking could not be read. Please call us.");
    setBooking(parsed.data);
    setSignature(result.signature ?? "");
  };

  const call = useCallback(
    async (body: object) => {
      if (!dataEndpoint || !auth) throw new Error("Not signed in");
      const result = await callSheet<{ booking?: unknown; signature?: string }>(dataEndpoint, { ...body, ...auth });
      if (!result.ok) throw new Error(errorText(result.error));
      apply(result);
    },
    [auth],
  );

  const login = useCallback(async (next: Auth, remember: boolean) => {
    if (!dataEndpoint) return;
    setChecking(true);
    setError(null);
    try {
      const result = await callSheet<{ booking?: unknown; signature?: string }>(dataEndpoint, { type: "portal-login", ...next });
      if (!result.ok) throw new Error(errorText(result.error));
      apply(result);
      writeAuth(next, remember);
      setAuth(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      if (err instanceof Error && /match/.test(err.message)) writeAuth(null);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    const saved = readAuth();
    // Restoring a saved sign-in reads browser storage and calls the studio's sheet, so it waits for mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved && dataEndpoint) void login(saved, true).finally(() => setRestoring(false));
    else setRestoring(false);
  }, [login]);

  if (!dataEndpoint) {
    return (
      <Shell>
        <p className="max-w-[48ch] text-lead text-muted">
          The client portal opens once your booking is set up. Until then, reach us at{" "}
          <a href={telHref} className="link-underline text-fg">
            {brand.phone}
          </a>
          .
        </p>
      </Shell>
    );
  }

  if (restoring && !booking) {
    return (
      <Shell>
        <p className="flex items-center gap-2 text-muted" role="status">
          <LoaderCircle aria-hidden className="size-4 animate-spin" /> Opening your booking…
        </p>
      </Shell>
    );
  }

  if (!booking || !auth) return <Login onLogin={login} error={error} busy={checking} />;

  const signOut = () => {
    writeAuth(null);
    setAuth(null);
    setBooking(null);
  };

  return (
    <div className="pb-10">
      <Header b={booking} onSignOut={signOut} />
      <nav aria-label="Portal sections" className="sticky top-[calc(env(safe-area-inset-top)+3.25rem)] z-30 -mx-4 mt-6 bg-bg/85 px-4 py-2 backdrop-blur-md sm:mx-0 sm:px-0 lg:top-16">
        <div role="tablist" className="grid grid-cols-4 gap-1 rounded-full border border-border bg-surface p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={tab === t.id}
              onClick={() => {
                setTab(t.id);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-full px-1 py-2 text-[0.6875rem] font-medium transition-colors sm:flex-row sm:justify-center sm:gap-2 sm:text-sm",
                tab === t.id ? "bg-fg text-bg" : "text-muted hover:text-fg",
              )}
            >
              <t.icon aria-hidden className="size-4" />
              {t.label}
            </button>
          ))}
        </div>
      </nav>
      <div key={tab} className="portal-panel mt-6" role="tabpanel">
        {tab === "booking" && <BookingTab b={booking} signature={signature} call={call} />}
        {tab === "planning" && <PlanningTab b={booking} call={call} />}
        {tab === "day" && <DayTab b={booking} />}
        {tab === "delivery" && <DeliveryTab b={booking} />}
      </div>
    </div>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <div>
      <p className="label text-muted">
        <span aria-hidden className="label-dot festive-gradient" />
        Client portal
      </p>
      <h1 className="mt-4 font-display text-h2">
        My <em>wedding.</em>
      </h1>
      <div className="mt-8">{children}</div>
    </div>
  );
}

function Login({ onLogin, error, busy }: { onLogin: (a: Auth, remember: boolean) => void; error: string | null; busy: boolean }) {
  const [code, setCode] = useState("ZF-");
  const [pin, setPin] = useState("");
  const [remember, setRemember] = useState(true);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onLogin({ code: code.trim().toUpperCase(), pin: pin.trim() }, remember);
  };
  return (
    <Shell>
      <form onSubmit={submit} className="max-w-md space-y-5 rounded-lg border border-border bg-surface p-6 sm:p-8">
        <p className="text-sm text-muted">Sign in with the booking code and PIN we sent you on WhatsApp or email.</p>
        <TextField id="portal-code" label="Booking code" autoCapitalize="characters" autoComplete="username" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} required />
        <TextField id="portal-pin" label="PIN" type="password" inputMode="numeric" autoComplete="current-password" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))} error={error ?? undefined} required />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="size-4 accent-[var(--rani)]" />
          Keep me signed in on this device
        </label>
        <Button type="submit" loading={busy} loadingLabel="Opening…" className="w-full">
          Open my booking
        </Button>
        <p className="text-sm text-muted">
          Lost your PIN?{" "}
          <a href={whatsapp(brand.phone) ?? telHref} className="link-underline text-fg">
            Message us
          </a>{" "}
          and we&apos;ll send a new one.
        </p>
      </form>
    </Shell>
  );
}

function Header({ b, onSignOut }: { b: Booking; onSignOut: () => void }) {
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => {
    const t = Date.parse(b.eventDate);
    // The countdown depends on today's date, which is only known in the browser.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!Number.isNaN(t)) setDays(Math.ceil((t - new Date().setHours(0, 0, 0, 0)) / 86_400_000));
  }, [b.eventDate]);
  return (
    <header className="relative overflow-hidden rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <div aria-hidden className="festive-gradient absolute inset-x-0 top-0 h-1" />
      <div className="flex items-start justify-between gap-4">
        <p className="label text-muted">My wedding</p>
        <button type="button" onClick={onSignOut} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg">
          <LogOut aria-hidden className="size-4" /> Sign out
        </button>
      </div>
      <h1 className="mt-3 font-display text-h2">{b.title || b.client.names}</h1>
      <p className="mt-2 text-muted">{b.eventDate ? longDate(b.eventDate) : "Date to be confirmed"}</p>
      {days !== null && days >= 0 && (
        <p className="mt-5 inline-flex items-baseline gap-2 rounded-full bg-fg/[0.05] px-4 py-2">
          <span className="tabular font-display text-3xl leading-none">{days}</span>
          <span className="text-sm text-muted">{days === 1 ? "day to go" : days === 0 ? "It's today!" : "days to go"}</span>
        </p>
      )}
    </header>
  );
}

/* ───────────── Booking ───────────── */

function BookingTab({ b, signature, call }: { b: Booking; signature: string; call: (body: object) => Promise<void> }) {
  const m = money(b);
  const s = stage(b);
  const [agreementOpen, setAgreementOpen] = useState(false);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [payFor, setPayFor] = useState<number | null>(null);

  const steps = [
    { label: "Review agreement", done: !!b.contract.signed || agreementOpen },
    { label: "Sign", done: !!b.contract.signed },
    { label: "Pay advance", done: s === "verifying" || s === "confirmed" },
    { label: "Booking confirmed", done: s === "confirmed" },
  ];
  const current = steps.findIndex((x) => !x.done);

  return (
    <div className="space-y-5">
      <Card>
        <ol className="grid grid-cols-4 gap-2" aria-label="Booking steps">
          {steps.map((step, i) => (
            <li key={step.label} className="flex flex-col items-center text-center">
              <span
                className={cn(
                  "grid size-9 place-items-center rounded-full border text-sm font-medium transition-colors",
                  step.done ? "border-transparent bg-success text-white" : i === current ? "border-fg text-fg" : "border-border text-muted",
                )}
              >
                {step.done ? <Check aria-hidden className="size-4" /> : i + 1}
              </span>
              <span className={cn("mt-2 text-[0.6875rem] leading-tight sm:text-xs", step.done || i === current ? "text-fg" : "text-muted")}>{step.label}</span>
            </li>
          ))}
        </ol>

        <div className="mt-6 border-t border-border pt-6">
          {s === "agreement" && (
            <NextStep icon={<FileSignature className="size-6" />} title="Review and sign your agreement" text="Read through the terms of your booking, then sign with your finger.">
              <Button type="button" onClick={() => setAgreementOpen(true)} disabled={!b.contract.text}>
                {b.contract.text ? "Review agreement" : "Agreement coming soon"}
              </Button>
            </NextStep>
          )}
          {s === "payment" && (
            <NextStep icon={<Wallet className="size-6" />} title={`Pay the advance of ${formatRupees(m.advanceDue)}`} text="The advance reserves your date. Pay by UPI, then tell us the payment reference.">
              <Button type="button" onClick={() => setPayFor(m.advanceDue)}>
                Pay advance
              </Button>
            </NextStep>
          )}
          {s === "verifying" && (
            <NextStep icon={<Clock className="size-6" />} title="We're checking your payment" text="As soon as it reaches our account, your booking is confirmed. This usually takes a few hours." />
          )}
          {s === "confirmed" && (
            <NextStep icon={<PartyPopper className="size-6 text-[var(--rani)]" />} title="Your date is booked!" text="Thank you. Now let's plan: add your timeline, venues and family details in Planning.">
              {m.balance > 0 && (
                <Button type="button" variant="secondary" onClick={() => setPayFor(m.balance)}>
                  Pay balance {formatRupees(m.balance)}
                </Button>
              )}
            </NextStep>
          )}
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        <Card title="Package" icon={<Camera className="size-4" />}>
          <p className="font-medium">{b.package.name || "Your package"}</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {b.package.items.map((i, n) => (
              <li key={n} className="flex gap-2">
                <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-success" /> {i.label}
              </li>
            ))}
          </ul>
          {b.package.notes && <p className="mt-3 text-sm text-muted">{b.package.notes}</p>}
        </Card>

        <Card title="Payment status" icon={<Wallet className="size-4" />}>
          <div className="tabular space-y-1.5 text-sm">
            <Line label="Total, with GST" value={formatRupees(m.total)} />
            <Line label="Received" value={formatRupees(m.paid)} />
            {m.claimed > 0 && <Line label="Being checked" value={formatRupees(m.claimed)} />}
            <Line label="Balance" value={formatRupees(m.balance)} strong />
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-fg/[0.08]">
            <div className="festive-gradient h-full rounded-full transition-[width] duration-700" style={{ width: `${m.total ? Math.min(100, (m.paid / m.total) * 100) : 0}%` }} />
          </div>
          {b.payments.length > 0 && (
            <ul className="mt-4 space-y-1 text-sm text-muted">
              {b.payments.map((p) => (
                <li key={p.id} className="flex justify-between gap-3">
                  <span>
                    {new Date(p.at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {p.reference || p.method}
                  </span>
                  <span className={cn("tabular", p.status === "confirmed" ? "text-success" : "")}>
                    {formatRupees(p.amount)} {p.status === "confirmed" ? "✓" : "· checking"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Agreement" icon={<FileSignature className="size-4" />}>
          {b.contract.signed ? (
            <>
              <p className="text-sm">
                Signed by <b>{b.contract.signed.name}</b> on {new Date(b.contract.signed.at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}.
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element -- the client's own drawn signature */}
              {signature && <img src={signature} alt="Your signature" className="mt-3 h-16 rounded border border-border bg-white p-1" />}
            </>
          ) : (
            <p className="text-sm text-muted">Not signed yet.</p>
          )}
          <button type="button" onClick={() => setAgreementOpen(true)} disabled={!b.contract.text} className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-2 hover:underline disabled:opacity-50">
            <BookOpen aria-hidden className="size-4" /> {b.contract.signed ? "Read the signed agreement" : "Review agreement"}
          </button>
        </Card>

        <Card title="Invoice" icon={<ReceiptText className="size-4" />}>
          <p className="text-sm text-muted">
            Invoice {b.code}-INV for {formatRupees(m.total)}, including GST.
          </p>
          <button type="button" onClick={() => setInvoiceOpen(true)} className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-2 hover:underline">
            <ReceiptText aria-hidden className="size-4" /> View or download invoice
          </button>
        </Card>
      </div>

      {agreementOpen && <AgreementDialog b={b} signature={signature} call={call} onClose={() => setAgreementOpen(false)} />}
      {invoiceOpen && <InvoiceDialog b={b} onClose={() => setInvoiceOpen(false)} />}
      {payFor !== null && <PayDialog b={b} amount={payFor} call={call} onClose={() => setPayFor(null)} />}
    </div>
  );
}

function NextStep({ icon, title, text, children }: { icon: ReactNode; title: string; text: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <span aria-hidden className="grid size-12 shrink-0 place-items-center rounded-2xl bg-fg/[0.05]">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-display text-2xl leading-tight">{title}</p>
        <p className="mt-1 text-sm text-muted">{text}</p>
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
}

function Card({ title, icon, children }: { title?: string; icon?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      {title && (
        <h2 className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted">
          {icon && <span aria-hidden>{icon}</span>}
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

function Line({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <p className={cn("flex justify-between gap-4", strong && "border-t border-border pt-1.5 font-semibold")}>
      <span className={strong ? "" : "text-muted"}>{label}</span>
      <span>{value}</span>
    </p>
  );
}

/** A full-screen sheet on phones and a centred panel on computers. */
function Sheet({ title, onClose, children, footer }: { title: string; onClose: () => void; children: ReactNode; footer?: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-label={title}
      className="sheet m-0 h-dvh max-h-none w-screen max-w-none bg-bg p-0 text-fg backdrop:bg-black/50 sm:m-auto sm:h-[min(90dvh,56rem)] sm:max-w-2xl sm:rounded-2xl sm:border sm:border-border"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-border px-5 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <h2 className="font-display text-2xl">{title}</h2>
          <button type="button" onClick={() => ref.current?.close()} aria-label="Close" className="grid size-10 place-items-center rounded-full hover:bg-fg/[0.06]">
            <X aria-hidden className="size-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">{children}</div>
        {footer && <div className="border-t border-border px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">{footer}</div>}
      </div>
    </dialog>
  );
}

function AgreementDialog({ b, signature, call, onClose }: { b: Booking; signature: string; call: (body: object) => Promise<void>; onClose: () => void }) {
  const signed = b.contract.signed;
  const [agree, setAgree] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [state, setState] = useState<{ busy?: boolean; error?: string }>({});

  const sign = async () => {
    if (!agree || !name.trim() || !image) {
      setState({ error: "Tick the box, type your full name and draw your signature." });
      return;
    }
    setState({ busy: true });
    try {
      await call({ type: "portal-sign", name: name.trim(), image });
      onClose();
    } catch (err) {
      setState({ error: err instanceof Error ? err.message : String(err) });
    }
  };

  return (
    <Sheet title={signed ? "Signed agreement" : "Your agreement"} onClose={onClose}>
      <pre className="whitespace-pre-wrap font-sans text-[0.9375rem] leading-relaxed">{signed ? signed.text : b.contract.text}</pre>
      {signed ? (
        <div className="mt-8 border-t border-border pt-5 text-sm">
          {/* eslint-disable-next-line @next/next/no-img-element -- the client's own drawn signature */}
          {signature && <img src={signature} alt="Signature" className="h-20 rounded border border-border bg-white p-1" />}
          <p className="mt-2">
            Signed by <b>{signed.name}</b>, {new Date(signed.at).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" })}
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-5 border-t border-border pt-6">
          <p className="font-display text-2xl">Sign</p>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 size-5 shrink-0 accent-[var(--rani)]" />
            I have read this agreement and agree to its terms.
          </label>
          <TextField id="sign-name" label="Your full name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
          <div>
            <p className="mb-2 text-sm font-medium">Your signature</p>
            <SignaturePad onChange={setImage} />
          </div>
          {state.error && (
            <p role="alert" className="flex items-start gap-2 text-sm text-error">
              <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" /> {state.error}
            </p>
          )}
          <Button type="button" onClick={() => void sign()} loading={state.busy} loadingLabel="Signing…" className="w-full sm:w-auto">
            <FileSignature aria-hidden className="size-4" /> Sign agreement
          </Button>
          <p className="text-xs text-muted">Your name, signature and the time are saved with this copy of the agreement.</p>
        </div>
      )}
    </Sheet>
  );
}

function InvoiceDialog({ b, onClose }: { b: Booking; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // The printable copy is placed straight under <body>, which exists only in the browser.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const done = () => document.documentElement.classList.remove("printing");
    window.addEventListener("afterprint", done);
    return () => {
      window.removeEventListener("afterprint", done);
      done();
    };
  }, []);
  const print = () => {
    document.documentElement.classList.add("printing");
    window.print();
  };
  return (
    <Sheet
      title="Invoice"
      onClose={onClose}
      footer={
        <Button type="button" onClick={print} className="w-full sm:w-auto">
          <Printer aria-hidden className="size-4" /> Print or save as PDF
        </Button>
      }
    >
      <div className="overflow-hidden rounded-lg border border-border">
        <Invoice b={b} />
      </div>
      {mounted &&
        createPortal(
          <div className="print-only">
            <Invoice b={b} />
          </div>,
          document.body,
        )}
    </Sheet>
  );
}

function PayDialog({ b, amount, call, onClose }: { b: Booking; amount: number; call: (body: object) => Promise<void>; onClose: () => void }) {
  const [paid, setPaid] = useState(String(amount));
  const [reference, setReference] = useState("");
  const [state, setState] = useState<{ busy?: boolean; error?: string }>({});
  const upi = settings.upiId
    ? // Built by hand: some UPI apps reject an encoded "@" or "+" for spaces.
      `upi://pay?pa=${settings.upiId}&pn=${encodeURIComponent(settings.upiName || brand.name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`${b.code} ${b.title}`.slice(0, 50))}`
    : null;

  const report = async () => {
    if (!Number(paid) || reference.trim().length < 4) {
      setState({ error: "Enter the amount you paid and the UPI reference (UTR) from your payment app." });
      return;
    }
    setState({ busy: true });
    try {
      await call({ type: "portal-paid", amount: Number(paid), reference: reference.trim() });
      onClose();
    } catch (err) {
      setState({ error: err instanceof Error ? err.message : String(err) });
    }
  };

  return (
    <Sheet title="Pay by UPI" onClose={onClose}>
      <div className="space-y-6">
        <div className="rounded-2xl bg-fg/[0.04] p-5 text-center">
          <p className="text-sm text-muted">Amount</p>
          <p className="tabular mt-1 font-display text-5xl">{formatRupees(amount)}</p>
          {settings.upiId && <p className="mt-2 text-sm text-muted">to {settings.upiName || brand.name} · {settings.upiId}</p>}
        </div>

        {upi ? (
          <div className="grid items-center gap-6 sm:grid-cols-2">
            <div className="space-y-3">
              <p className="font-medium">1. Pay</p>
              <a href={upi} className="flex h-13 w-full items-center justify-center gap-2 rounded-md bg-primary px-5 font-medium text-primary-fg">
                <Wallet aria-hidden className="size-5" /> Open my UPI app
              </a>
              <p className="text-sm text-muted">Opens Google Pay, PhonePe, Paytm or your bank app with the amount filled in. On a computer, scan the code with your phone.</p>
            </div>
            <UpiQr link={upi} className="mx-auto w-48 rounded-lg border border-border bg-white p-2 [&_svg]:h-auto [&_svg]:w-full" />
          </div>
        ) : (
          <p className="text-sm">
            Pay by UPI or bank transfer using the details we sent you, or call{" "}
            <a href={telHref} className="link-underline">
              {brand.phone}
            </a>
            .
          </p>
        )}

        <div className="space-y-4 border-t border-border pt-6">
          <p className="font-medium">2. Tell us you&apos;ve paid</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField id="paid-amount" label="Amount paid (₹)" inputMode="numeric" value={paid} onChange={(e) => setPaid(e.target.value.replace(/\D/g, ""))} />
            <TextField id="paid-ref" label="UPI reference (UTR)" placeholder="12-digit number in your app" value={reference} onChange={(e) => setReference(e.target.value)} />
          </div>
          {state.error && (
            <p role="alert" className="flex items-start gap-2 text-sm text-error">
              <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" /> {state.error}
            </p>
          )}
          <Button type="button" onClick={() => void report()} loading={state.busy} loadingLabel="Sending…" className="w-full sm:w-auto">
            I&apos;ve paid
          </Button>
          <p className="text-xs text-muted">We confirm your booking once the payment reaches our account.</p>
        </div>
      </div>
    </Sheet>
  );
}

/* ───────────── Planning ───────────── */

function PlanningTab({ b, call }: { b: Booking; call: (body: object) => Promise<void> }) {
  const [draft, setDraft] = useState<Planning>(b.planning);
  const [dirty, setDirty] = useState(false);
  const [state, setState] = useState<{ busy?: boolean; error?: string; saved?: boolean }>({});
  const set = <K extends keyof Planning>(key: K, rows: Planning[K]) => {
    setDraft((d) => ({ ...d, [key]: rows }));
    setDirty(true);
    setState({});
  };
  const save = async () => {
    setState({ busy: true });
    try {
      await call({ type: "portal-planning", planning: draft });
      setDirty(false);
      setState({ saved: true });
    } catch (err) {
      setState({ error: err instanceof Error ? err.message : String(err) });
    }
  };
  const sections: { key: keyof Planning; title: string; icon: ReactNode; text: string; add: string; blank: () => Planning[keyof Planning][number] }[] = [
    { key: "timeline", title: "Timeline", icon: <Clock className="size-4" />, text: "Every function, with dates and times, so we are always in the right place.", add: "Add a function", blank: blanks.timeline },
    { key: "venues", title: "Venues", icon: <MapPin className="size-4" />, text: "Where each function happens. A Google Maps link helps the team find it.", add: "Add a venue", blank: blanks.venues },
    { key: "shots", title: "Shot list", icon: <ClipboardList className="size-4" />, text: "Photos you'd love us not to miss: people, moments, details.", add: "Add a shot", blank: () => ({ text: "", by: "You" }) },
    { key: "family", title: "Family details", icon: <MessageCircle className="size-4" />, text: "Close family we should know, and someone we can call on the day.", add: "Add a person", blank: blanks.family },
  ];
  return (
    <div className="space-y-5 pb-24">
      {sections.map((s) => (
        <Card key={s.key} title={s.title} icon={s.icon}>
          <p className="-mt-2 mb-4 text-sm text-muted">{s.text}</p>
          <RowsEditor
            label={s.title}
            fields={bookingFields[s.key]}
            rows={draft[s.key] as Record<string, string>[]}
            blank={s.blank as () => Record<string, string>}
            addLabel={s.add}
            onChange={(rows) => set(s.key, rows as never)}
          />
        </Card>
      ))}
      <div className="sticky bottom-[calc(var(--tabbar-h)+env(safe-area-inset-bottom)+0.75rem)] z-20 lg:bottom-4">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface/95 p-3 shadow-lg backdrop-blur-md">
          <Button type="button" onClick={() => void save()} loading={state.busy} loadingLabel="Saving…" disabled={!dirty}>
            Save plans
          </Button>
          <span className={cn("text-sm", state.error ? "text-error" : "text-muted")}>
            {state.error ?? (dirty ? "Unsaved changes" : state.saved ? "Saved. We can see it now." : "Everything is saved")}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ───────────── Wedding day ───────────── */

function DayTab({ b }: { b: Booking }) {
  const byDate = new Map<string, Booking["schedule"]>();
  for (const s of [...b.schedule].sort((x, y) => `${x.date}${x.time}`.localeCompare(`${y.date}${y.time}`))) {
    byDate.set(s.date, [...(byDate.get(s.date) ?? []), s]);
  }
  return (
    <div className="space-y-5">
      <Card title="Your team" icon={<Camera className="size-4" />}>
        {b.team.length === 0 ? (
          <p className="text-sm text-muted">We&apos;ll add your photographers and filmmakers here closer to the day.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {b.team.map((t, i) => (
              <li key={i} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <span aria-hidden className="festive-gradient grid size-11 shrink-0 place-items-center rounded-full font-medium text-white">
                  {t.name.trim().charAt(0).toUpperCase() || "?"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{t.name}</p>
                  <p className="truncate text-sm text-muted">{t.role}</p>
                </div>
                {t.phone && (
                  <div className="flex gap-1">
                    <a href={`tel:${t.phone.replace(/[^\d+]/g, "")}`} aria-label={`Call ${t.name}`} className="grid size-10 place-items-center rounded-full border border-border hover:border-fg">
                      <Phone aria-hidden className="size-4" />
                    </a>
                    {whatsapp(t.phone) && (
                      <a href={whatsapp(t.phone)!} target="_blank" rel="noreferrer" aria-label={`WhatsApp ${t.name}`} className="grid size-10 place-items-center rounded-full border border-border hover:border-fg">
                        <MessageCircle aria-hidden className="size-4" />
                      </a>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Contact the studio" icon={<Phone className="size-4" />}>
        <div className="flex flex-wrap gap-2">
          <a href={telHref} className="inline-flex h-11 items-center gap-2 rounded-full border border-border-strong px-4 text-sm hover:border-fg">
            <Phone aria-hidden className="size-4" /> {brand.phone}
          </a>
          {whatsapp(brand.phone) && (
            <a href={whatsapp(brand.phone)!} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center gap-2 rounded-full border border-border-strong px-4 text-sm hover:border-fg">
              <MessageCircle aria-hidden className="size-4" /> WhatsApp
            </a>
          )}
          <a href={mailHref} className="inline-flex h-11 items-center gap-2 rounded-full border border-border-strong px-4 text-sm hover:border-fg">
            {brand.email}
          </a>
        </div>
      </Card>

      <Card title="Schedule" icon={<CalendarDays className="size-4" />}>
        {byDate.size === 0 ? (
          <p className="text-sm text-muted">Your day-by-day schedule appears here once we plan it together.</p>
        ) : (
          <div className="space-y-6">
            {[...byDate.entries()].map(([date, items]) => (
              <div key={date}>
                <p className="text-sm font-medium">{date ? longDate(date) : "Date to be set"}</p>
                <ol className="mt-3 space-y-0 border-l border-border pl-5">
                  {items.map((s, i) => (
                    <li key={i} className="relative pb-4 last:pb-0">
                      <span aria-hidden className="festive-gradient absolute -left-[1.6rem] top-1.5 size-2.5 rounded-full" />
                      <span className="tabular text-sm text-muted">{s.time}</span>
                      <p>{s.title}</p>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        )}
      </Card>

      {b.planning.venues.length > 0 && (
        <Card title="Venues" icon={<MapPin className="size-4" />}>
          <ul className="space-y-3">
            {b.planning.venues.map((v, i) => (
              <li key={i} className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">
                    {v.name} {v.event && <span className="text-sm font-normal text-muted">· {v.event}</span>}
                  </p>
                  <p className="text-sm text-muted">{v.address}</p>
                </div>
                {v.map && (
                  <a href={v.map} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-1 text-sm underline-offset-2 hover:underline">
                    Map <ExternalLink aria-hidden className="size-3.5" />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

/* ───────────── Delivery ───────────── */

const deliveryIcons = { teaser: Play, photos: Images, videos: Film, album: BookOpen };

function DeliveryTab({ b }: { b: Booking }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {b.delivery.map((d) => {
        const Icon = deliveryIcons[d.kind];
        const yt = d.url ? parseYouTubeId(d.url) : null;
        const ready = d.status === "Ready";
        return (
          <Card key={d.kind}>
            <div className="flex items-start justify-between gap-3">
              <p className="flex items-center gap-2 font-display text-2xl">
                <Icon aria-hidden className="size-5 text-muted" /> {deliveryNames[d.kind]}
              </p>
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs",
                  ready ? "bg-success/15 text-success" : d.status === "In progress" ? "bg-[var(--marigold-glow)]/20 text-[var(--marigold)]" : "bg-fg/[0.06] text-muted",
                )}
              >
                {d.status}
              </span>
            </div>
            {yt && ready && (
              <a href={d.url} target="_blank" rel="noreferrer" className="group relative mt-4 block overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element -- YouTube's own thumbnail */}
                <img src={youtubeThumb(yt)} alt="" className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute inset-0 grid place-items-center bg-black/25">
                  <span className="grid size-14 place-items-center rounded-full bg-white/90 text-black">
                    <Play aria-hidden className="ml-0.5 size-6 fill-current" />
                  </span>
                </span>
              </a>
            )}
            {!ready && d.expected && <p className="mt-3 text-sm text-muted">Expected by {longDate(d.expected, { day: "numeric", month: "long" })}</p>}
            {d.note && <p className="mt-3 text-sm">{d.note}</p>}
            {d.url && ready ? (
              <a href={d.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex h-11 items-center gap-2 rounded-md bg-fg px-4 text-sm font-medium text-bg">
                {d.kind === "photos" ? <Download aria-hidden className="size-4" /> : <ExternalLink aria-hidden className="size-4" />}
                {d.kind === "photos" ? "Open your gallery" : d.kind === "album" ? "See the album" : "Watch now"}
              </a>
            ) : (
              !d.note && !d.expected && <p className="mt-3 text-sm text-muted">We&apos;ll let you know here as soon as it&apos;s ready.</p>
            )}
          </Card>
        );
      })}
    </div>
  );
}
