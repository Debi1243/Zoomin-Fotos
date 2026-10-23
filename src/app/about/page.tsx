import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import PhotoFrame from "@/components/photos/PhotoFrame";
import WhyUs from "@/components/sections/home/WhyUs";
import BookingSteps from "@/components/sections/BookingSteps";
import ClosingCta from "@/components/sections/ClosingCta";
import { brand, pickPhotos } from "@/lib/data";

const description = `${brand.name} is a photography studio in ${brand.city}, ${brand.region}, for weddings, families, events and brands, with clear prices and easy WhatsApp booking.`;

export const metadata: Metadata = {
  title: "About Us",
  description,
  alternates: { canonical: "/about" },
  openGraph: { title: "About Us", description, url: "/about" },
};

const [aboutLeft, aboutRight] = pickPhotos(["59", "28"]);

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="About"
        crumbs={[]}
        title="A photography studio in Bhubaneswar that likes people more than poses"
        intro={`${brand.name} photographs weddings, families, milestones and the businesses that make ${brand.region} what it is, with prices you can see before you call.`}
      />

      <section aria-labelledby="story-title" className="section-y border-t border-border">
        <div className="container-page grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-6">
            <PhotoFrame photo={{ ...aboutLeft, aspect: "portrait" }} sizes="(min-width: 1024px) 25vw, 50vw" reveal />
            <PhotoFrame photo={{ ...aboutRight, aspect: "portrait" }} sizes="(min-width: 1024px) 25vw, 50vw" className="mt-10" reveal />
          </div>
          <div className="reveal lg:col-span-6">
            <p className="label text-accent">Our story</p>
            <h2 id="story-title" className="mt-3 font-display text-h2">
              The photos people treasure most are the ones where everyone looks like themselves.
            </h2>
            <div className="mt-6 space-y-4 text-lead text-muted">
              <p>
                So we work quietly, direct gently and spend our time noticing: the aunt fixing a dupatta, the groom&apos;s father
                pretending not to cry, the toddler who refuses to stand still. Those are the frames that end up on walls.
              </p>
              <p>
                We also think booking a photographer should be simple. That is why our packages and prices are on the website, and why
                you can ask us anything on WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      <WhyUs />
      <BookingSteps />
      <ClosingCta />
    </>
  );
}
