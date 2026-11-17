import type { ConfirmPaymentResult, StartCheckoutResult } from "./checkout";

/**
 * Stand-in for src/app/shop/actions.ts in static builds (GitHub Pages), which have no server to
 * hold the Razorpay secret. The cart hides online payment there (see onlinePayments), so these only
 * answer if something calls them anyway.
 */
const message = "Online payment isn't available on this copy of the site. Please send your order on WhatsApp.";

export async function startCheckout(): Promise<StartCheckoutResult> {
  return { ok: false, message };
}

export async function confirmPayment(): Promise<ConfirmPaymentResult> {
  return { ok: false, message };
}
