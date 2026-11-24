import type { Metadata } from "next";
import { EnvelopeIcon as Mail, MapPinIcon as MapPin, PhoneIcon as Phone } from "@phosphor-icons/react/dist/ssr";
import PageHero from "@/components/sections/PageHero";
import QuoteForm from "@/components/forms/QuoteForm";
import { WhatsAppButton } from "@/components/ui/Button";
import { bookingSteps, brand, formatRupees, getService, locationLine, mailHref, supportMailHref, telHref, whatsappHref } from "@/lib/data";

const description = `Check availability and get a quote from ${brand.name}, wedding photographers in ${brand.city}. Tell us your date, venue and budget, and we confirm on WhatsApp.`;
const title = "Check Availability & Get a Quote";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/contact" },
  openGraph: { title, description, url: "/contact" },
};

/** The wedding packages as the form lists them, in the same wording the package cards send. */
const weddingPackages = (getService("weddings")?.packages ?? []).map((p) => `${p.name}, ${formatRupees(p.price)} + GST`);

const details = [
  { label: "Call", value: brand.phone, href: telHref, icon: Phone },
  { label: "Email", value: brand.email, href: mailHref, icon: Mail },
  { label: "Support for orders and bookings", value: brand.supportEmail, href: supportMailHref, icon: Mail },
  { label: "Studio", value: locationLine, icon: MapPin },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        label="Contact"
        title="Check availability for your date"
        intro="Answer a few quick questions. We'll open WhatsApp with your enquiry written out, so you can send it in one tap, and reply to confirm your date and price."
      />
      <section aria-label="Quote form" className="container-page pb-16 md:pb-24">
        {/* Older links point at #enquiry; it lands in the same place as #quote. */}
        <span id="enquiry" aria-hidden className="block scroll-mt-24" />
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div id="quote" className="scroll-mt-24 lg:col-span-8">
            <QuoteForm weddingPackages={weddingPackages} />
          </div>
          <div role="region" aria-labelledby="chat-title" className="lg:col-span-4">
            <div className="rounded-xl border border-border bg-surface p-6">
              <h2 id="chat-title" className="heading-5">Prefer to just chat?</h2>
              <p className="mt-2 body-6 text-muted">Message us on WhatsApp with any question, or call during {brand.hours}.</p>
              <WhatsAppButton href={whatsappHref} source="contact-aside" size="lg" className="mt-6 w-full" />
              <dl className="mt-6 space-y-4 border-t border-border pt-6">
                {details.map(({ label, value, href, icon: Icon }) => (
                  <div key={label} className="grid grid-cols-[1rem_1fr] gap-x-3">
                    <dt className="col-span-2 flex items-center gap-3 caption-2 text-muted">
                      <Icon aria-hidden className="size-4 shrink-0 text-accent" />
                      {label}
                    </dt>
                    <dd className="col-start-2 body-5">
                      {href ? (
                        <a href={href} className="inline-flex min-h-11 items-center">
                          <span className="link-underline">{value}</span>
                        </a>
                      ) : (
                        value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="mt-6 rounded-xl border border-border bg-surface p-6">
              <h2 className="heading-6">What happens next</h2>
              <ol className="mt-4 space-y-4">
                {bookingSteps.map((s, i) => (
                  <li key={s.title} className="grid grid-cols-[1.75rem_1fr] gap-x-3">
                    <span aria-hidden className="tabular grid size-7 place-items-center rounded-full bg-primary caption-3 text-primary-fg">{i + 1}</span>
                    <div>
                      <h3 className="body-4">{s.title}</h3>
                      <p className="mt-1 body-6 text-muted">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-4 border-t border-border pt-4 caption-2 text-muted">Delivery dates for your photos, films and album are written into your quote before you book.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
