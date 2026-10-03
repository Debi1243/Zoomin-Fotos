import Link from "next/link";
import type { CSSProperties } from "react";
import { brand } from "@/lib/data";
import { cn } from "@/lib/cn";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * The Zoomin Fotos logo. The artwork is used as a mask filled with `currentColor`,
 * so it follows the text colour: dark on the light theme, light on the dark theme.
 */
export function LogoMark({ size = "sm", className }: { size?: "sm" | "lg"; className?: string }) {
  const file = size === "sm" ? "logo-mask-sm.png" : "logo-mask.png";
  const mask = `url(${basePath}/brand/${file}) center / contain no-repeat`;
  return (
    <span
      aria-hidden
      className={cn("block aspect-[1.977] bg-current", className)}
      style={{ mask, WebkitMask: mask } as CSSProperties}
    />
  );
}

export default function Logo({ size = "sm", className }: { size?: "sm" | "lg"; className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex shrink-0 rounded-sm", className)} aria-label={`${brand.name}, home`}>
      <LogoMark size={size} className={size === "sm" ? "h-11 md:h-12" : "h-20"} />
    </Link>
  );
}
