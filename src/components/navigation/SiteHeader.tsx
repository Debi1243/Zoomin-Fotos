"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Menu, MessageCircle, X } from "lucide-react";
import Logo from "../ui/Logo";
import { ButtonLink, WhatsAppButton } from "../ui/Button";
import { isActive, primaryNav } from "@/lib/site";
import { whatsappHref } from "@/lib/brand";
import { cn } from "@/lib/cn";

function subscribeScroll(cb: () => void) {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
}

const navActive = (pathname: string, href: string) => (href === "/" ? pathname === "/" : isActive(pathname, href));

/**
 * Sticky header. Desktop: logo, the six sections, WhatsApp and "Book Your Shoot".
 * Phones: logo, a WhatsApp shortcut and a menu that opens as a full-height sheet.
 */
export default function SiteHeader() {
  const pathname = usePathname();
  const scrolled = useSyncExternalStore(subscribeScroll, () => window.scrollY > 8, () => false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = menuRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Following a link closes the menu.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-bg/95 pt-[env(safe-area-inset-top)] backdrop-blur transition-[border-color,box-shadow] duration-200",
        scrolled ? "border-border shadow-sm" : "border-transparent",
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
              const active = navActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative inline-flex h-10 items-center rounded-md px-3 text-[0.9375rem] font-medium transition-colors",
                      active ? "text-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    {item.label}
                    {active && <span aria-hidden className="absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-primary" />}
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
              Book Your Shoot
            </ButtonLink>
          </div>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            data-track="whatsapp_click"
            data-track-source="header-icon"
            aria-label="Chat on WhatsApp"
            className="grid size-11 place-items-center rounded-md text-whatsapp hover:bg-sand-soft sm:hidden"
          >
            <MessageCircle aria-hidden className="size-6" />
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={open}
            className="grid size-11 place-items-center rounded-md border border-border bg-surface text-fg hover:border-fg lg:hidden"
          >
            <Menu aria-hidden className="size-5" />
          </button>
        </div>
      </div>

      <dialog
        ref={menuRef}
        aria-label="Menu"
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        className="sheet m-0 ml-auto h-dvh max-h-none w-full max-w-sm bg-bg p-0 text-fg shadow-md backdrop:bg-fg/40 lg:hidden"
      >
        <div className="flex h-full flex-col px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-[env(safe-area-inset-top)]">
          <div className="flex h-16 items-center justify-between">
            <span className="label text-muted">Menu</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="grid size-11 place-items-center rounded-md border border-border bg-surface hover:border-fg"
            >
              <X aria-hidden className="size-5" />
            </button>
          </div>
          <nav aria-label="Menu" className="mt-2">
            <ul className="divide-y divide-border border-y border-border">
              {primaryNav.map((item) => {
                const active = navActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex h-14 items-center justify-between font-display text-xl font-semibold",
                        active ? "text-accent" : "text-fg",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="mt-auto grid gap-3 pt-8">
            <ButtonLink href="/contact#quote" size="lg" className="w-full">
              Book Your Shoot
            </ButtonLink>
            <WhatsAppButton href={whatsappHref} source="menu" size="lg" className="w-full" />
          </div>
        </div>
      </dialog>
    </header>
  );
}
