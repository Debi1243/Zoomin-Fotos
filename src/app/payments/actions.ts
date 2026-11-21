"use server";

import { brand, formatRupees } from "@/lib/brand";
import { dataEndpoint } from "@/lib/settings";
import { shopEnabled } from "@/lib/site";
import {
  cartLinesSchema,
  bookingAdvance,
  bookingSchema,
  customerSchema,
  payableServices,
  toFieldErrors,
  type ConfirmPaymentInput,
  type ConfirmPaymentResult,
  type StartCheckoutResult,
} from "@/lib/checkout";
import { getService } from "@/lib/data";
import {
  bookingNotes,
  createOrder,
  fetchOrder,
  MIN_AMOUNT_PAISE,
  priceCart,
  razorpayKeys,
  RazorpayError,
  shopNotes,
  verifySignature,
  type RazorpayOrder,
} from "@/lib/razorpay";

type Keys = NonNullable<ReturnType<typeof razorpayKeys>>;

const OFFLINE = "Online payment isn't available right now. Please send your order on WhatsApp instead.";
const NOTIFY_TIMEOUT_MS = 8000;

/** Creates the Razorpay order, turning API failures into a message the customer can act on. */
async function openOrder(keys: Keys, amountRupees: number, notes: Record<string, string>, receipt: string, prefill: { name: string; email: string; phone: string }): Promise<StartCheckoutResult> {
  if (amountRupees * 100 < MIN_AMOUNT_PAISE) return { ok: false, message: "This amount can't be paid online. Please message us on WhatsApp." };
  try {
    const order = await createOrder(keys, amountRupees, notes, receipt);
    return { ok: true, keyId: keys.keyId, orderId: order.id, amount: order.amount, currency: "INR", prefill: { name: prefill.name, email: prefill.email, contact: prefill.phone } };
  } catch (err) {
    if (err instanceof RazorpayError && err.status === 401) {
      // Wrong, revoked or mismatched keys in deploy/.env. Customers can still order on WhatsApp.
      console.error("Razorpay rejected the API keys (401). Check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in deploy/.env.");
      return { ok: false, message: OFFLINE };
    }
    console.error(err);
    return { ok: false, message: "We couldn't start the payment. Please try again, or message us on WhatsApp." };
  }
}

const INVALID = "Please check the highlighted details.";

/** Creates a Razorpay order for the cart, priced on the server from shop.json. */
export async function startCheckout(input: { lines: unknown; customer: unknown }): Promise<StartCheckoutResult> {
  const keys = razorpayKeys();
  if (!shopEnabled || !keys) return { ok: false, message: OFFLINE };

  const customer = customerSchema.safeParse(input?.customer);
  if (!customer.success) return { ok: false, message: INVALID, errors: toFieldErrors(customer.error) };

  const lines = cartLinesSchema.safeParse(input?.lines);
  const priced = lines.success ? priceCart(lines.data) : null;
  if (!priced) return { ok: false, message: "Something in your cart has changed. Please refresh the page and try again." };

  return openOrder(keys, priced.total, shopNotes(customer.data, priced.lines), "shop", customer.data);
}

/**
 * Creates a Razorpay order for the advance on a package (see BOOKING_ADVANCE). The package and
 * its price are looked up on the server, so the browser only names which package it wants.
 */
export async function startPackageCheckout(input: { service: unknown; pkg: unknown; booking: unknown }): Promise<StartCheckoutResult> {
  const keys = razorpayKeys();
  if (!keys) return { ok: false, message: "Online booking isn't available right now. Please book on WhatsApp or through the enquiry form." };

  const slug = payableServices.find((s) => s === input?.service);
  const service = slug && getService(slug);
  const pkg = service && service.packages?.find((p) => p.name === input?.pkg);
  if (!service || !pkg) return { ok: false, message: "That package has changed. Please refresh the page and try again." };

  const booking = bookingSchema.safeParse(input?.booking);
  if (!booking.success) return { ok: false, message: INVALID, errors: toFieldErrors(booking.error) };

  const notes = bookingNotes(booking.data, { service: service.title, name: pkg.name, price: pkg.price });
  return openOrder(keys, bookingAdvance(pkg.price), notes, "book", booking.data);
}

// Payments already reported to the studio by this server, so a repeated confirmation isn't sent twice.
const reported = new Set<string>();

/** Checks Razorpay's signature for a finished payment (shop order or package advance), then tells the studio. */
export async function confirmPayment(input: ConfirmPaymentInput): Promise<ConfirmPaymentResult> {
  const keys = razorpayKeys();
  if (!keys) return { ok: false, message: OFFLINE };

  const { orderId, paymentId, signature } = input ?? {};
  const valid =
    typeof orderId === "string" &&
    typeof paymentId === "string" &&
    typeof signature === "string" &&
    /^order_\w+$/.test(orderId) &&
    /^pay_\w+$/.test(paymentId) &&
    verifySignature(keys.keySecret, orderId, paymentId, signature);
  if (!valid) {
    return { ok: false, message: `We couldn't confirm this payment. If money left your account, message us on WhatsApp at ${brand.whatsapp} or email ${brand.supportEmail} with your payment details.` };
  }

  let amount = 0;
  try {
    const order = await fetchOrder(keys, orderId);
    amount = order.amount;
    if (!reported.has(paymentId)) {
      reported.add(paymentId);
      await notifyStudio(order, paymentId);
    }
  } catch (err) {
    // The payment is genuine (the signature matched); it is also listed in the Razorpay dashboard.
    console.error(err);
  }
  return { ok: true, paymentId, amount };
}

/** Sends the paid order to the studio's Google Sheet (which emails it) and the contact webhook, whichever are set up. */
async function notifyStudio(order: RazorpayOrder, paymentId: string) {
  const n = order.notes ?? {};
  const items = Object.keys(n)
    .filter((k) => k.startsWith("items_"))
    .sort()
    .map((k) => n[k])
    .join("; ");
  const booking = n.kind === "booking";
  const paid = [`PAID ${formatRupees(order.amount / 100)} online (Razorpay)`, `Payment: ${paymentId}`, `Order: ${order.id}`, ""];
  const note = n.note && n.note !== "-" ? [`Note: ${n.note}`] : [];
  const message = booking
    ? [...paid, `Booking advance for ${n.package}`, `Event date: ${n.date}`, `Venue: ${n.venue}`, ...note].join("\n")
    : [...paid, `Items: ${items}`, `Deliver to: ${n.address}, ${n.city}`, ...note].join("\n");
  const enquiry = {
    session: booking ? "Package booking (advance paid)" : "Shop order (paid)",
    name: n.name,
    email: n.email === "-" ? "" : n.email,
    phone: n.phone,
    date: booking ? n.date : "",
    location: booking ? n.venue : `${n.address}, ${n.city}`,
    message,
    page: booking ? "/packages" : "/shop",
  };
  const webhook = process.env.CONTACT_WEBHOOK_URL;
  const send = (url: string, body: unknown, type: string) =>
    fetch(url, { method: "POST", headers: { "Content-Type": type }, body: JSON.stringify(body), signal: AbortSignal.timeout(NOTIFY_TIMEOUT_MS) });
  await Promise.allSettled([
    webhook && send(webhook, { type: booking ? "package_booking" : "shop_order", ...enquiry, orderId: order.id, paymentId, amount: order.amount / 100, submittedAt: new Date().toISOString() }, "application/json"),
    dataEndpoint && send(dataEndpoint, { type: "enquiry", enquiry }, "text/plain;charset=utf-8"),
  ]);
}
