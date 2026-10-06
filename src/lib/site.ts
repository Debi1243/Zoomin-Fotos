export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://debi1243.github.io/Zoomin-Fotos").replace(/\/$/, "");

export const primaryNav = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/services", label: "Services" },
  { href: "/testimonials", label: "Reviews" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function absoluteUrl(path = "/") {
  return `${siteUrl}${path === "/" ? "" : path}`;
}

export function isActive(pathname: string, href: string) {
  const path = pathname.replace(/\/$/, "") || "/";
  return path === href || path.startsWith(`${href}/`);
}

/** Where the admin page reads and saves photographs. Every save is a commit, which redeploys the site. */
export const contentRepo = { owner: "Debi1243", repo: "Zoomin-Fotos", branch: "main" } as const;
