import { z } from "zod";
import pricingData from "@/content/pricing.json";

/**
 * The online package builder (/services and /services/weddings). The estimate is the crew and
 * per-event extras for every chosen event, plus the one-off add-ons. The rates live in
 * src/content/pricing.json, which the admin Prices page edits; the numbers written below are
 * only fallbacks for an item missing from that file.
 */

export const pricingSchema = z.object({
  prices: z.record(z.string(), z.number().int().min(0).max(10_000_000)),
  eventShare: z.record(z.string(), z.number().int().min(0).max(300)),
});
export type Pricing = z.infer<typeof pricingSchema>;
const pricing: Pricing = pricingSchema.parse(pricingData);

export type BuilderEvent = { id: string; label: string; note: string; /** Share of a full day's crew rate. */ weight: number };
export type Counter = { id: string; label: string; note: string; price: number; max: number; min?: number; initial: number; unit?: string };
export type Toggle = { id: string; label: string; note: string; price: number };

const baseEvents: BuilderEvent[] = [
  { id: "pre-wedding", label: "Pre-wedding", note: "Outdoor shoot", weight: 0.8 },
  { id: "mehendi", label: "Mehendi", note: "Half day", weight: 0.6 },
  { id: "haldi", label: "Haldi", note: "Half day", weight: 0.6 },
  { id: "sangeet", label: "Sangeet", note: "Evening", weight: 0.8 },
  { id: "wedding", label: "Wedding", note: "Full day", weight: 1 },
  { id: "reception", label: "Reception", note: "Evening", weight: 0.8 },
];

/** Each event's share of a full day, from the admin Prices page. */
export const builderEvents: BuilderEvent[] = baseEvents.map((e) => ({ ...e, weight: (pricing.eventShare[e.id] ?? e.weight * 100) / 100 }));

const priced = <T extends { id: string; price: number }>(item: T): T => ({ ...item, price: pricing.prices[item.id] ?? item.price });

/** Crew, charged for every event chosen. */
const baseCrew: Counter[] = [
  { id: "photographer", label: "Photographers", note: "Candid and family photos", price: 9000, min: 0, max: 3, initial: 1 },
  { id: "cinematographer", label: "Cinematographers", note: "Cinematic video", price: 9000, min: 0, max: 2, initial: 1 },
];

export const crew = baseCrew.map(priced);

/** Extra coverage, charged for every event chosen. */
const baseCoverage: Toggle[] = [
  { id: "drone", label: "Drone", note: "Aerial photos and video", price: 5000 },
  { id: "traditional", label: "Traditional video", note: "Every ritual, start to end", price: 7000 },
  { id: "live", label: "Live streaming", note: "For family far away", price: 8000 },
];

export const coverage = baseCoverage.map(priced);

/** Charged once for the whole booking. */
const baseAddOns: Toggle[] = [
  { id: "album", label: "Premium album", note: "Designed and printed", price: 4000 },
  { id: "teaser", label: "Teaser", note: "A one-minute trailer", price: 3000 },
  { id: "film", label: "Full-length film", note: "The whole story, edited", price: 3000 },
  { id: "same-day", label: "Same-day edit", note: "Shown at the reception", price: 12000 },
];

export const addOns = baseAddOns.map(priced);

export const extraHours: Counter = priced({
  id: "hours",
  label: "Extra hours",
  note: "Beyond the usual coverage",
  price: 2500,
  min: 0,
  max: 10,
  initial: 0,
  unit: "hour",
});

/** Everything the admin Prices page lists, in the order the builder shows it. */
export const pricedItems = { baseEvents, perEvent: [...baseCrew, ...baseCoverage], once: [...baseAddOns, extraHours] };

export type Selection = {
  events: string[];
  counts: Record<string, number>;
  options: string[];
};

export const initialSelection: Selection = {
  events: ["wedding"],
  counts: Object.fromEntries([...crew, extraHours].map((c) => [c.id, c.initial])),
  options: ["album", "film"],
};

export function estimate(s: Selection) {
  const days = builderEvents.filter((e) => s.events.includes(e.id)).reduce((sum, e) => sum + e.weight, 0);
  const crewPerDay = crew.reduce((sum, c) => sum + c.price * (s.counts[c.id] ?? 0), 0);
  const coveragePerDay = coverage.filter((c) => s.options.includes(c.id)).reduce((sum, c) => sum + c.price, 0);
  const once = addOns.filter((a) => s.options.includes(a.id)).reduce((sum, a) => sum + a.price, 0);
  const hours = (s.counts[extraHours.id] ?? 0) * extraHours.price;
  const total = (crewPerDay + coveragePerDay) * days + (s.events.length ? once + hours : 0);
  return Math.round(total / 500) * 500;
}

/** A plain-text summary of the choices, used to fill in the booking form. */
export function summary(s: Selection) {
  const events = builderEvents.filter((e) => s.events.includes(e.id)).map((e) => e.label);
  const team = crew.filter((c) => s.counts[c.id]).map((c) => `${s.counts[c.id]} × ${c.label.toLowerCase().replace(/s$/, "")}`);
  const extras = coverage.filter((c) => s.options.includes(c.id)).map((c) => c.label);
  const once = addOns.filter((a) => s.options.includes(a.id)).map((a) => a.label);
  const hours = s.counts[extraHours.id] ? [`${s.counts[extraHours.id]} extra hour${s.counts[extraHours.id] > 1 ? "s" : ""}`] : [];
  return [
    `Events: ${events.join(", ") || "none yet"}`,
    `Coverage: ${[...team, ...extras].join(", ") || "none"}`,
    `Add-ons: ${[...once, ...hours].join(", ") || "none"}`,
  ].join("\n");
}
