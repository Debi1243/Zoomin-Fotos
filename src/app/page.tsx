import Hero from "@/components/sections/home/Hero";
import ServiceStories from "@/components/sections/home/ServiceStories";
import Marquee from "@/components/sections/home/Marquee";
import FeaturedPhotos from "@/components/sections/home/FeaturedPhotos";
import FilmStrip from "@/components/sections/home/FilmStrip";
import { ServicesSection } from "@/components/sections/home/ServiceIndex";
import PhotoRibbon from "@/components/sections/PhotoRibbon";
import Approach from "@/components/sections/home/Approach";
import HomeReviews from "@/components/sections/home/HomeReviews";
import ProcessSteps from "@/components/sections/ProcessSteps";
import Faq from "@/components/sections/Faq";
import ClosingCta from "@/components/sections/ClosingCta";
import JsonLd from "@/components/shared/JsonLd";
import { brand, homeFaqs, services } from "@/lib/data";
import { absoluteUrl, siteUrl } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <ServiceStories />
      <Hero />
      <Marquee />
      <FeaturedPhotos />
      <FilmStrip />
      <ServicesSection />
      <PhotoRibbon />
      <Approach />
      <HomeReviews />
      <ProcessSteps />
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
          email: brand.email,
          telephone: brand.phone.replace(/\s/g, ""),
          address: {
            "@type": "PostalAddress",
            addressLocality: brand.city,
            addressRegion: brand.region,
            addressCountry: brand.country,
          },
          areaServed: "IN",
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
