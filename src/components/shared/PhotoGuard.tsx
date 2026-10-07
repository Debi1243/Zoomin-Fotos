"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const editable = (el: EventTarget | null) => el instanceof HTMLElement && !!el.closest("input, textarea, select, [contenteditable]");

/**
 * Makes the photographs harder to take: no right-click or long-press menu, no dragging an image
 * out of the page, and no Save page or Print shortcuts. Forms keep their menu for pasting, and the
 * studio's own admin pages are left alone. A website cannot stop screenshots; this stops the easy ways.
 */
export default function PhotoGuard() {
  const admin = usePathname().startsWith("/admin");
  useEffect(() => {
    if (admin) return;
    const menu = (e: MouseEvent) => {
      if (!editable(e.target)) e.preventDefault();
    };
    const drag = (e: DragEvent) => {
      if (e.target instanceof HTMLImageElement || e.target instanceof HTMLVideoElement) e.preventDefault();
    };
    const keys = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      const k = e.key.toLowerCase();
      // Save page, print, and view source.
      if (k === "s" || k === "p" || k === "u") e.preventDefault();
    };
    document.addEventListener("contextmenu", menu);
    document.addEventListener("dragstart", drag);
    document.addEventListener("keydown", keys);
    return () => {
      document.removeEventListener("contextmenu", menu);
      document.removeEventListener("dragstart", drag);
      document.removeEventListener("keydown", keys);
    };
  }, [admin]);
  return null;
}
