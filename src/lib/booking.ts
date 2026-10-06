import { z } from "zod";
import { brand, formatRupees } from "@/lib/data";

/**
 * A client's booking, as kept in the studio's Google Sheet (one row per booking, see
 * dashboard-script.ts). The studio edits it on /admin/clients; the client sees it on /portal,
 * signs the agreement there, reports the advance payment and fills in the planning lists.
 */

const text = (max: number) => z.string().max(max).default("");
const rows = <T extends z.ZodRawShape>(shape: T, max = 60) => z.array(z.object(shape)).max(max).default([]);

export const planningSchema = z.object({
  timeline: rows({ date: text(20), time: text(20), title: text(120), place: text(160) }),
  shots: rows({ text: text(200), by: text(20) }, 150),
  venues: rows({ event: text(60), name: text(120), address: text(240), map: text(400) }),
  family: rows({ name: text(80), relation: text(60), side: text(20), phone: text(30), note: text(200) }, 100),
});

export const deliveryKinds = ["teaser", "photos", "videos", "album"] as const;
export const deliveryStatuses = ["Not started", "In progress", "Ready"] as const;

export const bookingSchema = z.object({
  code: z.string().regex(/^ZF-[A-Z0-9]{4,8}$/),
  title: text(120),
  client: z.object({ names: text(120), email: text(200), phone: text(30) }).default({ names: "", email: "", phone: "" }),
  eventDate: text(20),
  package: z
    .object({
      name: text(80),
      items: rows({ label: text(160), amount: z.number().min(0).default(0) }, 40),
      discount: z.number().min(0).default(0),
      gstRate: z.number().min(0).max(28).default(18),
      notes: text(1000),
    })
    .default({ name: "", items: [], discount: 0, gstRate: 18, notes: "" }),
  advance: z.number().min(0).default(0),
  contract: z
    .object({
      text: text(20000),
      signed: z.object({ name: z.string(), at: z.number(), text: z.string() }).optional(),
    })
    .default({ text: "" }),
  payments: rows(
    {
      id: z.string(),
      amount: z.number().min(0),
      reference: text(80),
      at: z.number(),
      method: text(30),
      status: z.enum(["claimed", "confirmed"]),
    },
    30,
  ),
  planning: planningSchema.default({ timeline: [], shots: [], venues: [], family: [] }),
  team: rows({ name: text(80), role: text(60), phone: text(30) }, 20),
  schedule: rows({ date: text(20), time: text(20), title: text(160) }),
  delivery: rows(
    { kind: z.enum(deliveryKinds), status: z.enum(deliveryStatuses), url: text(400), note: text(200), expected: text(20) },
    8,
  ),
  updatedAt: z.number().default(0),
});

export type Booking = z.infer<typeof bookingSchema>;
export type Planning = z.infer<typeof planningSchema>;

export const deliveryNames: Record<(typeof deliveryKinds)[number], string> = {
  teaser: "Teaser",
  photos: "Photos",
  videos: "Videos",
  album: "Album",
};

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const randomFrom = (chars: string, n: number) => {
  const bytes = crypto.getRandomValues(new Uint8Array(n));
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
};
export const newCode = () => `ZF-${randomFrom(CODE_CHARS, 5)}`;
export const newPin = () => randomFrom("0123456789", 6);

export function blankBooking(): Booking {
  return bookingSchema.parse({
    code: newCode(),
    package: { name: "", items: [], discount: 0, gstRate: 18, notes: "" },
    delivery: deliveryKinds.map((kind) => ({ kind, status: "Not started", url: "", note: "", expected: "" })),
  });
}

/** Totals for the invoice and payment status. Amounts are in rupees. */
export function money(b: Booking) {
  const subtotal = b.package.items.reduce((s, i) => s + i.amount, 0);
  const taxable = Math.max(0, subtotal - b.package.discount);
  const gst = Math.round((taxable * b.package.gstRate) / 100);
  const total = taxable + gst;
  const paid = b.payments.filter((p) => p.status === "confirmed").reduce((s, p) => s + p.amount, 0);
  const claimed = b.payments.filter((p) => p.status === "claimed").reduce((s, p) => s + p.amount, 0);
  return { subtotal, taxable, gst, total, paid, claimed, balance: Math.max(0, total - paid), advanceDue: Math.max(0, b.advance - paid) };
}

export type Stage = "agreement" | "payment" | "verifying" | "confirmed";

/** Where the booking is in review, sign, pay, confirmed. */
export function stage(b: Booking): Stage {
  if (!b.contract.signed) return "agreement";
  const m = money(b);
  if (m.paid >= b.advance) return "confirmed";
  if (m.paid + m.claimed >= b.advance) return "verifying";
  return "payment";
}

export const stageLabel: Record<Stage, string> = {
  agreement: "Waiting for signature",
  payment: "Waiting for advance",
  verifying: "Checking payment",
  confirmed: "Confirmed",
};

const longDate = (iso: string) => {
  const t = Date.parse(iso);
  return Number.isNaN(t) ? iso || "the agreed date" : new Date(t).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
};

/** The studio's standard agreement, filled in for this booking. The studio can edit it per booking. */
export function standardAgreement(b: Booking) {
  const m = money(b);
  const items = b.package.items.map((i) => `  • ${i.label}${i.amount ? `: ${formatRupees(i.amount)}` : ""}`).join("\n");
  return `PHOTOGRAPHY AND FILM AGREEMENT

This agreement is between ${brand.name}, ${brand.city}, ${brand.region} ("the Studio"), and ${b.client.names || "the Client"} ("the Client"), for ${b.title || "the event"} on ${longDate(b.eventDate)}.

1. Services
The Studio will provide the ${b.package.name || "agreed"} package:
${items || "  • As described in the quote"}
${b.package.notes ? `\nNotes: ${b.package.notes}\n` : ""}
2. Fees and payment
The total fee is ${formatRupees(m.total)}, including GST at ${b.package.gstRate}%. An advance of ${formatRupees(b.advance)} confirms the booking and reserves the date. The balance is due on or before the event date, unless agreed otherwise in writing.

3. Cancellation and changes
The advance is non-refundable, as the Studio turns away other work for the date. If the Client cancels more than 60 days before the event, any amount paid beyond the advance is refunded. If the date moves, the Studio will try to transfer the booking to the new date, subject to availability. If the Studio cannot attend for reasons beyond its control, it will arrange a suitable replacement photographer or refund all payments.

4. Travel and stay
Coverage outside ${brand.city} includes travel and stay for the team, quoted at cost and payable in addition to the fee.

5. Delivery
A preview is delivered within 72 hours. The edited photographs, films and album are delivered within the timelines given in the quote, usually four to eight weeks. Album designs are shared for approval before printing.

6. Client responsibilities
The Client will share the schedule, venues and key family contacts at least two weeks before the event, and will arrange any permissions the venues require for photography, video or drone.

7. Copyright and use
The Studio owns the copyright in the photographs and films and grants the Client a personal licence to print, share and keep them for any non-commercial use. The Studio may use a selection of the work for its portfolio and social media; the Client can ask in writing for any image to be left out.

8. Liability
The Studio works with backup cameras and duplicate cards. In the unlikely event that work is lost or damaged, the Studio's liability is limited to the amount the Client has paid.

By signing below, both parties agree to these terms.`;
}
