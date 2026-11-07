import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRightIcon as ArrowRight, CircleNotchIcon as LoaderCircle, WhatsappLogoIcon as MessageCircle } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/cn";

/**
 * primary: terracotta, for booking actions only. whatsapp: opens a WhatsApp chat.
 * secondary: outlined, for everything else. inverse: kept for older callers; same as secondary.
 */
type Variant = "primary" | "whatsapp" | "secondary" | "inverse";
type Size = "md" | "lg";

const base =
  "btn group/btn relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-lg " +
  "transition-[background-color,border-color,color,translate,scale] duration-300 ease-[var(--ease-base)] " +
  "hover:-translate-y-px active:translate-y-0 active:scale-[0.98] " +
  "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-primary-fg hover:bg-primary-hover",
  whatsapp: "bg-whatsapp text-white hover:bg-whatsapp-hover",
  secondary: "border border-border-strong bg-surface text-fg hover:border-fg hover:bg-sand-soft",
  inverse: "border border-border-strong bg-surface text-fg hover:border-fg hover:bg-sand-soft",
};

/** Main buttons: 8px by 12px padding. A minimum height keeps them easy to tap on phones. */
const sizes: Record<Size, string> = {
  md: "min-h-11 px-3 py-2 button-sm",
  lg: "min-h-12 px-4 py-3 button-md",
};

export function buttonClasses({ variant = "primary", size = "md", className }: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

function Arrow() {
  return <ArrowRight aria-hidden className="size-4 transition-transform duration-500 group-hover/btn:translate-x-0.5" />;
}

type LinkProps = ComponentProps<typeof Link> & { variant?: Variant; size?: Size; arrow?: boolean; children: ReactNode };

export function ButtonLink({ variant, size, arrow = true, className, children, ...props }: LinkProps) {
  return (
    <Link className={buttonClasses({ variant, size, className })} {...props}>
      {children}
      {arrow && <Arrow />}
    </Link>
  );
}

type WhatsAppProps = Omit<ComponentProps<"a">, "href" | "target" | "rel"> & {
  href: string;
  size?: Size;
  /** Where the click came from, for the conversion count (e.g. "hero", "package:Signature"). */
  source: string;
};

/** Opens a WhatsApp chat in a new tab or the app. Clicks are counted as `whatsapp_click`. */
export function WhatsAppButton({ href, size, source, className, children = "Chat on WhatsApp", ...props }: WhatsAppProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-track="whatsapp_click"
      data-track-source={source}
      className={buttonClasses({ variant: "whatsapp", size, className })}
      {...props}
    >
      <MessageCircle aria-hidden weight="fill" className="size-5" />
      {children}
    </a>
  );
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant; size?: Size; loading?: boolean; loadingLabel?: string; arrow?: boolean };

export function Button({ variant, size, loading = false, loadingLabel, arrow = true, className, children, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={buttonClasses({ variant, size, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <>
          <LoaderCircle aria-hidden className="size-4 animate-spin" />
          {loadingLabel ?? children}
        </>
      ) : (
        <>
          {children}
          {arrow && <Arrow />}
        </>
      )}
    </button>
  );
}

/** Quiet text link with a trailing arrow, for tertiary actions. */
export function TextLink({ className, children, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn("group/btn inline-flex min-h-11 items-center gap-2 button-sm text-accent transition-colors hover:text-fg", className)}
      {...props}
    >
      <span className="link-underline">{children}</span>
      <Arrow />
    </Link>
  );
}

/** WhatsApp as a quiet second action beside a page's one primary button. Counted as `whatsapp_click`. */
export function WhatsAppLink({ href, source, className, children = "Or ask us on WhatsApp" }: { href: string; source: string; className?: string; children?: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-track="whatsapp_click"
      data-track-source={source}
      className={cn("group/btn inline-flex min-h-11 items-center gap-2 button-sm text-whatsapp-text transition-colors duration-300 hover:text-whatsapp-text-hover", className)}
    >
      <MessageCircle aria-hidden weight="fill" className="size-5" />
      <span className="link-underline">{children}</span>
    </a>
  );
}
