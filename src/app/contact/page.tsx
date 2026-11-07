import type { Metadata } from "next";
import { EnvelopeIcon as Mail, MapPinIcon as MapPin, PhoneIcon as Phone } from "@phosphor-icons/react/dist/ssr";
import PageHero from "@/components/sections/PageHero";
import QuoteForm from "@/components/forms/QuoteForm";
import { WhatsAppButton } from "@/components/ui/Button";
import { brand, locationLine, mailHref, telHref, whatsappHref } from "@/lib/data";

const description = `Get a photography quote from ${brand.name}, ${brand.city}. Tell us your date, place and budget, and we confirm availability on WhatsApp.`;

export const metadata: Metadata = {
  title: "Get a Photography Quote",
  description,
  alternates: { canonical: "/contact" },
  openGraph: { title: "Get a Photography Quote", description, url: "/contact" },
};

const details = [
  { label: "Call", value: brand.phone, href: telHref, icon: Phone },
  { label: "Email", value: brand.email, href: mailHref, icon: Mail },
  { label: "Studio", value: locationLine, icon: MapPin },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        label="Contact"
        title="Get your photography quote"
        intro="Answer seven quick questions. We'll open WhatsApp with your enquiry written out, so you can send it in one tap."
      />
      <section aria-label="Quote form" className="container-page pb-16 md:pb-24">
        {/* Older links point at #enquiry; it lands in the same place as #quote. */}
        <span id="enquiry" aria-hidden className="block scroll-mt-24" />
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div id="quote" className="scroll-mt-24 lg:col-span-8">
            <QuoteForm />
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
          </div>
        </div>
      </section>
    </>
  );
}
