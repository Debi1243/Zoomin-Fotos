import { createHmac, timingSafeEqual } from "node:crypto";
import { products } from "./shop";
import { formatRupees } from "./brand";
import type { Booking, Customer } from "./checkout";

/**
 * Server-only Razorpay helpers. Never import this file from a client component.
 *
 * Keys come from the server's environment (deploy/.env on the server, see README):
 *   RAZORPAY_KEY_ID      rzp_test_... while testing, rzp_live_... once the account is activated
 *   RAZORPAY_KEY_SECRET  the matching secret. Never commit it.
 */

const API = "https://api.razorpay.com/v1";
const TIMEOUT_MS = 10000;
/** Razorpay's smallest order: ₹1, in paise. */
export const MIN_AMOUNT_PAISE = 100;

/** A failed Razorpay API call. `status` 401 means the Key ID / Key Secret pair is wrong or revoked. */
export class RazorpayError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "RazorpayError";
  }
}

export function razorpayKeys() {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  return keyId && keySecret ? { keyId, keySecret } : null;
}

type Keys = NonNullable<ReturnType<typeof razorpayKeys>>;

const auth = ({ keyId, keySecret }: Keys) => `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;

export type PricedLine = { id: string; name: string; option: string; qty: number; price: number };

/** Prices the cart from shop.json. Unknown products or sizes are an error, never a free item. */
export function priceCart(lines: { id: string; option: string; qty: number }[]) {
  const priced: PricedLine[] = [];
  for (const l of lines) {
    const product = products.find((p) => p.id === l.id);
    const option = product?.options.find((o) => o.label === l.option);
    if (!product || !option) return null;
    priced.push({ id: product.id, name: product.name, option: option.label, qty: l.qty, price: option.price });
  }
  const total = priced.reduce((sum, l) => sum + l.price * l.qty, 0);
  return { lines: priced, total };
}

const clip = (s: string) => s.slice(0, 256);

/** Razorpay keeps up to 15 notes of 256 characters each; the order is split across them. */
export function shopNotes(customer: Customer, lines: PricedLine[]) {
  const notes: Record<string, string> = {
    kind: "shop",
    name: clip(customer.name),
    phone: clip(customer.phone),
    email: clip(customer.email || "-"),
    address: clip(customer.address),
    city: clip(`${customer.city} ${customer.pincode}`),
    note: clip(customer.note || "-"),
  };
  const rows = lines.map((l) => `${l.qty} x ${l.name} (${l.option})`);
  let key = 1;
  let chunk = "";
  for (const row of rows) {
    if (chunk && `${chunk}; ${row}`.length > 256) {
      notes[`items_${key++}`] = chunk;
      chunk = "";
    }
    chunk = clip(chunk ? `${chunk}; ${row}` : row);
    if (key > 9) break;
  }
  if (chunk && key <= 9) notes[`items_${key}`] = chunk;
  return notes;
}

/** Notes for a package booking advance: who, which package, which date and where. */
export function bookingNotes(booking: Booking, pkg: { service: string; name: string; price: number }) {
  return {
    kind: "booking",
    name: clip(booking.name),
    phone: clip(booking.phone),
    email: clip(booking.email || "-"),
    package: clip(`${pkg.service}: ${pkg.name} (${formatRupees(pkg.price)} + GST)`),
    date: clip(booking.date),
    venue: clip(booking.venue),
    note: clip(booking.note || "-"),
  };
}

export type RazorpayOrder = { id: string; amount: number; amount_paid: number; currency: string; status: string; receipt?: string; notes: Record<string, string> };

export async function createOrder(keys: Keys, amountRupees: number, notes: Record<string, string>, receiptPrefix: string) {
  const res = await fetch(`${API}/orders`, {
    method: "POST",
    headers: { Authorization: auth(keys), "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: amountRupees * 100,
      currency: "INR",
      receipt: `${receiptPrefix}-${Date.now().toString(36)}`,
      notes,
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: "no-store",
  });
  if (!res.ok) throw new RazorpayError(`Razorpay order failed: ${res.status} ${(await res.text()).slice(0, 300)}`, res.status);
  return (await res.json()) as RazorpayOrder;
}

export async function fetchOrder(keys: Keys, orderId: string) {
  const res = await fetch(`${API}/orders/${encodeURIComponent(orderId)}`, {
    headers: { Authorization: auth(keys) },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: "no-store",
  });
  if (!res.ok) throw new RazorpayError(`Razorpay order lookup failed: ${res.status}`, res.status);
  return (await res.json()) as RazorpayOrder;
}

/** Razorpay signs `order_id|payment_id` with the Key Secret (HMAC SHA-256, hex). */
export function verifySignature(keySecret: string, orderId: string, paymentId: string, signature: string) {
  const expected = createHmac("sha256", keySecret).update(`${orderId}|${paymentId}`).digest();
  const given = Buffer.from(signature, "hex");
  return given.length === expected.length && timingSafeEqual(given, expected);
}
