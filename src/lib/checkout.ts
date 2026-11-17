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

/** Booking a photography package online: who, when and where. The rest is agreed on a call. */
export const bookingSchema = z.object({
  name: customerSchema.shape.name,
  phone: customerSchema.shape.phone,
  email: customerSchema.shape.email,
  date: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose the event date.")
    .refine((v) => !Number.isNaN(Date.parse(v)) && v >= new Date(Date.now() - 86_400_000).toISOString().slice(0, 10), "Choose a date that hasn't passed."),
  venue: z.string().trim().min(2, "Where is the event? A city or venue is enough.").max(160),
  note: customerSchema.shape.note,
});

export type Booking = z.infer<typeof bookingSchema>;

/**
 * What a customer pays online to book a package: a fixed advance that holds the date. The rest
 * is paid to the studio once the date, the final price and GST are confirmed. Change it here.
 */
export const BOOKING_ADVANCE = 5000;
export const bookingAdvance = (packagePrice: number) => Math.min(packagePrice, BOOKING_ADVANCE);

/** Services whose packages can be booked and paid for online. */
export const payableServices = ["weddings"] as const;

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
      prefill: { name: string; email: string; contact: string };
    }
  | { ok: false; message: string; errors?: Record<string, string> };

export type ConfirmPaymentInput = { orderId: string; paymentId: string; signature: string };
export type ConfirmPaymentResult = { ok: true; paymentId: string; amount: number } | { ok: false; message: string };

export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as string | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}
