"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const tabs = [
  { href: "/admin", label: "Photos" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/pricing", label: "Prices" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/dashboard", label: "Dashboard" },
];

/** Switches between the admin pages. */
export default function AdminTabs() {
  const path = usePathname().replace(/\/$/, "");
  return (
    <nav aria-label="Admin" className="flex max-w-full gap-1 overflow-x-auto rounded-full border border-border p-1 text-sm">
      {tabs.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          aria-current={path === t.href ? "page" : undefined}
          className={cn("shrink-0 whitespace-nowrap rounded-full px-4 py-2 transition-colors", path === t.href ? "bg-fg text-bg" : "text-muted hover:text-fg")}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
