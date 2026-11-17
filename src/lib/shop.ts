import { z } from "zod";
import shopData from "@/content/shop.json";

/**
 * The shop: albums, frames, prints, canvas, calendars and photo gifts, read from src/content/shop.json.
 * Visitors either pay online through Razorpay (src/lib/checkout.ts, src/app/shop/actions.ts) or send
 * the order to the studio on WhatsApp, where the studio confirms the photos, the final price and delivery.
 */

export const mockups = ["album", "frame", "collage", "print", "canvas", "triptych", "calendar", "mug", "cushion", "magnets"] as const;
export type Mockup = (typeof mockups)[number];

const optionSchema = z.object({ label: z.string().min(1), price: z.number().int().nonnegative() });

const productSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  category: z.string().min(1),
  mockup: z.enum(mockups),
  description: z.string().min(1),
  /** Sample photograph shown inside the product mock-up. */
  photo: z.string().startsWith("/photos/"),
  /** A real photograph of the product. When set it replaces the mock-up. */
  image: z.string().startsWith("/").optional(),
  options: z.array(optionSchema).min(1),
  badge: z.string().optional(),
  /** Shows a "Sample price" tag until the studio confirms the price. */
  placeholder: z.boolean().optional(),
});

const shopSchema = z.object({
  categories: z.array(z.object({ slug: z.string().min(1), label: z.string().min(1) })).min(1),
  products: z.array(productSchema),
});

export type ProductOption = z.infer<typeof optionSchema>;
export type Product = z.infer<typeof productSchema>;
export type ShopCategory = { slug: string; label: string; count: number };

const shop = shopSchema.parse(shopData);

for (const p of shop.products) {
  if (!shop.categories.some((c) => c.slug === p.category)) throw new Error(`shop.json: product "${p.id}" has unknown category "${p.category}"`);
}

export const products: Product[] = shop.products;

/** Categories that have at least one product, in the order the content file lists them. */
export const shopCategories: ShopCategory[] = shop.categories
  .map((c) => ({ ...c, count: products.filter((p) => p.category === c.slug).length }))
  .filter((c) => c.count > 0);

export const lowestPrice = (p: Product) => Math.min(...p.options.map((o) => o.price));
