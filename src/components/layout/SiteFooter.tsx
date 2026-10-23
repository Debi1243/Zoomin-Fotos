import Link from "next/link";
import Logo from "../ui/Logo";
import { brand, locationLine, mailHref, services, telHref, whatsappHref } from "@/lib/data";
import { primaryNav } from "@/lib/site";

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-page grid gap-10 py-12 md:py-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <Logo size="lg" />
          <p className="mt-4 max-w-[40ch] text-sm leading-relaxed text-muted">{brand.description}</p>
          <address className="mt-6 space-y-2 text-sm not-italic">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" data-track="whatsapp_click" data-track-source="footer" className="link-underline block w-fit font-semibold text-whatsapp">
              WhatsApp {brand.whatsapp}
            </a>
            <a href={telHref} className="link-underline block w-fit">Call {brand.phone}</a>
            <a href={mailHref} className="link-underline block w-fit">{brand.email}</a>
            <span className="block text-muted">{locationLine}</span>
            <span className="block text-muted">{brand.hours}</span>
          </address>
        </div>

        <nav aria-label="Site" className="lg:col-span-3 lg:col-start-7">
          <h2 className="label text-muted">Explore</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {primaryNav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-underline">{l.label}</Link>
              </li>
            ))}
            <li>
              <Link href="/testimonials" className="link-underline">Reviews</Link>
            </li>
            <li>
              <Link href="/portal" className="link-underline">Client login</Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Services" className="lg:col-span-3">
          <h2 className="label text-muted">Photography</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="link-underline">{s.title}</Link>
              </li>
            ))}
            <li>
              <a href={brand.googleReviews} target="_blank" rel="noreferrer" className="link-underline">Google reviews</a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-border">
        <div className="container-page py-5 text-xs text-muted">
          <p>© {year} {brand.name}, {brand.city}. All prices are before GST. All photographs are by {brand.name}.</p>
        </div>
      </div>
    </footer>
  );
}
