import { ArrowSquareOutIcon, CurrencyInrIcon, FilmSlateIcon, GoogleLogoIcon, MapPinIcon, ShieldCheckIcon } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { brand, formatRupees, startingPrice } from "@/lib/data";
import { BOOKING_ADVANCE, onlinePayments } from "@/lib/checkout";
import { testimonials } from "@/lib/testimonials";

/**
 * A quiet band of facts under the hero. Each one is true of the studio today: where it is, what every
 * wedding package includes, the published prices and the refundable advance. Reviews show a count and
 * an average only once real reviews are published from /admin/reviews; until then it links to Google.
 * Nothing here is a made-up statistic.
 */
export default function TrustStrip() {
  const from = startingPrice("weddings");
  const count = testimonials.length;
  const average = count ? testimonials.reduce((s, t) => s + t.rating, 0) / count : 0;

  const facts: { icon: Icon; title: string; text: string }[] = [
    { icon: MapPinIcon, title: `Based in ${brand.city}`, text: `Weddings and shoots across ${brand.region}, and further on request` },
    { icon: FilmSlateIcon, title: "Photos and film together", text: "Every wedding package has a photographer and a cinematographer" },
    {
      icon: CurrencyInrIcon,
      title: "Transparent pricing",
      text: from ? `Wedding packages from ${formatRupees(from)} + GST, all on the page` : "Every package and price on the page",
    },
    onlinePayments
      ? { icon: ShieldCheckIcon, title: `${formatRupees(BOOKING_ADVANCE)} advance to book`, text: "Refunded in full if your date isn't available" }
      : { icon: ShieldCheckIcon, title: "Terms in writing", text: "Delivery dates and terms are in your quote before you pay" },
  ];

  return (
    <section aria-label={`Why couples trust ${brand.name}`} className="border-b border-border">
      <div className="container-page py-8 md:py-10">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-6 lg:grid-cols-5 lg:gap-x-8">
          {facts.map(({ icon: Ico, title, text }) => (
            <li key={title} className="flex flex-col gap-2 sm:flex-row sm:gap-3">
              <Ico aria-hidden className="size-5 shrink-0 text-accent sm:mt-0.5" />
              <p>
                <span className="block body-4 text-fg">{title}</span>
                <span className="mt-0.5 block caption-5 text-muted sm:caption-2">{text}</span>
              </p>
            </li>
          ))}
          <li className="col-span-2 flex flex-col gap-2 sm:flex-row sm:gap-3 lg:col-span-1">
            <GoogleLogoIcon aria-hidden className="size-5 shrink-0 text-accent sm:mt-0.5" />
            <p>
              <span className="block body-4 text-fg">
                {count ? `${average.toFixed(1)} out of 5 from ${count} review${count > 1 ? "s" : ""}` : "Genuine client reviews"}
              </span>
              <a
                href={brand.googleReviews}
                target="_blank"
                rel="noreferrer"
                className="mt-0.5 inline-flex min-h-11 items-center gap-1.5 caption-1 text-accent sm:min-h-0"
              >
                <span className="link-underline">Read them on Google</span>
                <ArrowSquareOutIcon aria-hidden className="size-3.5" />
              </a>
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
}
