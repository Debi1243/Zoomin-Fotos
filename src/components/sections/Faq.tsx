import { Plus } from "lucide-react";
import JsonLd from "@/components/shared/JsonLd";
import SectionHeader from "@/components/ui/SectionHeader";

type Item = { q: string; a: string };

export default function Faq({ items, title = "Frequently asked questions", name = "faq" }: { items: Item[]; title?: string; name?: string }) {
  return (
    <section aria-labelledby={`${name}-title`} className="section-y">
      <div className="container-page grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <SectionHeader id={`${name}-title`} label="FAQ" title={title} intro="Can't find your answer? Ask us on WhatsApp." />
        </div>
        <div className="lg:col-span-8">
          <div className="divide-y divide-border rounded-lg border border-border bg-surface">
            {items.map((f, i) => (
              <details key={f.q} name={name} open={i === 0} className="disclosure group">
                <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left font-display text-base font-semibold transition-colors hover:text-accent md:px-6 md:text-lg">
                  {f.q}
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-border transition-[transform,background-color,border-color,color] duration-200 group-open:rotate-45 group-open:border-primary group-open:bg-primary group-open:text-primary-fg">
                    <Plus aria-hidden className="size-4" />
                  </span>
                </summary>
                <p className="max-w-[64ch] px-5 pb-5 leading-relaxed text-muted md:px-6">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
    </section>
  );
}
