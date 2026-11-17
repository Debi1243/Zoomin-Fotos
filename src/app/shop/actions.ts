"use server";

import { brand, formatRupees } from "@/lib/brand";
import { dataEndpoint } from "@/lib/settings";
import { shopEnabled } from "@/lib/site";
import {
  cartLinesSchema,
  customerSchema,
  toCustomerErrors,
  type ConfirmPaymentInput,
  type ConfirmPaymentResult,
  type StartCheckoutResult,
} from "@/lib/checkout";
import { createOrder, fetchOrder, priceCart, razorpayKeys, verifySignature, type RazorpayOrder } from "@/lib/razorpay";

const OFFLINE = "Online payment isn't available right now. Please send your order on WhatsApp instead.";
const NOTIFY_TIMEOUT_MS = 8000;

/** Creates a Razorpay order for the cart, priced on the server from shop.json. */
export async function startCheckout(input: { lines: unknown; customer: unknown }): Promise<StartCheckoutResult> {
  const keys = razorpayKeys();
  if (!shopEnabled || !keys) return { ok: false, message: OFFLINE };

  const customer = customerSchema.safeParse(input.customer);
  if (!customer.success) return { ok: false, message: "Please check the highlighted details.", errors: toCustomerErrors(customer.error) };

  const lines = cartLinesSchema.safeParse(input.lines);
  const priced = lines.success ? priceCart(lines.data) : null;
  if (!priced || priced.total <= 0) return { ok: false, message: "Something in your cart has changed. Please refresh the page and try again." };

  try {
    const order = await createOrder(keys, customer.data, priced.lines, priced.total);
    return { ok: true, keyId: keys.keyId, orderId: order.id, amount: order.amount, currency: "INR", customer: customer.data };
  } catch (err) {
    console.error(err);
    return { ok: false, message: `We couldn't start the payment. Please try again, or send your order on WhatsApp.` };
  }
}

// Payments already reported to the studio by this server, so a repeated confirmation isn't sent twice.
const reported = new Set<string>();

/** Checks Razorpay's signature for a finished payment, then tells the studio about the paid order. */
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
    return { ok: false, message: `We couldn't confirm this payment. If money left your account, message us on WhatsApp at ${brand.whatsapp} with your payment details.` };
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
  const message = [
    `PAID ${formatRupees(order.amount / 100)} online (Razorpay)`,
    `Payment: ${paymentId}`,
    `Order: ${order.id}`,
    "",
    `Items: ${items}`,
    `Deliver to: ${n.address}, ${n.city}`,
    ...(n.note && n.note !== "-" ? [`Note: ${n.note}`] : []),
  ].join("\n");
  const enquiry = {
    session: "Shop order (paid)",
    name: n.name,
    email: n.email === "-" ? "" : n.email,
    phone: n.phone,
    date: "",
    location: `${n.address}, ${n.city}`,
    message,
    page: "/shop",
  };

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  const send = (url: string, body: unknown, type: string) =>
    fetch(url, { method: "POST", headers: { "Content-Type": type }, body: JSON.stringify(body), signal: AbortSignal.timeout(NOTIFY_TIMEOUT_MS) });
  await Promise.allSettled([
    webhook && send(webhook, { type: "shop_order", ...enquiry, orderId: order.id, paymentId, amount: order.amount / 100, submittedAt: new Date().toISOString() }, "application/json"),
    dataEndpoint && send(dataEndpoint, { type: "enquiry", enquiry }, "text/plain;charset=utf-8"),
  ]);
}
