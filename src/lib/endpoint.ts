import settingsData from "@/content/settings.json";

/** Address of a Google Apps Script web app, as Google shows it after deploying. */
export const DATA_ENDPOINT_PATTERN = /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/;

/**
 * The studio's Google Sheet web app (set from /admin/dashboard), or undefined when none is set.
 * Read without zod so the visit counter on every page stays small.
 */
const raw: unknown = (settingsData as { dataEndpoint?: unknown }).dataEndpoint;
export const dataEndpoint = typeof raw === "string" && DATA_ENDPOINT_PATTERN.test(raw) ? raw : undefined;
