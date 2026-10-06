"use client";

import { useEffect } from "react";

const PRESSABLE = "a[href], button:not(:disabled), [role='button'], summary, label[for]";
const SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";

/**
 * Touch feedback that matches the phone's platform. iOS gets the press-and-spring
 * of native controls: the item dims and shrinks a touch, then springs back. Android
 * gets Material ink ripples spreading from the finger, drawn in an overlay matched to
 * the pressed element. Both use the Web Animations API or overlays, so no element's
 * own styles or transitions are touched.
 */
export default function AppFeel() {
  useEffect(() => {
    const platform = document.documentElement.dataset.platform;
    if (!platform || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onDown = (e: PointerEvent) => {
      if (!e.isPrimary || e.button !== 0 || e.pointerType === "mouse") return;
      const target = (e.target as Element | null)?.closest<HTMLElement>(PRESSABLE);
      if (!target || target.closest("[data-no-press]")) return;
      const release = platform === "ios" ? press(target) : ripple(target, e);
      const end = () => {
        release();
        window.removeEventListener("pointerup", end);
        window.removeEventListener("pointercancel", end);
      };
      window.addEventListener("pointerup", end);
      window.addEventListener("pointercancel", end);
    };

    document.addEventListener("pointerdown", onDown, { passive: true });
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  return null;
}

function press(el: HTMLElement) {
  // Large blocks (photo cards) shrink less, so the whole page never seems to lurch.
  const amount = el.offsetWidth > 240 ? 0.985 : 0.95;
  const down = el.animate([{ scale: "1", opacity: 1 }, { scale: String(amount), opacity: 0.72 }], {
    duration: 110,
    easing: "ease-out",
    fill: "forwards",
  });
  return () => {
    const from = getComputedStyle(el);
    const up = el.animate([{ scale: from.scale === "none" ? "1" : from.scale, opacity: from.opacity }, { scale: "1", opacity: 1 }], {
      duration: 460,
      easing: SPRING,
    });
    down.cancel();
    up.finished.catch(() => {});
  };
}

function ripple(el: HTMLElement, e: PointerEvent) {
  const rect = el.getBoundingClientRect();
  const style = getComputedStyle(el);
  const clip = document.createElement("span");
  clip.className = "ripple-clip";
  Object.assign(clip.style, {
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    borderRadius: style.borderRadius,
  });

  const size = Math.hypot(rect.width, rect.height) * 2;
  const ink = document.createElement("span");
  ink.className = "ripple-ink";
  Object.assign(ink.style, {
    width: `${size}px`,
    height: `${size}px`,
    left: `${e.clientX - rect.left - size / 2}px`,
    top: `${e.clientY - rect.top - size / 2}px`,
    background: style.color,
  });
  clip.append(ink);
  document.body.append(clip);

  return () => {
    clip.classList.add("is-out");
    setTimeout(() => clip.remove(), 450);
  };
}
