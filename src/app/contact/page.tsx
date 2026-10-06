import type { Metadata } from "next";
import type { CSSProperties } from "react";
import PhotoRibbon from "@/components/sections/PhotoRibbon";
import PageHero from "@/components/sections/PageHero";
import ContactForm from "@/components/forms/ContactForm";
import { brand, locationLine, mailHref, telHref } from "@/lib/data";

const description =
  "Check availability for your wedding, session or event with Zoomin Fotos, Bhubaneswar. We reply within one working day.";

export const metadata: Metadata = {
  title: "Book a shoot",
  description,
  alternates: { canonical: "/contact" },
  openGraph: { title: "Book a shoot", description, url: "/contact" },
};

const details = [
  { label: "Email", value: brand.email, href: mailHref },
  { label: "Phone or WhatsApp", value: brand.phone, href: telHref },
  { label: "Studio", value: locationLine },
  { label: "Hours", value: brand.hours },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        label="Book a shoot"
        title={<>Tell us about <em>your day.</em></>}
        intro="Share the date, the place and a little about what you have in mind. We will confirm availability and send a tailored quote within one working day."
      />
      <section id="enquiry" aria-label="Enquiry" className="scroll-mt-16 border-t border-border pb-24 pt-12 md:pb-32 md:pt-16">
        <div className="container-page grid gap-y-12 lg:grid-cols-12 lg:gap-x-10">
          <aside className="reveal-left lg:col-span-3">
            <dl className="space-y-7">
              {details.map((d) => (
                <div key={d.label}>
                  <dt className="label text-muted">{d.label}</dt>
                  <dd className="mt-2 text-[0.9375rem]">
                    {d.href ? <a href={d.href} className="link-underline">{d.value}</a> : d.value}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-10 border-t border-border pt-7">
              <p className="label text-muted">Booking a wedding?</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Popular dates go six to nine months ahead. Send yours even if plans are still forming, and we will hold it
                while you decide.
              </p>
            </div>
          </aside>
          <div className="reveal lg:col-span-9" style={{ "--i": 1 } as CSSProperties}>
            <ContactForm />
          </div>
        </div>
      </section>
      <PhotoRibbon rows={1} className="border-t border-border" />
    </>
  );
}
