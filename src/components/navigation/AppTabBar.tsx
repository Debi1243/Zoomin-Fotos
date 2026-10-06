"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Aperture, CalendarHeart, House, Images, UserRound, type LucideIcon } from "lucide-react";
import { isActive } from "@/lib/site";

const tabs: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Home", icon: House },
  { href: "/portfolio", label: "Portfolio", icon: Images },
  { href: "/services", label: "Services", icon: Aperture },
  { href: "/about", label: "About", icon: UserRound },
  { href: "/contact", label: "Book", icon: CalendarHeart },
];

/**
 * Bottom tab bar for phones and tablets, in the manner of a native app. Its look
 * (iOS translucent bar or Android navigation bar) comes from the platform the head
 * script detected; see `.tabbar` in globals.css.
 */
export default function AppTabBar() {
  const pathname = usePathname();

  return (
    <nav aria-label="App" className="tabbar lg:hidden">
      <ul className="tabbar-list">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : isActive(pathname, href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className="tabbar-item"
                onClick={(e) => {
                  // Tapping the tab you are on scrolls back to the top, as in native apps.
                  if (active) {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } else if (document.documentElement.dataset.platform === "android") navigator.vibrate?.(8);
                }}
              >
                <span className="tabbar-icon">
                  <Icon aria-hidden strokeWidth={active ? 2.25 : 1.75} />
                </span>
                <span className="tabbar-label">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
