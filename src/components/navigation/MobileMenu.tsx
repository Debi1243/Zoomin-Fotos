"use client";

import Link from "next/link";
import { useEffect, useId, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ButtonLink } from "../ui/Button";
import ThemeToggle from "./ThemeToggle";
import { brand, mailHref, telHref } from "@/lib/data";
import { isActive, primaryNav } from "@/lib/site";
import { cn } from "@/lib/cn";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pathname: string;
};

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function MobileMenu({ open, onOpenChange, pathname }: Props) {
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    const button = buttonRef.current;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
        button?.focus();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current || !button) return;
      // Keep focus inside the menu (toggle button + panel) while it is open.
      const items = [button, ...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => onOpenChange(!open)}
        className="relative grid size-11 place-items-center rounded-md border border-border lg:hidden"
      >
        <span
          aria-hidden
          className={cn("absolute h-px w-4.5 bg-fg transition-transform duration-300", open ? "rotate-45" : "-translate-y-[3.5px]")}
        />
        <span
          aria-hidden
          className={cn("absolute h-px w-4.5 bg-fg transition-transform duration-300", open ? "-rotate-45" : "translate-y-[3.5px]")}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            id={panelId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-bg md:top-[4.5rem] lg:hidden"
          >
            <nav aria-label="Mobile" className="container-page flex min-h-full flex-col pb-10 pt-6">
              <ul className="border-t border-border">
                {primaryNav.map((item, i) => {
                  const active = item.href === "/" ? pathname === "/" : isActive(pathname, item.href);
                  return (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.04 * i, duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                      className="border-b border-border"
                    >
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        onClick={() => onOpenChange(false)}
                        className="flex items-center justify-between py-4 font-display text-[2.5rem] leading-none tracking-[-0.015em] aria-[current=page]:text-accent"
                      >
                        {item.label}
                        <span className="label text-muted">0{i + 1}</span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              <div className="mt-auto space-y-8 pt-12">
                <ButtonLink href="/contact" size="lg" className="w-full" onClick={() => onOpenChange(false)}>
                  Book a shoot
                </ButtonLink>
                <div className="flex items-end justify-between gap-6">
                  <div className="space-y-1 text-sm">
                    <a href={mailHref} className="block">{brand.email}</a>
                    <a href={telHref} className="block text-muted">{brand.phone}</a>
                  </div>
                  <ThemeToggle />
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
