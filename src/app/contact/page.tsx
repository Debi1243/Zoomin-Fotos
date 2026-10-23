import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
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
          <aside className="lg:col-span-4">
            <div className="rounded-lg border border-border bg-surface p-5 sm:p-6">
              <h2 className="font-display text-h3">Prefer to just chat?</h2>
              <p className="mt-2 text-sm text-muted">Message us on WhatsApp with any question, or call during {brand.hours}.</p>
              <WhatsAppButton href={whatsappHref} source="contact-aside" size="lg" className="mt-5 w-full" />
              <dl className="mt-6 space-y-4 border-t border-border pt-6 text-sm">
                {details.map(({ label, value, href, icon: Icon }) => (
                  <div key={label} className="flex gap-3">
                    <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
                    <div>
                      <dt className="text-muted">{label}</dt>
                      <dd className="mt-0.5 font-medium">
                        {href ? <a href={href} className="link-underline">{value}</a> : value}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
