import type { Metadata } from "next";
import type { CSSProperties } from "react";
import PhotoRibbon from "@/components/sections/PhotoRibbon";
import Link from "next/link";
import PageHero from "@/components/sections/PageHero";
import PhotoFrame from "@/components/photos/PhotoFrame";
import PackageBuilder from "@/components/sections/PackageBuilder";
import ProcessSteps from "@/components/sections/ProcessSteps";
import ClosingCta from "@/components/sections/ClosingCta";
import { formatRupees, photosIn, services, serviceTone } from "@/lib/data";

const description =
  "Wedding, pre-wedding, portrait, maternity and newborn, event and commercial photography in Bhubaneswar and across Odisha.";

export const metadata: Metadata = {
  title: "Services",
  description,
  alternates: { canonical: "/services" },
  openGraph: { title: "Services", description, url: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        label="Services"
        title={<>What we <em>photograph.</em></>}
        intro="Six kinds of shoot, each planned around you. Every booking includes a planning call, hand-edited images and a private online gallery."
      />
      <section aria-label="All services" className="border-t border-border pb-24 pt-12 md:pb-32 md:pt-16">
        <ul className="container-page grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
          {services.map((s, i) => {
            const cover = photosIn(s.slug)[0];
            return (
              <li key={s.slug} className="reveal flex flex-col" style={{ "--i": i % 3, "--tone": serviceTone[s.slug] } as CSSProperties}>
                <Link href={`/services/${s.slug}`} className="group block">
                  {cover && (
                    <PhotoFrame
                      photo={{ ...cover, aspect: "portrait" }}
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                      reveal
                      className="transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[0.985]"
                    />
                  )}
                  <p className="label tabular mt-6 flex items-center gap-3 text-[var(--tone)]">
                    <span aria-hidden className="h-[3px] w-6 rounded-full bg-[var(--tone)]" />0{i + 1}
                  </p>
                  <h2 id={`svc-${s.slug}`} className="mt-3 font-display text-h3 transition-colors group-hover:text-[var(--tone)]">
                    {s.title}
                  </h2>
                </Link>
                <p className="mt-3 max-w-[40ch] leading-relaxed text-muted">{s.short}</p>
                {s.packages && (
                  <p className="mt-3 text-sm">
                    From <span className="tabular font-medium">{formatRupees(Math.min(...s.packages.map((p) => p.price)))}</span>
                    {s.packages.some((p) => !p.unit || p.unit.includes("GST")) && " + GST"}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </section>
      <PackageBuilder />
      <PhotoRibbon className="border-t border-border" />
      <ProcessSteps />
      <ClosingCta />
    </>
  );
}
