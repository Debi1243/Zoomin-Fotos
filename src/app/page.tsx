import Hero from "@/components/sections/home/Hero";
import ServiceCards from "@/components/sections/home/ServiceCards";
import Packages, { PackagesLink } from "@/components/sections/Packages";
import FeaturedPortfolio from "@/components/sections/home/FeaturedPortfolio";
import WhyUs from "@/components/sections/home/WhyUs";
import TrustStrip from "@/components/sections/home/TrustStrip";
import HomeReviews from "@/components/sections/home/HomeReviews";
import BookingSteps from "@/components/sections/BookingSteps";
import Faq from "@/components/sections/Faq";
import ClosingCta from "@/components/sections/ClosingCta";
import TaglineReveal from "@/components/sections/TaglineReveal";
import JsonLd from "@/components/shared/JsonLd";
import { brand, getService, homeFaqs, homeTagline, services } from "@/lib/data";
import { absoluteUrl, siteUrl } from "@/lib/site";

export default function HomePage() {
  const weddings = getService("weddings");

  return (
    <>
      {/* Above the fold: the promise, a wedding photograph and two ways in. */}
      <Hero />
      {/* Proof first: verified facts, then the work itself, told as a wedding day. */}
      <TrustStrip />
      <FeaturedPortfolio />
      <ServiceCards />
      {weddings?.packages && (
        <Packages
          items={weddings.packages}
          service="Wedding"
          payOnline="weddings"
          label="Wedding packages"
          title="Clear prices. Everything listed."
          className="section-y surface-soft"
          footer={
            <>
              <PackagesLink href="/packages#compare">Compare all packages side by side</PackagesLink>
              <PackagesLink href="/packages#builder">Build your own package</PackagesLink>
              <PackagesLink href="/packages#packages">What&apos;s included and what costs extra</PackagesLink>
            </>
          }
        />
      )}
      <WhyUs />
      <TaglineReveal text={homeTagline} className="section-y border-t border-border" />
      {/* Clients in their own words, how booking works, objections, then the same action as the top. */}
      <HomeReviews className="pb-16 md:pb-24" />
      <BookingSteps />
      <Faq items={homeFaqs} />
      <ClosingCta />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          "@id": `${siteUrl}/#studio`,
          name: brand.name,
          description: brand.description,
          url: siteUrl,
          logo: absoluteUrl("/icon.png"),
          image: absoluteUrl("/opengraph-image"),
          email: brand.email,
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: brand.supportEmail,
            telephone: brand.phone.replace(/\s/g, ""),
          },
          telephone: brand.phone.replace(/\s/g, ""),
          priceRange: "₹15,000+",
          address: {
            "@type": "PostalAddress",
            addressLocality: brand.city,
            addressRegion: brand.region,
            addressCountry: brand.country,
          },
          areaServed: [
            { "@type": "City", name: brand.city },
            { "@type": "State", name: brand.region },
          ],
          sameAs: [brand.googleReviews],
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Photography services",
            itemListElement: services.map((s) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: `${s.title} photography`, url: absoluteUrl(`/services/${s.slug}`) },
            })),
          },
        }}
      />
    </>
  );
}
