import { dataEndpoint } from "@/lib/settings";

/**
 * Records page visits and clicks in the studio's own Google Sheet (see /admin/dashboard).
 * No cookies: a random visitor id lives in this browser's storage so repeat visits can be
 * told apart from new ones, and a session id groups the pages seen in one sitting.
 * Requests are plain-text POSTs, which Google accepts from any site without a preflight.
 */

export type TrackedEvent = {
  time: number;
  type: "view" | "click";
  path: string;
  label?: string;
  target?: string;
  referrer?: string;
  device: "ios" | "android" | "desktop";
  visitor: string;
  session: string;
};

const VISITOR_KEY = "zf-visitor";
const SESSION_KEY = "zf-session";
export const NO_TRACK_KEY = "zf-no-track";

const randomId = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

function stored(storage: () => Storage, key: string) {
  try {
    const s = storage();
    let id = s.getItem(key);
    if (!id) s.setItem(key, (id = randomId()));
    return id;
  } catch {
    return "anonymous";
  }
}

export function trackingEnabled(path: string) {
  if (!dataEndpoint || path.startsWith("/admin")) return false;
  try {
    return localStorage.getItem(NO_TRACK_KEY) === null;
  } catch {
    return true;
  }
}

const device = (): TrackedEvent["device"] => {
  const p = document.documentElement.dataset.platform;
  return p === "ios" || p === "android" ? p : "desktop";
};

let queue: TrackedEvent[] = [];

function event(type: TrackedEvent["type"], path: string, extra: Partial<TrackedEvent> = {}): TrackedEvent {
  return {
    time: Date.now(),
    type,
    path,
    device: device(),
    visitor: stored(() => localStorage, VISITOR_KEY),
    session: stored(() => sessionStorage, SESSION_KEY),
    ...extra,
  };
}

/** Sends everything waiting, using a beacon so it survives the page closing. */
export function flush() {
  if (!dataEndpoint || queue.length === 0) return;
  const body = JSON.stringify({ type: "events", events: queue });
  queue = [];
  const sent = navigator.sendBeacon?.(dataEndpoint, new Blob([body], { type: "text/plain" }));
  if (!sent) void fetch(dataEndpoint, { method: "POST", body, keepalive: true, mode: "no-cors" }).catch(() => {});
}

export function trackView(path: string, referrer?: string) {
  queue.push(event("view", path, referrer ? { referrer } : {}));
  flush();
}

export function trackClick(path: string, label: string, target: string) {
  queue.push(event("click", path, { label, target }));
  if (queue.length >= 10) flush();
}
