import Hero from "@/components/sections/home/Hero";
import ServiceCards from "@/components/sections/home/ServiceCards";
import Packages, { PackagesLink } from "@/components/sections/Packages";
import FeaturedPortfolio from "@/components/sections/home/FeaturedPortfolio";
import WhyUs from "@/components/sections/home/WhyUs";
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
      {/* Above the fold: what, where, from what price, one primary action. */}
      <Hero />
      {/* The argument: what we shoot, why us, the core promise, then the prices that back it up. */}
      <ServiceCards />
      <WhyUs />
      <TaglineReveal text={homeTagline} className="section-y border-t border-border" />
      {weddings?.packages && (
        <Packages
          items={weddings.packages}
          service="Wedding"
          label="Wedding packages"
          title="Clear prices. Everything listed."
          className="section-y bg-sand-soft"
          footer={
            <>
              <PackagesLink href="/packages#compare">Compare all packages side by side</PackagesLink>
              <PackagesLink href="/packages#builder">Build your own package</PackagesLink>
            </>
          }
        />
      )}
      {/* Proof, then how booking works, then objections, then the same action as the top. */}
      <FeaturedPortfolio />
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
