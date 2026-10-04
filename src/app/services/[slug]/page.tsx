import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import PortfolioGallery from "@/components/photos/PortfolioGallery";
import Packages from "@/components/sections/Packages";
import PhotoRibbon from "@/components/sections/PhotoRibbon";
import FilmGrid from "@/components/sections/FilmGrid";
import ProcessSteps from "@/components/sections/ProcessSteps";
import Faq from "@/components/sections/Faq";
import ClosingCta from "@/components/sections/ClosingCta";
import { ButtonLink } from "@/components/ui/Button";
import JsonLd from "@/components/shared/JsonLd";
import { brand, getService, photosIn, services, videosIn } from "@/lib/data";
import { absoluteUrl, siteUrl } from "@/lib/site";

export const dynamicParams = false;

const serviceTitle = (t: string) => `${t.replace(/^Weddings$/, "Wedding").replace(/^Events$/, "Event")} photography`;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  const path = `/services/${s.slug}`;
  const title = serviceTitle(s.title);
  return {
    title,
    description: s.short,
    alternates: { canonical: path },
    openGraph: { title, description: s.short, url: path },
  };
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();

  const shots = photosIn(s.slug);
  const index = services.indexOf(s);
  const related = [1, 2, 3].map((n) => services[(index + n) % services.length]);
  const path = `/services/${s.slug}`;
  const title = serviceTitle(s.title);

  return (
    <>
      <PageHero
        label={s.title}
        crumbs={[{ href: "/services", label: "Services" }]}
        title={<>{s.title}<em>.</em></>}
        intro={s.intro}
      >
        <p className="mt-6 max-w-[56ch] text-sm leading-relaxed text-muted">
          <span className="text-fg">Ideal for:</span> {s.idealFor}
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/contact" size="lg">Check your date</ButtonLink>
          {s.packages ? (
            <ButtonLink href="#packages" size="lg" variant="secondary" arrow={false}>{s.packages.length > 1 ? "See packages" : "See pricing"}</ButtonLink>
          ) : (
            <ButtonLink href="/portfolio" size="lg" variant="secondary" arrow={false}>View portfolio</ButtonLink>
          )}
        </div>
      </PageHero>

      <section aria-label={`${s.title} photographs`} className="container-page pb-20 md:pb-28">
        <PortfolioGallery photos={shots} />
      </section>

      <FilmGrid videos={videosIn(s.slug)} />

      <section aria-labelledby="includes-title" className="section-y border-t border-border">
        <div className="container-page grid gap-y-12 lg:grid-cols-12 lg:gap-x-10">
          <p className="label text-muted lg:col-span-3 lg:pt-3"><span aria-hidden className="label-dot festive-gradient" />What&apos;s included</p>
          <div className="lg:col-span-9">
            <h2 id="includes-title" className="max-w-[20ch] font-display text-h2">
              Everything planned, so you can just be there.
            </h2>
            <ul className="mt-12 grid gap-px bg-border sm:grid-cols-2 md:mt-16">
              {s.includes.map((item) => (
                <li key={item.title} className="reveal bg-bg py-7 sm:odd:pr-8 sm:even:pl-8">
                  <h3 className="font-display text-h3">{item.title}</h3>
                  <p className="mt-3 max-w-[40ch] leading-relaxed text-muted">{item.text}</p>
                </li>
              ))}
            </ul>
            <div className="mt-14 border-t border-border pt-8">
              <h3 className="label text-muted">You receive</h3>
              <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
                {s.deliverables.map((d) => (
                  <li key={d} className="flex items-center gap-2.5">
                    <Check aria-hidden className="size-4 text-accent" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {s.packages && <Packages items={s.packages} service={s.title.replace(/s$/, "")} intro={s.packagesIntro} />}
      <PhotoRibbon category={s.slug} rows={1} className="border-t border-border" />
      <ProcessSteps />
      <Faq items={s.faqs} title={`${s.title}, answered.`} />

      <section aria-labelledby="related-title" className="section-y border-t border-border">
        <div className="container-page grid gap-y-10 lg:grid-cols-12 lg:gap-x-10">
          <p className="label text-muted lg:col-span-3 lg:pt-3"><span aria-hidden className="label-dot festive-gradient" />Also photographed</p>
          <div className="lg:col-span-9">
            <h2 id="related-title" className="font-display text-h2">Other sessions.</h2>
            <ul className="mt-10 border-t border-border">
              {related.map((r) => (
                <li key={r.slug} className="reveal border-b border-border">
                  <Link href={`/services/${r.slug}`} className="group flex items-center justify-between gap-6 py-6">
                    <span>
                      <span className="block font-display text-[1.75rem] leading-none transition-colors group-hover:text-accent md:text-[2.25rem]">
                        {r.title}
                      </span>
                      <span className="mt-2 block max-w-[52ch] text-sm text-muted">{r.short}</span>
                    </span>
                    <ArrowUpRight aria-hidden className="size-5 shrink-0 text-muted transition-colors group-hover:text-accent" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
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
            areaServed: { "@type": "State", name: brand.region },
            provider: { "@id": `${siteUrl}/#studio`, "@type": "ProfessionalService", name: brand.name },
            ...(s.packages && {
              offers: s.packages.map((p) => ({
                "@type": "Offer",
                name: `${p.name} package`,
                price: p.price,
                priceCurrency: "INR",
                description: [p.team, ...p.items].join(", "),
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
