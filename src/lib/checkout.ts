import { z } from "zod";
import { PHONE } from "./contact";

/**
 * Online payment for the shop, shared by the cart (browser) and the checkout Server Actions.
 * Payments go through Razorpay: the server creates the order from the prices in shop.json and
 * checks Razorpay's signature on the way back, so the browser never decides what is charged.
 */

/** Static builds (GitHub Pages) have no server to create orders, so they only offer WhatsApp. */
export const onlinePayments = process.env.NEXT_PUBLIC_STATIC_EXPORT !== "1";

export const customerSchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name.").max(120),
  phone: z.string().trim().regex(PHONE, "Enter a 10-digit mobile number."),
  email: z.union([z.literal(""), z.email("That email doesn't look right.").trim().max(200)]),
  address: z.string().trim().min(8, "Enter your house, street and area.").max(240),
  city: z.string().trim().min(2, "Enter your city.").max(80),
  pincode: z.string().trim().regex(/^[1-9]\d{5}$/, "Enter a 6-digit PIN code."),
  note: z.string().trim().max(240),
});

export type Customer = z.infer<typeof customerSchema>;
export type CustomerField = keyof Customer;
export type CustomerErrors = Partial<Record<CustomerField, string>>;

export const emptyCustomer: Customer = { name: "", phone: "", email: "", address: "", city: "Bhubaneswar", pincode: "", note: "" };

export const cartLinesSchema = z
  .array(z.object({ id: z.string().min(1).max(80), option: z.string().min(1).max(120), qty: z.number().int().min(1).max(50) }))
  .min(1, "Your cart is empty.")
  .max(30);

export type StartCheckoutResult =
  | {
      ok: true;
      /** The public Key ID. The Key Secret never leaves the server. */
      keyId: string;
      orderId: string;
      /** In paise. */
      amount: number;
      currency: "INR";
      customer: Customer;
    }
  | { ok: false; message: string; errors?: CustomerErrors };

export type ConfirmPaymentInput = { orderId: string; paymentId: string; signature: string };
export type ConfirmPaymentResult = { ok: true; paymentId: string; amount: number } | { ok: false; message: string };

export function toCustomerErrors(error: z.ZodError): CustomerErrors {
  const errors: CustomerErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as CustomerField | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}
