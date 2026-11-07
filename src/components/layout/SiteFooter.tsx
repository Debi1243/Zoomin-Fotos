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
          <p className="mt-4 max-w-[40ch] body-6 text-muted">{brand.description}</p>
          <address className="mt-6 body-6 not-italic lg:space-y-2">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" data-track="whatsapp_click" data-track-source="footer" className="flex min-h-11 w-fit items-center body-4 text-whatsapp-text lg:min-h-0">
              <span className="link-underline">WhatsApp {brand.whatsapp}</span>
            </a>
            <a href={telHref} className="flex min-h-11 w-fit items-center lg:min-h-0"><span className="link-underline">Call {brand.phone}</span></a>
            <a href={mailHref} className="flex min-h-11 w-fit items-center lg:min-h-0"><span className="link-underline">{brand.email}</span></a>
            <span className="block text-muted">{locationLine}</span>
            <span className="block text-muted">{brand.hours}</span>
          </address>
        </div>

        <nav aria-label="Site" className="lg:col-span-3 lg:col-start-7">
          <h2 className="label text-muted">Explore</h2>
          <ul className="mt-2 body-6 lg:mt-4 lg:space-y-2">
            {primaryNav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-11 items-center lg:min-h-0"><span className="link-underline">{l.label}</span></Link>
              </li>
            ))}
            <li>
              <Link href="/testimonials" className="inline-flex min-h-11 items-center lg:min-h-0"><span className="link-underline">Reviews</span></Link>
            </li>
            <li>
              <Link href="/portal" className="inline-flex min-h-11 items-center lg:min-h-0"><span className="link-underline">Client login</span></Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Services" className="lg:col-span-3">
          <h2 className="label text-muted">Photography</h2>
          <ul className="mt-2 body-6 lg:mt-4 lg:space-y-2">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="inline-flex min-h-11 items-center lg:min-h-0"><span className="link-underline">{s.title}</span></Link>
              </li>
            ))}
            <li>
              <a href={brand.googleReviews} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center lg:min-h-0"><span className="link-underline">Google reviews</span></a>
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
