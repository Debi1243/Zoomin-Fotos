import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import ServiceCards from "@/components/sections/home/ServiceCards";
import BookingSteps from "@/components/sections/BookingSteps";
import ClosingCta from "@/components/sections/ClosingCta";
import { ButtonLink } from "@/components/ui/Button";
import JsonLd from "@/components/shared/JsonLd";
import { brand } from "@/lib/data";
import { absoluteUrl } from "@/lib/site";

const description = `Wedding, pre-wedding, maternity, baby and kids, birthday and event, family portrait and commercial photography in ${brand.city} and across ${brand.region}.`;

export const metadata: Metadata = {
  title: `Photography Services in ${brand.city}`,
  description,
  alternates: { canonical: "/services" },
  openGraph: { title: `Photography Services in ${brand.city}`, description, url: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        label="Services"
        crumbs={[]}
        title="Photography services"
        intro={`Weddings, pre-weddings, maternity, kids, birthdays, family portraits and commercial shoots, across ${brand.city} and ${brand.region}.`}
      >
        <div className="mt-6">
          <ButtonLink href="/packages" variant="secondary">
            See all packages and prices
          </ButtonLink>
        </div>
      </PageHero>
      <ServiceCards />
      <BookingSteps />
      <ClosingCta />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: "Services", item: absoluteUrl("/services") },
          ],
        }}
      />
    </>
  );
}
