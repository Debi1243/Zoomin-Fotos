"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState, useSyncExternalStore } from "react";
import Logo from "../ui/Logo";
import { ButtonLink } from "../ui/Button";
import ThemeToggle from "./ThemeToggle";
import MobileMenu from "./MobileMenu";
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
  // The menu remembers the path it was opened on, so navigating closes it without an effect.
  const [mobileOpenOn, setMobileOpenOn] = useState<string | null>(null);
  const mobileOpen = mobileOpenOn === pathname;
  const onMobileOpenChange = useCallback((next: boolean) => setMobileOpenOn(next ? pathname : null), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-bg/85 backdrop-blur-md transition-[translate,border-color] duration-500 ease-[var(--ease-out-expo)] focus-within:translate-y-0",
        scrolled || mobileOpen ? "border-border" : "border-transparent",
        tucked && !mobileOpen && "-translate-y-full",
      )}
    >
      <a
        href="#main"
        className="sr-only rounded-md bg-fg px-4 py-2 text-sm text-bg focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60]"
      >
        Skip to content
      </a>

      <div className="container-page flex h-16 items-center justify-between gap-6 md:h-[4.5rem]">
        <Logo />

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

        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <ThemeToggle />
          </div>
          <div className="hidden sm:block">
            <ButtonLink href="/contact">Book a shoot</ButtonLink>
          </div>
          <MobileMenu open={mobileOpen} onOpenChange={onMobileOpenChange} pathname={pathname} />
        </div>
      </div>
    </header>
  );
}
