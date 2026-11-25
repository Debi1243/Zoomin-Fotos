"use client";

import { useEffect } from "react";

const CARDS = ".lift, .glow-card";
/** Only a real mouse or trackpad, and only when the visitor is happy with motion. */
const QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

/**
 * Lets the spotlight on cards (.lift, .glow-card in globals.css) follow the pointer.
 * One passive listener for the whole page; it writes two custom properties on the card
 * under the pointer at most once a frame. Touch screens and reduced motion skip it, and
 * the light then rests in the card's top corner.
 */
export default function HoverGlow() {
  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    let frame = 0;
    let last: PointerEvent | null = null;

    const paint = () => {
      frame = 0;
      const e = last;
      if (!e) return;
      const card = (e.target as Element | null)?.closest?.<HTMLElement>(CARDS);
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${Math.round(e.clientX - r.left)}px`);
      card.style.setProperty("--my", `${Math.round(e.clientY - r.top)}px`);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      last = e;
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const start = () => document.addEventListener("pointermove", onMove, { passive: true });
    const stop = () => {
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const sync = () => (mq.matches ? start() : stop());
    sync();
    mq.addEventListener("change", sync);
    return () => {
      stop();
      mq.removeEventListener("change", sync);
    };
  }, []);

  return null;
}
