import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight, LoaderCircle, MessageCircle } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * primary: terracotta, for booking actions only. whatsapp: opens a WhatsApp chat.
 * secondary: outlined, for everything else. inverse: kept for older callers; same as secondary.
 */
type Variant = "primary" | "whatsapp" | "secondary" | "inverse";
type Size = "md" | "lg";

const base =
  "btn group/btn relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold " +
  "transition-[background-color,border-color,color,box-shadow] duration-150 ease-out active:translate-y-px " +
  "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-primary-fg shadow-sm hover:bg-primary-hover",
  whatsapp: "bg-whatsapp text-white shadow-sm hover:bg-whatsapp-hover",
  secondary: "border border-border-strong bg-surface text-fg hover:border-fg",
  inverse: "border border-border-strong bg-surface text-fg hover:border-fg",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-[0.9375rem]",
};

export function buttonClasses({ variant = "primary", size = "md", className }: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

function Arrow() {
  return <ArrowRight aria-hidden className="size-4 transition-transform duration-150 ease-out group-hover/btn:translate-x-0.5" />;
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
      <MessageCircle aria-hidden className="size-[1.125rem]" />
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
      className={cn("group/btn inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-fg", className)}
      {...props}
    >
      <span className="link-underline">{children}</span>
      <Arrow />
    </Link>
  );
}
