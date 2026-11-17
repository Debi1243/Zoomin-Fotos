export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://debi1243.github.io/Zoomin-Fotos").replace(/\/$/, "");

/**
 * The shop (/shop). While false it is hidden: no menu or footer link, left out of the sitemap,
 * and the page itself shows "Page not found". Set it to true to open the shop.
 */
export const shopEnabled = false;

const allNav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/packages", label: "Packages" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const primaryNav = allNav.filter((item) => item.href !== "/shop" || shopEnabled);

export function absoluteUrl(path = "/") {
  return `${siteUrl}${path === "/" ? "" : path}`;
}

export function isActive(pathname: string, href: string) {
  const path = pathname.replace(/\/$/, "") || "/";
  return path === href || path.startsWith(`${href}/`);
}

/** Where the admin page reads and saves photographs. Every save is a commit, which redeploys the site. */
export const contentRepo = { owner: "Debi1243", repo: "Zoomin-Fotos", branch: "main" } as const;
