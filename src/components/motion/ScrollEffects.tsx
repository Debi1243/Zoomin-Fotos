"use client";

import { useEffect } from "react";

const REVEAL = ".reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-photo, .reveal-line, .stagger-in";

/**
 * Fades elements in as they enter the viewport by adding `.is-in` (the CSS lives in
 * globals.css and stands down for reduced motion). Also marks the page once the visitor
 * starts moving around, so page transitions never hold back the first paint.
 */
export default function ScrollEffects() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 },
    );
    const watch = (root: ParentNode) => root.querySelectorAll(REVEAL).forEach((el) => el.classList.contains("is-in") || io.observe(el));
    watch(document);
    // New elements (route changes, gallery filters) are picked up as they mount.
    const mo = new MutationObserver((records) => {
      for (const r of records) r.addedNodes.forEach((n) => n instanceof Element && (n.matches(REVEAL) ? io.observe(n) : watch(n)));
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  useEffect(() => {
    const mark = () => document.documentElement.setAttribute("data-navigated", "");
    document.addEventListener("click", mark, { capture: true, once: true });
    window.addEventListener("popstate", mark, { once: true });
    return () => {
      document.removeEventListener("click", mark, { capture: true });
      window.removeEventListener("popstate", mark);
    };
  }, []);

  return null;
}
