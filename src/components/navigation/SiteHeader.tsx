"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import Logo from "../ui/Logo";
import { ButtonLink } from "../ui/Button";
import ThemeToggle from "./ThemeToggle";
import { isActive, primaryNav } from "@/lib/site";
import { cn } from "@/lib/cn";

const SCROLL_THRESHOLD = 8;

function subscribeScroll(cb: () => void) {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
}

function useScrolled() {
  return useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > SCROLL_THRESHOLD,
    () => false,
  );
}

// The header tucks away while reading down the page and returns on the first scroll up.
let lastY = 0;
let hidden = false;
function readHidden() {
  const y = window.scrollY;
  if (Math.abs(y - lastY) > 6) {
    hidden = y > lastY && y > 320;
    lastY = y;
  }
  return hidden;
}

function useHidden() {
  return useSyncExternalStore(subscribeScroll, readHidden, () => false);
}

export default function SiteHeader() {
  const pathname = usePathname();
  const scrolled = useScrolled();
  const tucked = useHidden();

  return (
    <header
      className={cn(
        "appbar sticky top-0 z-50 border-b bg-bg/85 pt-[env(safe-area-inset-top)] backdrop-blur-md transition-[translate,border-color,background-color,box-shadow] duration-500 ease-[var(--ease-out-expo)] focus-within:translate-y-0",
        scrolled ? "is-scrolled border-border" : "border-transparent",
        tucked && "-translate-y-full",
      )}
    >
      <a
        href="#main"
        className="sr-only rounded-md bg-fg px-4 py-2 text-sm text-bg focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60]"
      >
        Skip to content
      </a>

      <div className="appbar-row container-page relative flex h-16 items-center justify-between gap-6 md:h-[4.5rem]">
        <Logo className="appbar-logo" />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {primaryNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative inline-flex h-10 items-center rounded-md px-3 text-sm transition-colors",
                      active ? "text-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    {item.label}
                    {active && <span aria-hidden className="absolute inset-x-3 bottom-1.5 h-px bg-fg" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <ThemeToggle className="appbar-theme" />
          <div className="hidden sm:block">
            <ButtonLink href="/contact">Book a shoot</ButtonLink>
          </div>
        </div>
      </div>
    </header>
  );
}
