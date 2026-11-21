"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeftIcon as ArrowLeft, CircleNotchIcon as Spinner, LockSimpleIcon as Lock } from "@phosphor-icons/react/dist/ssr";
import { buttonClasses } from "@/components/ui/Button";
import { confirmPayment } from "@/app/payments/actions";
import { brand, formatRupees } from "@/lib/brand";
import type { StartCheckoutResult } from "@/lib/checkout";
import { cn } from "@/lib/cn";

const control =
  "h-11 w-full rounded-lg border border-border-strong bg-surface px-3 body-6 text-fg transition-colors duration-300 hover:border-fg focus-visible:border-fg aria-invalid:border-error";

const SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";
/** Name, phone, email and address are remembered in this browser so a second payment is quicker. */
const SAVED = "zf-checkout-details";
const REMEMBER = ["name", "phone", "email", "address", "city", "pincode"];

type RazorpaySuccess = { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string };
type RazorpayFailure = { error?: { description?: string } };
type RazorpayInstance = { open(): void; on(event: "payment.failed", cb: (r: RazorpayFailure) => void): void };
declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

let loading: Promise<void> | null = null;
/** Loads Razorpay Checkout only when someone actually pays, so pages stay light. */
function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve();
  loading ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SCRIPT;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      loading = null;
      s.remove();
      reject(new Error("Razorpay did not load"));
    };
    document.head.appendChild(s);
  });
  return loading;
}

export type Field = {
  name: string;
  label: string;
  type?: "text" | "tel" | "email" | "date";
  autoComplete: string;
  inputMode?: "tel" | "numeric" | "email";
  optional?: boolean;
  /** Half width on the two-column grid. */
  half?: boolean;
  min?: string;
};

function initialValues(fields: Field[], defaults: Record<string, string>) {
  let saved: Record<string, unknown> = {};
  try {
    saved = JSON.parse(localStorage.getItem(SAVED) ?? "{}") as Record<string, unknown>;
  } catch {
    // Storage blocked: start empty.
  }
  return Object.fromEntries(
    fields.map((f) => {
      const v = saved[f.name];
      return [f.name, REMEMBER.includes(f.name) && typeof v === "string" && v ? v : (defaults[f.name] ?? "")];
    }),
  );
}

function remember(values: Record<string, string>) {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVED) ?? "{}") as Record<string, string>;
    for (const k of REMEMBER) if (values[k]) saved[k] = values[k];
    localStorage.setItem(SAVED, JSON.stringify(saved));
  } catch {
    // Storage blocked: details just aren't remembered for next time.
  }
}

export type PaidOrder = { paymentId: string; amount: number; name: string };

/**
 * The customer's details, then Razorpay Checkout. `start` asks the server to create the order: the
 * server sets the amount (from shop.json or the package list), never the browser. After payment the
 * server checks Razorpay's signature before anything counts as paid.
 */
export default function Checkout({
  fields,
  defaults = {},
  title,
  intro,
  amount,
  description,
  start,
  onBack,
  onPaying,
  onPaid,
  footnote,
}: {
  fields: Field[];
  defaults?: Record<string, string>;
  title: string;
  intro: ReactNode;
  /** In rupees, shown on the pay button. The server decides what is actually charged. */
  amount: number;
  /** Shown in the Razorpay window. */
  description: string;
  start: (values: Record<string, string>) => Promise<StartCheckoutResult>;
  onBack?: { label: string; onClick: () => void };
  /** Razorpay opens its own window, so a modal dialog has to step aside while it is open. */
  onPaying: (paying: boolean) => void;
  onPaid: (order: PaidOrder) => void;
  footnote?: ReactNode;
}) {
  const [values, setValues] = useState<Record<string, string>>(() => initialValues(fields, defaults));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function pay(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage("");
    setErrors({});
    try {
      const [order] = await Promise.all([start(values), loadRazorpay()]);
      if (!order.ok) {
        setErrors(order.errors ?? {});
        setMessage(order.message);
        setBusy(false);
        return;
      }
      remember(values);
      const Razorpay = window.Razorpay;
      if (!Razorpay) throw new Error("Razorpay did not load");

      let settled = false;
      const rzp = new Razorpay({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: brand.name,
        description,
        prefill: order.prefill,
        theme: { color: "#a8321f" },
        modal: {
          ondismiss: () => {
            if (settled) return;
            onPaying(false);
            setBusy(false);
            setMessage("Payment cancelled. Nothing was charged. You can try again or message us on WhatsApp.");
          },
        },
        handler: async (r: RazorpaySuccess) => {
          settled = true;
          const result = await confirmPayment({ orderId: r.razorpay_order_id, paymentId: r.razorpay_payment_id, signature: r.razorpay_signature }).catch(() => ({
            ok: false as const,
            message: `We couldn't confirm the payment. If money left your account, message us on WhatsApp at ${brand.whatsapp} or email ${brand.supportEmail}. Your payment ID is ${r.razorpay_payment_id}.`,
          }));
          onPaying(false);
          setBusy(false);
          if (result.ok) onPaid({ paymentId: result.paymentId, amount: result.amount || order.amount, name: order.prefill.name });
          else setMessage(result.message);
        },
      });
      rzp.on("payment.failed", (r) => {
        setMessage(`${r.error?.description ?? "The payment failed."} Nothing was charged. Please try again or use another method.`);
      });
      onPaying(true);
      rzp.open();
    } catch {
      onPaying(false);
      setBusy(false);
      setMessage("We couldn't open the payment window. Check your connection and try again, or message us on WhatsApp.");
    }
  }

  return (
    <form onSubmit={pay} noValidate className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {onBack && (
          <button type="button" onClick={onBack.onClick} className="inline-flex min-h-11 items-center gap-2 button-sm text-muted transition-colors hover:text-fg">
            <ArrowLeft aria-hidden className="size-4" />
            {onBack.label}
          </button>
        )}
        <h3 className={cn("title-2", onBack && "mt-2")}>{title}</h3>
        <div className="mt-1 caption-2 text-muted">{intro}</div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {fields.map((f) => {
            const id = `checkout-${f.name}`;
            const error = errors[f.name];
            return (
              <div key={f.name} className={f.half ? "col-span-1" : "col-span-2"}>
                <label htmlFor={id} className="caption-4 text-muted">
                  {f.label}
                  {f.optional && " (optional)"}
                </label>
                <input
                  id={id}
                  name={f.name}
                  type={f.type ?? "text"}
                  inputMode={f.inputMode}
                  autoComplete={f.autoComplete}
                  min={f.min}
                  required={!f.optional}
                  value={values[f.name] ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                  aria-invalid={!!error || undefined}
                  aria-describedby={error ? `${id}-error` : undefined}
                  className={cn(control, "mt-1")}
                />
                {error && (
                  <p id={`${id}-error`} className="mt-1 caption-3 text-error">
                    {error}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-border px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-4">
        {message && (
          <p role="alert" className="mb-3 rounded-lg border border-border bg-sand-soft px-3 py-2 caption-2">
            {message}
          </p>
        )}
        <button type="submit" disabled={busy} className={buttonClasses({ size: "lg", className: "w-full" })} data-track="checkout_start">
          {busy ? <Spinner aria-hidden className="size-5 animate-spin" /> : <Lock aria-hidden weight="bold" className="size-5" />}
          {busy ? "Opening secure payment" : `Pay ${formatRupees(amount)}`}
        </button>
        <p className="mt-2 text-center caption-3 text-muted">{footnote ?? "Secure payment by Razorpay: UPI, cards, netbanking and wallets."}</p>
      </div>
    </form>
  );
}
