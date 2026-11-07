import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon as ArrowRight, CheckIcon as Check } from "@phosphor-icons/react/dist/ssr";
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
import { ButtonLink, WhatsAppLink } from "@/components/ui/Button";
import TaglineReveal from "@/components/sections/TaglineReveal";
import BookingSteps from "@/components/sections/BookingSteps";
import JsonLd from "@/components/shared/JsonLd";
import { brand, formatRupees, generalFaqs, getService, photosIn, services, startingPrice, videosIn, waLink } from "@/lib/data";
import { quoteHref, quoteServiceFor } from "@/lib/contact";
import { absoluteUrl, siteUrl } from "@/lib/site";

export const dynamicParams = false;

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
  const ctaLabel = from ? "Check your date and price" : "Get a quote";
  const faqs = [...s.faqs, ...generalFaqs().filter((g) => !s.faqs.some((f) => f.q === g.q))];

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
        <p className="mt-6 body-7">
          {from ? (
            <>
              {single ? "From" : "Packages from"} <strong className="tabular heading-5 text-accent">{formatRupees(from)}</strong>{" "}
              <span className="text-muted">plus GST</span>
            </>
          ) : (
            <span className="body-1">Priced for your shoot. Ask for a quote.</span>
          )}
        </p>
        <p className="mt-2 body-6 text-muted">
          <span className="body-4 text-fg">Ideal for:</span> {s.idealFor}
        </p>
        <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
          <ButtonLink href={quoteHref({ service: quoteService })} size="lg" className="w-full sm:w-auto">
            {ctaLabel}
          </ButtonLink>
          <WhatsAppLink href={waLink(`Hi Zoomin Fotos! I'd like to know more about ${title.toLowerCase()}.`)} source={`service:${s.slug}`} />
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
              <li key={item.title} className="reveal rounded-xl border border-border bg-surface p-6">
                <h3 className="heading-6">{item.title}</h3>
                <p className="mt-2 body-6 text-muted">{item.text}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-xl border border-border bg-surface p-6">
            <h3 className="body-1">You receive</h3>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 body-3">
              {s.deliverables.map((d) => (
                <li key={d} className="flex items-center gap-2">
                  <Check aria-hidden className="size-4 text-success" />
                  {d}
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-border pt-4 body-6 text-muted">
              <span className="body-4 text-fg">Not included unless quoted:</span> travel and stay outside {brand.city}, and anything not listed in your package or quote.
            </p>
          </div>
        </div>
      </section>

      <TaglineReveal text={s.short} className="section-y" />

      <section aria-labelledby="gallery-title" className="section-y border-t border-border">
        <div className="container-page">
          <SectionHeader
            id="gallery-title"
            label="Recent work"
            title={`${s.title} we've photographed`}
          />
          <div className="mt-8 md:mt-10">
            <PortfolioGallery photos={shots} eager={0} compact />
          </div>
        </div>
      </section>

      <FilmGrid videos={videosIn(s.slug)} />
      {s.slug === "weddings" && <PackageBuilder className="border-t border-border" />}
      <HomeReviews className="pb-16 md:pb-24" />
      <BookingSteps />
      <Faq items={faqs} title={`${s.title}: common questions`} />

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
                    className="lift group flex h-full items-center justify-between gap-4 rounded-xl border border-border bg-surface p-6 hover:border-border-strong"
                  >
                    <span>
                      <span className="block heading-6">{r.title}</span>
                      <span className="mt-1 block caption-2 text-muted">{rFrom ? `From ${formatRupees(rFrom)} + GST` : "Ask for a quote"}</span>
                    </span>
                    <ArrowRight aria-hidden className="size-5 shrink-0 text-accent transition-transform duration-500 group-hover:translate-x-0.5" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <ClosingCta
        title={`Tell us your date, and we will tell you if it is free.`}
        text={from ? `${title} from ${formatRupees(from)} plus GST. Every price is negotiable.` : `${title} is priced for your shoot. Send your date and we will send a clear quote.`}
        href={quoteHref({ service: quoteService })}
        label={ctaLabel}
      />
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
