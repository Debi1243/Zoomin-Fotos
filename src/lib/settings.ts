import { z } from "zod";
import settingsData from "@/content/settings.json";
import { DATA_ENDPOINT_PATTERN } from "./endpoint";

export { DATA_ENDPOINT_PATTERN };

const settingsSchema = z.object({
  /** The studio's Google Sheet web app that records visits, clicks and enquiries. Set from /admin/dashboard. */
  dataEndpoint: z.union([z.literal(""), z.string().regex(DATA_ENDPOINT_PATTERN)]).optional(),
  /** UPI ID clients pay the advance to from the client portal, e.g. studio@okhdfcbank. Set on /admin/clients. */
  upiId: z.union([z.literal(""), z.string().regex(/^[\w.-]{2,}@[\w.-]{2,}$/)]).optional(),
  /** Name shown in the client's UPI app when paying. */
  upiName: z.string().max(60).optional(),
});

export type Settings = z.infer<typeof settingsSchema>;

/** Site settings edited from the admin pages (src/content/settings.json). */
export const settings: Settings = settingsSchema.parse(settingsData);
export const dataEndpoint = settings.dataEndpoint || undefined;
export const UPI_PATTERN = /^[\w.-]{2,}@[\w.-]{2,}$/;
