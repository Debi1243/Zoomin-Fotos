"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { WhatsappLogoIcon } from "@phosphor-icons/react/dist/ssr";
import Logo from "../ui/Logo";
import { ButtonLink, WhatsAppButton } from "../ui/Button";
import { isActive, primaryNav } from "@/lib/site";
import { whatsappHref } from "@/lib/brand";
import { cn } from "@/lib/cn";

const navActive = (pathname: string, href: string) => (href === "/" ? pathname === "/" : isActive(pathname, href));

/** Two lines that turn into a cross when the menu opens, on the site's one motion curve. */
function MenuToggleIcon({ open }: { open: boolean }) {
  const line = "absolute left-0 h-0.5 w-5 rounded-full bg-current transition-transform duration-500 ease-[var(--ease-base)] motion-reduce:transition-none";
  return (
    <span aria-hidden className="relative block h-3 w-5">
      <span className={cn(line, "top-0", open ? "translate-y-[5px] rotate-45" : "")} />
      <span className={cn(line, "bottom-0", open ? "-translate-y-[5px] -rotate-45" : "")} />
    </span>
  );
}

/**
 * A compact bar that floats just below the top edge, translucent over a blur.
 * Desktop: logo, the six sections, WhatsApp and "Book your shoot".
 * Phones: logo, a WhatsApp shortcut and a toggle that opens a full-height menu panel.
 */
export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Following a link closes the menu.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  // While the menu is open: the page behind it can't be scrolled or tabbed to, and Escape closes it.
  useEffect(() => {
    if (!open) return;
    const behind = [document.getElementById("main"), document.querySelector("footer"), document.querySelector(".booking-bar")].filter(
      (el): el is HTMLElement => el instanceof HTMLElement,
    );
    behind.forEach((el) => (el.inert = true));
    const overflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      behind.forEach((el) => (el.inert = false));
      document.documentElement.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] sm:px-6">
      <a
        href="#main"
        className="sr-only rounded-lg bg-fg px-4 py-2 text-sm text-bg focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60]"
      >
        Skip to content
      </a>

      <div className="relative z-50 mx-auto flex w-full max-w-7xl items-center justify-between gap-4 rounded-2xl border border-border/80 bg-bg/80 py-2 pl-3 pr-2 shadow-sm backdrop-blur-xl lg:w-fit lg:gap-6">
        <Logo />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {primaryNav.map((item) => {
              const active = navActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex h-10 items-center rounded-lg px-3 title-4 transition-colors duration-300",
                      active ? "bg-sand text-fg" : "text-muted hover:bg-sand-soft hover:text-fg",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {/* Buttons set their own display, so visibility by screen size lives on a wrapper. */}
          <div className="hidden xl:block">
            <WhatsAppButton href={whatsappHref} source="header">
              WhatsApp
            </WhatsAppButton>
          </div>
          <div className="hidden sm:block">
            <ButtonLink href="/contact#quote" arrow={false}>
              Book your shoot
            </ButtonLink>
          </div>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            data-track="whatsapp_click"
            data-track-source="header-icon"
            aria-label="Chat on WhatsApp"
            className="grid size-11 place-items-center rounded-lg text-whatsapp transition-colors duration-300 hover:bg-sand-soft active:scale-[0.98] sm:hidden"
          >
            <WhatsappLogoIcon aria-hidden weight="fill" className="size-6" />
          </a>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="site-menu"
            className="grid size-11 place-items-center rounded-lg border border-border bg-surface text-fg transition-colors duration-300 hover:border-fg active:scale-[0.98] lg:hidden"
          >
            <MenuToggleIcon open={open} />
          </button>
        </div>
      </div>

      <div
        id="site-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
        className={cn("menu-panel fixed inset-0 z-40 overflow-y-auto bg-bg/95 backdrop-blur-2xl lg:hidden", open && "is-open")}
      >
        <div className="mx-auto flex min-h-full max-w-xl flex-col px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-[calc(6rem+env(safe-area-inset-top))] sm:px-6">
          <nav aria-label="Menu">
            <ul className="divide-y divide-border border-y border-border">
              {primaryNav.map((item, i) => {
                const active = navActive(pathname, item.href);
                return (
                  <li key={item.href} className="menu-link" style={{ "--i": i } as CSSProperties}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={cn("flex h-16 items-center justify-between heading-5", active ? "text-accent" : "text-fg")}
                    >
                      {item.label}
                      {active && <span className="caption-4 text-muted">You are here</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="menu-link mt-auto grid gap-3 pt-8" style={{ "--i": primaryNav.length } as CSSProperties}>
            <ButtonLink href="/contact#quote" size="lg" className="w-full" onClick={() => setOpen(false)}>
              Book your shoot
            </ButtonLink>
            <WhatsAppButton href={whatsappHref} source="menu" size="lg" className="w-full" />
          </div>
        </div>
      </div>
    </header>
  );
}
