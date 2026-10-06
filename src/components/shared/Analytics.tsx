"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { flush, trackClick, trackingEnabled, trackView } from "@/lib/track";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const CLICKABLE = "a[href], button, [role='button'], summary";

/** Where a click leads, as a site path or an outside address, for the dashboard's click list. */
function targetOf(el: Element) {
  const href = el.getAttribute("href");
  if (!href) return el.tagName === "SUMMARY" ? "expand" : "button";
  if (/^(mailto|tel):/.test(href)) return href;
  try {
    const url = new URL(href, location.href);
    if (url.origin !== location.origin) return url.host + url.pathname.replace(/\/$/, "");
    return url.pathname.slice(basePath.length).replace(/\/$/, "") || "/";
  } catch {
    return href;
  }
}

function labelOf(el: Element) {
  const text = el.getAttribute("aria-label") || (el as HTMLElement).innerText || el.getAttribute("title") || "";
  return text.replace(/\s+/g, " ").trim().slice(0, 60) || "(no label)";
}

/** Counts page visits and clicks for the studio dashboard. Renders nothing. */
export default function Analytics() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    const path = pathname.replace(/\/$/, "") || "/";
    if (!trackingEnabled(path)) return;
    let referrer: string | undefined;
    if (first.current && document.referrer) {
      try {
        const from = new URL(document.referrer);
        if (from.origin !== location.origin) referrer = from.host;
      } catch {
        // An unreadable referrer is simply left out.
      }
    }
    first.current = false;
    trackView(path, referrer);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const path = location.pathname.slice(basePath.length).replace(/\/$/, "") || "/";
      if (!trackingEnabled(path)) return;
      const el = (e.target as Element | null)?.closest(CLICKABLE);
      if (el) trackClick(path, labelOf(el), targetOf(el));
    };
    const onHide = () => document.visibilityState === "hidden" && flush();
    document.addEventListener("click", onClick, { capture: true, passive: true });
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", flush);
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", flush);
    };
  }, []);

  return null;
}
