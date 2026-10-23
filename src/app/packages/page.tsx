import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import Packages from "@/components/sections/Packages";
import PackageCompare from "@/components/sections/PackageCompare";
import PackageBuilder from "@/components/sections/PackageBuilder";
import Faq from "@/components/sections/Faq";
import ClosingCta from "@/components/sections/ClosingCta";
import JsonLd from "@/components/shared/JsonLd";
import { WhatsAppButton } from "@/components/ui/Button";
import { brand, getService, homeFaqs, services, waLink } from "@/lib/data";
import { absoluteUrl } from "@/lib/site";

const description = `Photography packages and prices in ${brand.city}: wedding packages from ₹25,000 per day and pre-wedding shoots from ₹15,000, plus GST. Compare packages or build your own.`;

export const metadata: Metadata = {
  title: "Photography Packages & Prices",
  description,
  alternates: { canonical: "/packages" },
  openGraph: { title: "Photography Packages & Prices", description, url: "/packages" },
};

export default function PackagesPage() {
  const weddings = getService("weddings");
  const preWedding = getService("pre-wedding");
  const quoted = services.filter((s) => !s.packages);

  return (
    <>
      <PageHero
        label="Packages"
        crumbs={[]}
        title="Photography packages and prices"
        intro="Every price is on the page, before GST, and every price is negotiable. Choose a package, compare them side by side, or build your own."
      >
        <nav aria-label="On this page" className="mt-6 flex flex-wrap gap-2">
          {[
            ["#packages", "Wedding packages"],
            ["#compare", "Compare"],
            ["#pre-wedding", "Pre-wedding"],
            ["#builder", "Build your own"],
            ["#other", "Other shoots"],
          ].map(([href, label]) => (
            <a key={href} href={href} className="inline-flex h-10 items-center rounded-full border border-border bg-surface px-4 text-sm font-medium hover:border-fg">
              {label}
            </a>
          ))}
        </nav>
      </PageHero>

      {weddings?.packages && (
        <Packages items={weddings.packages} service="Wedding" title="Wedding packages" className="border-t border-border" />
      )}
      {weddings?.packages && <PackageCompare packages={weddings.packages} />}
      {preWedding?.packages && (
        <Packages id="pre-wedding" items={preWedding.packages} service="Pre-wedding" title="Pre-wedding shoot" intro={preWedding.packagesIntro} />
      )}
      <PackageBuilder className="border-t border-border" />

      <section id="other" aria-labelledby="other-title" className="section-y scroll-mt-20 bg-sand-soft">
        <div className="container-page">
          <p className="label text-accent">Other shoots</p>
          <h2 id="other-title" className="mt-3 font-display text-h2">Quoted for your shoot</h2>
          <p className="mt-4 max-w-[60ch] text-lead text-muted">
            These depend on the hours, the location and any albums or prints. Tell us what you need and we&apos;ll send a clear, itemised quote.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quoted.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="group flex h-full items-center justify-between gap-4 rounded-lg border border-border bg-surface p-5 hover:border-border-strong hover:shadow-md"
                >
                  <span>
                    <span className="block font-display text-lg">{s.title}</span>
                    <span className="mt-1 block text-sm text-muted">Ask for a quote</span>
                  </span>
                  <ArrowRight aria-hidden className="size-5 shrink-0 text-accent transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
          <WhatsAppButton
            href={waLink("Hi Zoomin Fotos! Could you send me a quote for a photoshoot?")}
            source="packages-other"
            size="lg"
            className="mt-8"
          >
            Ask for a quote on WhatsApp
          </WhatsAppButton>
        </div>
      </section>

      <Faq items={homeFaqs.slice(0, 4)} title="Questions about packages" name="packages-faq" />
      <ClosingCta />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: "Packages", item: absoluteUrl("/packages") },
          ],
        }}
      />
    </>
  );
}
