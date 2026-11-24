import { CheckIcon, MinusIcon, PlusIcon } from "@phosphor-icons/react/dist/ssr";
import PageHero from "@/components/sections/PageHero";
import PhotoFrame from "@/components/photos/PhotoFrame";
import PortfolioGallery from "@/components/photos/PortfolioGallery";
import FilmGrid from "@/components/sections/FilmGrid";
import HomeReviews from "@/components/sections/home/HomeReviews";
import BookingSteps from "@/components/sections/BookingSteps";
import Faq from "@/components/sections/Faq";
import ClosingCta from "@/components/sections/ClosingCta";
import SectionHeader from "@/components/ui/SectionHeader";
import { ButtonLink, TextLink, WhatsAppLink } from "@/components/ui/Button";
import JsonLd from "@/components/shared/JsonLd";
import { brand, formatRupees, generalFaqs, getService, pickPhotos, startingPrice, videosIn, waLink } from "@/lib/data";
import { compareRows, type FocusService } from "@/lib/focus-services";
import { quoteHref } from "@/lib/contact";
import { absoluteUrl, siteUrl } from "@/lib/site";

function Cell({ value }: { value: string }) {
  if (value === "Yes") return <CheckIcon aria-label="Included" className="mx-auto size-5 text-success" />;
  if (value === "—") return <MinusIcon aria-label="Not included" className="mx-auto size-4 text-border-strong" />;
  return <span>{value}</span>;
}

/**
 * A page for something every wedding package includes (candid photography, cinematography):
 * what each package gives you of it, how we work, the extras from the builder, photographs and FAQs.
 */
export default function FocusServicePage({ f }: { f: FocusService }) {
  const packages = getService("weddings")?.packages ?? [];
  const from = startingPrice("weddings");
  const [hero] = pickPhotos([f.heroPhotoId]);
  const shots = pickPhotos(f.photoIds).filter((p) => p.src);
  const path = `/services/${f.slug}`;
  const rows = compareRows(f.rows);
  const faqs = [...f.faqs, ...generalFaqs()];
  const href = quoteHref({ service: "Wedding" });

  return (
    <>
      <PageHero
        label={f.label}
        crumbs={[{ href: "/services", label: "Services" }]}
        title={f.title}
        intro={f.intro}
        media={
          hero && (
            <div className="aspect-[4/3] lg:aspect-[5/4]">
              <PhotoFrame photo={hero} fill sizes="(min-width: 1024px) 50vw, 100vw" priority />
            </div>
          )
        }
      >
        {from && (
          <p className="mt-6 body-7">
            Included in every wedding package, from <strong className="tabular heading-5 text-accent">{formatRupees(from)}</strong>{" "}
            <span className="text-muted">plus GST</span>
          </p>
        )}
        <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
          <ButtonLink href={href} size="lg" className="w-full sm:w-auto">
            Check Availability
          </ButtonLink>
          <WhatsAppLink href={waLink(f.whatsapp)} source={`service:${f.slug}`} />
        </div>
      </PageHero>

      <section aria-labelledby="by-package-title" className="section-y border-t border-border surface-soft">
        <div className="container-page">
          <SectionHeader
            id="by-package-title"
            label="By package"
            title="What each package includes"
            intro="Copied from the wedding packages. A dash means the package doesn't list it; you can add it in the package builder."
            action={<TextLink href="/packages#compare">Compare everything</TextLink>}
          />
          <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-surface md:mt-10" role="region" aria-label="By package" tabIndex={0}>
            <table className="w-full min-w-[36rem] border-collapse text-sm">
              <caption className="sr-only">{f.label} in each wedding package. Prices are for one day, plus GST.</caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="sticky left-0 z-10 w-40 bg-elevated p-4 text-left font-semibold text-muted">Package</th>
                  {packages.map((p) => (
                    <th key={p.name} scope="col" className="p-4 text-center align-bottom">
                      <span className="block font-display text-lg">{p.name}</span>
                      <span className="tabular mt-1 block text-accent">{formatRupees(p.price)}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-b border-border last:border-0">
                    <th scope="row" className="sticky left-0 z-10 bg-elevated p-4 text-left font-medium">{row.label}</th>
                    {row.values.map((v, i) => (
                      <td key={i} className="p-4 text-center">
                        <Cell value={v} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section aria-labelledby="approach-title" className="section-y">
        <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <SectionHeader id="approach-title" label="How we work" title="Your day, as it really felt" />
            <ul className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {f.approach.map((a) => (
                <li key={a.title} className="reveal border-t border-border pt-5">
                  <h3 className="heading-6">{a.title}</h3>
                  <p className="mt-2 body-6 text-muted">{a.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal lg:col-span-5">
            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="body-1">Want more?</h3>
              <ul className="mt-3 space-y-2 body-6 text-muted">
                {f.extras.map((e) => (
                  <li key={e} className="flex gap-2">
                    <PlusIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
                    {e}
                  </li>
                ))}
              </ul>
              <TextLink href="/packages#builder" className="mt-4">
                Build your own package
              </TextLink>
            </div>
          </div>
        </div>
      </section>

      {shots.length > 0 && (
        <section aria-labelledby="work-title" className="section-y border-t border-border">
          <div className="container-page">
            <SectionHeader
              id="work-title"
              label="Our work"
              title="From weddings we've covered"
              action={<TextLink href="/portfolio#wedding-story">See a wedding day, chapter by chapter</TextLink>}
            />
            <div className="mt-8 md:mt-10">
              <PortfolioGallery photos={shots} eager={0} compact />
            </div>
          </div>
        </section>
      )}

      <FilmGrid videos={videosIn("weddings")} />
      <HomeReviews className="pb-16 md:pb-24" />
      <BookingSteps />
      <Faq items={faqs} title={`${f.label}: common questions`} />
      <ClosingCta href={href} />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: f.label,
            serviceType: f.label,
            description: f.description,
            url: absoluteUrl(path),
            areaServed: [
              { "@type": "City", name: brand.city },
              { "@type": "State", name: brand.region },
            ],
            provider: { "@id": `${siteUrl}/#studio`, "@type": "ProfessionalService", name: brand.name },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
              { "@type": "ListItem", position: 2, name: "Services", item: absoluteUrl("/services") },
              { "@type": "ListItem", position: 3, name: f.label, item: absoluteUrl(path) },
            ],
          },
        ]}
      />
    </>
  );
}
