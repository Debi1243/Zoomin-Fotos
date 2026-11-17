"use client";

import { useState, type FormEvent } from "react";
import { ArrowLeftIcon as ArrowLeft, CircleNotchIcon as Spinner, LockSimpleIcon as Lock } from "@phosphor-icons/react/dist/ssr";
import { buttonClasses } from "@/components/ui/Button";
import { confirmPayment, startCheckout } from "@/app/shop/actions";
import { brand, formatRupees } from "@/lib/brand";
import { emptyCustomer, type Customer, type CustomerErrors, type CustomerField } from "@/lib/checkout";
import { cn } from "@/lib/cn";
import type { CartLine } from "./cart-store";

const control =
  "h-11 w-full rounded-lg border border-border-strong bg-surface px-3 body-6 text-fg transition-colors duration-300 hover:border-fg focus-visible:border-fg aria-invalid:border-error";

const SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";
const SAVED = "zf-checkout-details";

type RazorpaySuccess = { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string };
type RazorpayFailure = { error?: { description?: string } };
type RazorpayInstance = { open(): void; on(event: "payment.failed", cb: (r: RazorpayFailure) => void): void };
declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

let loading: Promise<void> | null = null;
/** Loads Razorpay Checkout only when someone actually pays, so the shop page stays light. */
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

function savedDetails(): Customer {
  try {
    const parsed = JSON.parse(localStorage.getItem(SAVED) ?? "{}") as Partial<Customer>;
    return { ...emptyCustomer, ...Object.fromEntries(Object.entries(parsed).filter(([, v]) => typeof v === "string")), note: "" };
  } catch {
    return emptyCustomer;
  }
}

const fields: { name: CustomerField; label: string; type?: string; autoComplete: string; inputMode?: "tel" | "numeric" | "email"; optional?: boolean; wide?: boolean }[] = [
  { name: "name", label: "Full name", autoComplete: "name", wide: true },
  { name: "phone", label: "Mobile number", type: "tel", autoComplete: "tel", inputMode: "tel" },
  { name: "email", label: "Email", type: "email", autoComplete: "email", inputMode: "email", optional: true },
  { name: "address", label: "House, street and area", autoComplete: "street-address", wide: true },
  { name: "city", label: "City", autoComplete: "address-level2" },
  { name: "pincode", label: "PIN code", autoComplete: "postal-code", inputMode: "numeric" },
  { name: "note", label: "Anything we should know", autoComplete: "off", optional: true, wide: true },
];

export type PaidOrder = { paymentId: string; amount: number; name: string };

/**
 * Delivery details, then Razorpay Checkout. The amount comes from the server, which prices the
 * cart from shop.json; the server also checks Razorpay's signature before the order counts as paid.
 */
export default function Checkout({
  lines,
  total,
  onBack,
  onPaying,
  onPaid,
}: {
  lines: CartLine[];
  total: number;
  onBack: () => void;
  /** Razorpay opens its own window, so the cart steps aside while it is open. */
  onPaying: (paying: boolean) => void;
  onPaid: (order: PaidOrder) => void;
}) {
  const [values, setValues] = useState<Customer>(savedDetails);
  const [errors, setErrors] = useState<CustomerErrors>({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function pay(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage("");
    setErrors({});
    try {
      const [order] = await Promise.all([startCheckout({ lines, customer: values }), loadRazorpay()]);
      if (!order.ok) {
        setErrors(order.errors ?? {});
        setMessage(order.message);
        setBusy(false);
        return;
      }
      try {
        localStorage.setItem(SAVED, JSON.stringify({ ...order.customer, note: "" }));
      } catch {
        // Storage blocked: details just aren't remembered for next time.
      }
      const Razorpay = window.Razorpay;
      if (!Razorpay) throw new Error("Razorpay did not load");

      let settled = false;
      const rzp = new Razorpay({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: brand.name,
        description: `Shop order, ${lines.reduce((n, l) => n + l.qty, 0)} item(s)`,
        prefill: { name: order.customer.name, email: order.customer.email, contact: order.customer.phone },
        theme: { color: "#a8321f" },
        modal: {
          ondismiss: () => {
            if (settled) return;
            onPaying(false);
            setBusy(false);
            setMessage("Payment cancelled. Nothing was charged. You can try again or send your order on WhatsApp.");
          },
        },
        handler: async (r: RazorpaySuccess) => {
          settled = true;
          const result = await confirmPayment({ orderId: r.razorpay_order_id, paymentId: r.razorpay_payment_id, signature: r.razorpay_signature }).catch(() => ({
            ok: false as const,
            message: `We couldn't confirm the payment. If money left your account, message us on WhatsApp at ${brand.whatsapp}. Your payment ID is ${r.razorpay_payment_id}.`,
          }));
          onPaying(false);
          setBusy(false);
          if (result.ok) onPaid({ paymentId: result.paymentId, amount: result.amount || order.amount, name: order.customer.name });
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
      setMessage("We couldn't open the payment window. Check your connection and try again, or send your order on WhatsApp.");
    }
  }

  return (
    <form onSubmit={pay} noValidate className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <button type="button" onClick={onBack} className="inline-flex min-h-11 items-center gap-2 button-sm text-muted transition-colors hover:text-fg">
          <ArrowLeft aria-hidden className="size-4" />
          Back to cart
        </button>
        <h3 className="mt-2 title-2">Delivery details</h3>
        <p className="mt-1 caption-2 text-muted">We call or WhatsApp you on this number to collect your photos and arrange delivery.</p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {fields.map((f) => {
            const id = `checkout-${f.name}`;
            const error = errors[f.name];
            return (
              <div key={f.name} className={cn(f.wide || f.name === "phone" || f.name === "email" ? "col-span-2" : "col-span-1")}>
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
                  required={!f.optional}
                  value={values[f.name]}
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
        <button type="submit" disabled={busy} className={buttonClasses({ size: "lg", className: "w-full" })} data-track="checkout_start" data-track-source="shop-cart">
          {busy ? <Spinner aria-hidden className="size-5 animate-spin" /> : <Lock aria-hidden weight="bold" className="size-5" />}
          {busy ? "Opening secure payment" : `Pay ${formatRupees(total)}`}
        </button>
        <p className="mt-2 text-center caption-3 text-muted">Secure payment by Razorpay: UPI, cards, netbanking and wallets.</p>
      </div>
    </form>
  );
}
