import type { Metadata } from "next";
import type { CSSProperties } from "react";
import PhotoRibbon from "@/components/sections/PhotoRibbon";
import PageHero from "@/components/sections/PageHero";
import PhotoFrame from "@/components/photos/PhotoFrame";
import Approach from "@/components/sections/home/Approach";
import ProcessSteps from "@/components/sections/ProcessSteps";
import ClosingCta from "@/components/sections/ClosingCta";
import { brand, photos } from "@/lib/data";

const description =
  "Zoomin Fotos is a photography studio in Bhubaneswar that photographs weddings, families, events and brands with a calm, candid approach.";

export const metadata: Metadata = {
  title: "About",
  description,
  alternates: { canonical: "/about" },
  openGraph: { title: "About", description, url: "/about" },
};

const byId = (id: string) => photos.find((p) => p.id === id)!;

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="About"
        title={<>A small studio that likes <em>people</em> more than poses.</>}
        intro={`${brand.name} is a photography studio based in ${brand.city}. We photograph weddings, families, milestones and the businesses that make ${brand.region} what it is.`}
      />

      <section aria-labelledby="story-title" className="border-t border-border section-y">
        <div className="container-page grid gap-y-12 lg:grid-cols-12 lg:gap-x-10">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-5">
            <PhotoFrame photo={byId("02")} sizes="(min-width: 1024px) 20vw, 50vw" reveal />
            <PhotoFrame photo={byId("17")} sizes="(min-width: 1024px) 20vw, 50vw" className="mt-12" style={{ "--i": 2 } as CSSProperties} reveal />
          </div>
          <div className="reveal-right lg:col-span-6 lg:col-start-7">
            <h2 id="story-title" className="label text-muted">Our story</h2>
            <p className="mt-6 font-display text-[clamp(1.75rem,1.3rem+1.8vw,2.75rem)] leading-[1.12]">
              We started Zoomin Fotos because the photographs people treasure most are rarely the perfect ones. They are the
              ones where everyone looks like themselves.
            </p>
            <div className="mt-8 space-y-5 leading-relaxed text-muted">
              <p>
                So we work quietly, direct gently and spend our time noticing: the aunt fixing a dupatta, the groom&apos;s
                father pretending not to cry, the toddler who refuses to stand still. Those are the frames that end up on
                walls.
              </p>
              <p>
                Every gallery is edited by hand, in colours that match what you saw on the day, and kept safely backed up
                long after delivery. When it is time for an album or a print, we design and produce it ourselves.
              </p>
            </div>
          </div>
        </div>
      </section>

      <PhotoRibbon />
      <Approach />
      <ProcessSteps />
      <ClosingCta />
    </>
  );
}
