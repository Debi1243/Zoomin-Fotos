import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import PhotoFrame from "@/components/photos/PhotoFrame";
import PortfolioGallery from "@/components/photos/PortfolioGallery";
import Packages, { PackagesLink } from "@/components/sections/Packages";
import PackageBuilder from "@/components/sections/PackageBuilder";
import FilmGrid from "@/components/sections/FilmGrid";
import HomeReviews from "@/components/sections/home/HomeReviews";
import Faq from "@/components/sections/Faq";
import ClosingCta from "@/components/sections/ClosingCta";
import SectionHeader from "@/components/ui/SectionHeader";
import { ButtonLink, TextLink, WhatsAppButton } from "@/components/ui/Button";
import JsonLd from "@/components/shared/JsonLd";
import { brand, formatRupees, getService, photosIn, services, startingPrice, videosIn, waLink } from "@/lib/data";
import { quoteHref, quoteServiceFor } from "@/lib/contact";
import { absoluteUrl, siteUrl } from "@/lib/site";

export const dynamicParams = false;

/** How many photographs a service page shows before pointing to the portfolio. */
const GALLERY_LIMIT = 12;

const serviceTitle = (t: string) =>
  `${t.replace(/^Weddings$/, "Wedding").replace(/^Events$/, "Event").replace(/^Portraits$/, "Portrait")} photography`;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  const path = `/services/${s.slug}`;
  const from = startingPrice(s.slug);
  const title = `${serviceTitle(s.title)} in ${brand.city}${from ? ` from ${formatRupees(from)}` : ""}`;
  const description = `${s.short} ${from ? `Packages from ${formatRupees(from)} + GST. ` : ""}${brand.name}, ${brand.city}, ${brand.region}.`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path },
  };
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();

  const shots = photosIn(s.slug);
  const cover = shots[0];
  const from = startingPrice(s.slug);
  const quoteService = quoteServiceFor[s.slug];
  const related = services.filter((r) => r.slug !== s.slug).slice(0, 3);
  const path = `/services/${s.slug}`;
  const title = serviceTitle(s.title);
  const single = s.packages?.length === 1;

  return (
    <>
      <PageHero
        label={s.title}
        crumbs={[{ href: "/services", label: "Services" }]}
        title={title}
        intro={s.intro}
        media={
          cover && (
            <div className="aspect-[4/3] lg:aspect-[5/4]">
              <PhotoFrame photo={cover} fill sizes="(min-width: 1024px) 50vw, 100vw" priority />
            </div>
          )
        }
      >
        <p className="mt-5 text-lg">
          {from ? (
            <>
              {single ? "From" : "Packages from"} <strong className="tabular font-display text-2xl font-bold text-accent">{formatRupees(from)}</strong>{" "}
              <span className="text-muted">+ GST</span>
            </>
          ) : (
            <span className="font-semibold">Priced for your shoot. Ask for a quote.</span>
          )}
        </p>
        <p className="mt-2 text-sm text-muted">
          <span className="font-semibold text-fg">Ideal for:</span> {s.idealFor}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={quoteHref({ service: quoteService })} size="lg">
            Get a Quote
          </ButtonLink>
          <WhatsAppButton href={waLink(`Hi Zoomin Fotos! I'd like to know more about ${title.toLowerCase()}.`)} source={`service:${s.slug}`} size="lg" />
        </div>
      </PageHero>

      {s.packages && (
        <Packages
          items={s.packages}
          service={quoteService}
          intro={s.packagesIntro}
          className="border-t border-border"
          footer={
            s.slug === "weddings" ? (
              <>
                <PackagesLink href="/packages#compare">Compare the packages side by side</PackagesLink>
                <PackagesLink href="#builder">Build your own package</PackagesLink>
              </>
            ) : undefined
          }
        />
      )}

      <section aria-labelledby="includes-title" className="section-y bg-sand-soft">
        <div className="container-page">
          <SectionHeader id="includes-title" label="What's included" title={`What you get with ${title.toLowerCase()}`} />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {s.includes.map((item) => (
              <li key={item.title} className="reveal rounded-lg border border-border bg-surface p-5">
                <h3 className="font-display text-lg">{item.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{item.text}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-lg border border-border bg-surface p-5">
            <h3 className="font-display text-base font-semibold">You receive</h3>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              {s.deliverables.map((d) => (
                <li key={d} className="flex items-center gap-2">
                  <Check aria-hidden className="size-4 text-success" />
                  {d}
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-border pt-4 text-sm text-muted">
              <span className="font-semibold text-fg">Not included unless quoted:</span> travel and stay outside {brand.city}, and anything not listed in your package or quote.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="gallery-title" className="section-y">
        <div className="container-page">
          <SectionHeader
            id="gallery-title"
            label="Recent work"
            title={`${s.title} we've photographed`}
            action={shots.length > GALLERY_LIMIT ? <TextLink href="/portfolio">See all photos</TextLink> : undefined}
          />
          <div className="mt-8 md:mt-10">
            <PortfolioGallery photos={shots.slice(0, GALLERY_LIMIT)} eager={0} compact />
          </div>
        </div>
      </section>

      <FilmGrid videos={videosIn(s.slug)} />
      {s.slug === "weddings" && <PackageBuilder className="border-t border-border" />}
      <HomeReviews className="pb-16 md:pb-24" />
      <Faq items={s.faqs} title={`${s.title}: common questions`} />

      <section aria-labelledby="related-title" className="section-y border-t border-border">
        <div className="container-page">
          <SectionHeader id="related-title" label="More services" title="Other shoots we do" />
          <ul className="mt-8 grid gap-3 md:grid-cols-3">
            {related.map((r) => {
              const rFrom = startingPrice(r.slug);
              return (
                <li key={r.slug}>
                  <Link
                    href={`/services/${r.slug}`}
                    className="lift group flex h-full items-center justify-between gap-4 rounded-lg border border-border bg-surface p-5 hover:border-border-strong"
                  >
                    <span>
                      <span className="block font-display text-lg">{r.title}</span>
                      <span className="mt-1 block text-sm text-muted">{rFrom ? `From ${formatRupees(rFrom)} + GST` : "Ask for a quote"}</span>
                    </span>
                    <ArrowRight aria-hidden className="size-5 shrink-0 text-accent transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <ClosingCta />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: title,
            serviceType: "Photography",
            description: s.intro,
            url: absoluteUrl(path),
            areaServed: [
              { "@type": "City", name: brand.city },
              { "@type": "State", name: brand.region },
            ],
            provider: { "@id": `${siteUrl}/#studio`, "@type": "ProfessionalService", name: brand.name },
            ...(s.packages && {
              offers: s.packages.map((p) => ({
                "@type": "Offer",
                name: `${p.name} package`,
                price: p.price,
                priceCurrency: "INR",
                // Published prices are before GST.
                priceSpecification: { "@type": "PriceSpecification", price: p.price, priceCurrency: "INR", valueAddedTaxIncluded: false },
                description: [p.team, ...p.items].filter(Boolean).join(", "),
              })),
            }),
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
              { "@type": "ListItem", position: 2, name: "Services", item: absoluteUrl("/services") },
              { "@type": "ListItem", position: 3, name: s.title, item: absoluteUrl(path) },
            ],
          },
        ]}
      />
    </>
  );
}
