import { z } from "zod";
import testimonialData from "@/content/testimonials.json";

/**
 * Reviews from real clients, shown on /testimonials. Clients send them with the form on that
 * page; they wait in the studio's Google Sheet until the studio publishes them from
 * /admin/reviews, which writes them here. Nothing appears without the studio's approval.
 */
export const testimonialSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(120),
  event: z.string().max(80).default(""),
  /** When the shoot happened, as YYYY-MM, or empty. */
  date: z.string().max(7).default(""),
  rating: z.number().int().min(1).max(5),
  text: z.string().min(1).max(2000),
  /** A portfolio photo id shown beside the review. */
  photoId: z.string().max(10).optional(),
  /** Set when the studio copied the review from its Google listing. */
  source: z.literal("google").optional(),
});

export type Testimonial = z.infer<typeof testimonialSchema>;

export const testimonials: Testimonial[] = z.array(testimonialSchema).parse(testimonialData);

export const reviewEvents = ["Wedding", "Pre-wedding", "Portraits", "Maternity & Newborn", "Event", "Commercial", "Other"] as const;

export const monthLabel = (ym: string) => {
  const [y, m] = ym.split("-").map(Number);
  return y && m ? new Date(y, m - 1, 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "";
};
