import Link from "next/link";
import Logo from "../ui/Logo";
import { brand, locationLine, mailHref, services, telHref } from "@/lib/data";
import { primaryNav } from "@/lib/site";

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-page grid gap-12 py-16 md:py-20 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <Logo size="lg" />
          <p className="mt-5 max-w-[36ch] text-sm leading-relaxed text-muted">{brand.description}</p>
          <address className="mt-8 space-y-1.5 text-sm not-italic">
            <a href={mailHref} className="link-underline block w-fit">{brand.email}</a>
            <a href={telHref} className="link-underline block w-fit">{brand.phone}</a>
            <span className="block text-muted">{locationLine}</span>
          </address>
        </div>

        <nav aria-label="Studio" className="lg:col-span-3 lg:col-start-7">
          <h2 className="label text-muted">Studio</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {[{ href: "/", label: "Home" }, ...primaryNav].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-underline">{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Services" className="lg:col-span-3">
          <h2 className="label text-muted">What we photograph</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="link-underline">{s.title}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {brand.name}. All photographs are the property of their makers.</p>
          <a href="#main" className="link-underline w-fit">Back to top</a>
        </div>
      </div>
    </footer>
  );
}
