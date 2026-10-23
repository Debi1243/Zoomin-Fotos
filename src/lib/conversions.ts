/**
 * Conversion events for Google Analytics 4. GA only loads when NEXT_PUBLIC_GA_ID is set and the
 * visitor has accepted analytics in the consent banner; until then these calls do nothing.
 * The studio's own visit counter (src/lib/track.ts) records the same clicks without cookies.
 *
 * Events: whatsapp_click, quote_form_start, quote_form_submit, call_click, package_select.
 */

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";
export const CONSENT_KEY = "zf-analytics-consent";

type Gtag = (command: "event" | "config" | "js" | "consent", ...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: Gtag;
    dataLayer?: unknown[];
  }
}

export type ConversionParams = Record<string, string | number | undefined>;

export function trackConversion(name: string, params: ConversionParams = {}) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params);
}

export function readConsent(): "granted" | "denied" | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function saveConsent(value: "granted" | "denied") {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Without storage the banner simply asks again next visit.
  }
}

/** Adds the GA4 tag to the page. Called only after consent. */
export function loadAnalytics() {
  if (!GA_ID || window.gtag) return;
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag() {
    // GA reads the arguments object itself, so it must be pushed as-is.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { anonymize_ip: true });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  document.head.append(s);
}
