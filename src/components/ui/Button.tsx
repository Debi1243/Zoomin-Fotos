import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "inverse";
type Size = "md" | "lg";

const base =
  "btn group/btn relative inline-flex select-none items-center justify-center gap-2.5 whitespace-nowrap rounded-md font-medium " +
  "transition-[background-color,border-color,color,transform] duration-200 ease-out active:translate-y-px " +
  "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "btn-festive bg-primary text-primary-fg",
  secondary: "border border-border-strong text-fg hover:border-fg hover:bg-fg/[0.04]",
  inverse: "bg-inverse-fg text-inverse hover:bg-primary hover:text-primary-fg",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-4 text-sm",
  lg: "h-13 px-5 text-[0.9375rem]",
};

export function buttonClasses({ variant = "primary", size = "md", className }: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

function Arrow() {
  return <ArrowRight aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover/btn:translate-x-0.5" />;
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

type ButtonProps = ComponentProps<"button"> & { variant?: Variant; size?: Size; loading?: boolean; loadingLabel?: string };

export function Button({ variant, size, loading = false, loadingLabel, className, children, disabled, ...props }: ButtonProps) {
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
          <Arrow />
        </>
      )}
    </button>
  );
}

/** Quiet text link with a trailing arrow, for tertiary actions. */
export function TextLink({ className, children, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn("group/btn inline-flex items-center gap-2 text-sm font-medium text-fg hover:text-accent", className)}
      {...props}
    >
      <span className="link-underline">{children}</span>
      <Arrow />
    </Link>
  );
}
