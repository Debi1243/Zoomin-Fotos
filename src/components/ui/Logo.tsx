import Link from "next/link";
import { brand } from "@/lib/data";
import { cn } from "@/lib/cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("size-7", className)}>
      <circle cx="16" cy="16" r="12.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="5.5" fill="currentColor" />
      <circle cx="25.5" cy="6.5" r="2.5" className="fill-primary" />
    </svg>
  );
}

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2.5 rounded-sm", className)} aria-label={`${brand.name}, home`}>
      <LogoMark />
      <span className="font-display text-[1.625rem] leading-none tracking-[-0.01em]">
        Zoomin <span className="italic">Fotos</span>
      </span>
    </Link>
  );
}
