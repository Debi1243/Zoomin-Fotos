import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import PageHero from "@/components/sections/PageHero";
import Faq from "@/components/sections/Faq";
import ClosingCta from "@/components/sections/ClosingCta";
import SectionHeader from "@/components/ui/SectionHeader";
import JsonLd from "@/components/shared/JsonLd";
import Shop from "@/components/shop/Shop";
import { WhatsAppButton } from "@/components/ui/Button";
import { brand, waLink } from "@/lib/brand";
import { products, shopCategories } from "@/lib/shop";
import { absoluteUrl, shopEnabled } from "@/lib/site";

const description = `Photo albums, frames, prints, canvas, calendars and photo gifts in ${brand.city}, made from your own photographs. Choose a product and order on WhatsApp.`;

export const metadata: Metadata = {
  title: "Shop: Albums, Frames, Prints & Photo Gifts",
  description,
  alternates: { canonical: "/shop" },
  openGraph: { title: "Shop: Albums, Frames, Prints & Photo Gifts", description, url: "/shop" },
  // Kept out of search engines while the shop is switched off (see shopEnabled in src/lib/site.ts).
  ...(!shopEnabled && { robots: { index: false, follow: false } }),
};

const steps = [
  { title: "Choose your products", text: "Pick a size or finish and add it to your cart, or order a single product straight away." },
  { title: "Send the order on WhatsApp", text: "Your cart goes to us as one message. Share the photos you want printed in the same chat." },
  { title: "Approve the design", text: "We colour-correct your photos and send a preview of the album or print, with the final price." },
  { title: "Pick up or get it delivered", text: "Collect it from the studio or have it delivered in Bhubaneswar. We quote other cities on request." },
];

const faqs = [
  {
    q: "Can I order prints of photos that Zoomin Fotos didn't take?",
    a: "Yes. Send us any photo in good resolution and we will check it, correct the colour and tell you the largest size it will print well at.",
  },
  {
    q: "How long does an order take?",
    a: "Prints, frames and gifts usually take a few working days; albums take longer because you approve the design first. We give you the date when we confirm your order.",
  },
  {
    q: "How do I pay?",
    a: "Nothing is charged on this website. Once we confirm your order and the final price on WhatsApp, we send you the payment details.",
  },
  {
    q: "Do you deliver outside Bhubaneswar?",
    a: "Ask us on WhatsApp. Delivery depends on the size of the order and the city, so we add it to your quote before you pay.",
  },
];

export default function ShopPage() {
  if (!shopEnabled) notFound();
  return (
    <>
      <PageHero
        label="Shop"
        crumbs={[]}
        title={
          <>
            Albums, frames and prints, <em>made from your photos</em>
          </>
        }
        intro="Turn your wedding, family and portrait photographs into something you can hold. Choose a product, add it to your cart and send your order to us on WhatsApp. We confirm your photos and the final price before you pay."
      />

      <section id="products" aria-label="Products" className="scroll-mt-20 border-t border-border pb-16 pt-8 md:pb-24 md:pt-12">
        <div className="container-page">
          <Shop products={products} categories={shopCategories} />
        </div>
      </section>

      <section aria-labelledby="order-steps-title" className="section-y surface-soft">
        <div className="container-page">
          <SectionHeader id="order-steps-title" label="How ordering works" title="From your gallery to your wall in four steps" />
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-12 lg:grid-cols-4 lg:gap-6">
            {steps.map((s, i) => (
              <li key={s.title} className="stagger-in relative rounded-xl border border-border bg-surface p-6" style={{ "--i": i } as CSSProperties}>
                <span className="grid size-10 place-items-center rounded-full bg-primary heading-6 text-primary-fg" aria-hidden>
                  {i + 1}
                </span>
                <h3 className="mt-4 heading-6">
                  <span className="sr-only">Step {i + 1}: </span>
                  {s.title}
                </h3>
                <p className="mt-2 body-6 text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex justify-center">
            <WhatsAppButton href={waLink("Hi Zoomin Fotos! I'd like to order an album, frame or prints. Can you help me choose?")} source="shop-steps" size="lg">
              Ask us what to order
            </WhatsAppButton>
          </div>
        </div>
      </section>

      <Faq items={faqs} title="Questions about ordering" name="shop-faq" />
      <ClosingCta
        title="Haven't had your photoshoot yet?"
        text="Every wedding package already includes a printed album. Book your shoot and we'll make the rest of the prints for you too."
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: "Shop", item: absoluteUrl("/shop") },
          ],
        }}
      />
    </>
  );
}
