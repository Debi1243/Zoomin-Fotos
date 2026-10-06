"use client";

import { useEffect, useRef, useSyncExternalStore, type RefObject } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { motion, useScroll, useSpring } from "motion/react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/cn";

const REVEAL = ".reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-photo, .reveal-line, .stagger-in";

/**
 * Site-wide scroll behaviour: reveals elements as they enter the viewport (in every
 * browser, not only those with CSS scroll timelines), smooths wheel scrolling, and
 * shows a reading-progress bar and a back-to-top button. All of it stands down when
 * the visitor prefers reduced motion.
 */
export default function ScrollEffects() {
  const pathname = usePathname();
  const lenis = useRef<Lenis | null>(null);

  // Reveal on scroll. New elements (route changes, gallery filters) are picked up as they mount.
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
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    const watch = (root: ParentNode) => root.querySelectorAll(REVEAL).forEach((el) => el.classList.contains("is-in") || io.observe(el));
    watch(document);
    const mo = new MutationObserver((records) => {
      for (const r of records) r.addedNodes.forEach((n) => n instanceof Element && (n.matches(REVEAL) ? io.observe(n) : watch(n)));
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  // Smooth wheel scrolling on pointer devices; touch keeps its native feel.
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const instance = new Lenis({
      autoRaf: true,
      anchors: { offset: -88 },
      lerp: 0.11,
      prevent: (node) => !!node.closest("dialog, [data-lenis-prevent]"),
    });
    lenis.current = instance;
    return () => {
      instance.destroy();
      lenis.current = null;
    };
  }, []);

  // A new page starts at the top, without gliding there.
  const lastPath = useRef(pathname);
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    lenis.current?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return (
    <>
      <ProgressBar />
      <BackToTop lenis={lenis} />
    </>
  );
}

function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px] origin-left festive-gradient"
      style={{ scaleX }}
    />
  );
}

function subscribeScroll(cb: () => void) {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
}

function BackToTop({ lenis }: { lenis: RefObject<Lenis | null> }) {
  const shown = useSyncExternalStore(subscribeScroll, () => window.scrollY > 900, () => false);

  return (
    <button
      type="button"
      aria-label="Back to top"
      tabIndex={shown ? 0 : -1}
      aria-hidden={!shown}
      onClick={() => (lenis.current ? lenis.current.scrollTo(0) : window.scrollTo({ top: 0, behavior: "smooth" }))}
      className={cn(
        "back-to-top fixed bottom-5 right-5 z-40 grid size-12 place-items-center rounded-full border border-border bg-bg/90 text-fg shadow-lg backdrop-blur transition-[opacity,translate,background-color] duration-500 ease-[var(--ease-out-expo)] hover:border-transparent hover:bg-rani-glow hover:text-white md:bottom-8 md:right-8",
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <ArrowUp aria-hidden className="size-5" />
    </button>
  );
}
