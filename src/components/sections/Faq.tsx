import type { CSSProperties } from "react";
import { Plus } from "lucide-react";
import JsonLd from "@/components/shared/JsonLd";

type Item = { q: string; a: string };

export default function Faq({ items, title = "Questions, answered.", name = "faq" }: { items: Item[]; title?: string; name?: string }) {
  return (
    <section aria-labelledby={`${name}-title`} className="section-y border-t border-border">
      <div className="container-page grid gap-y-10 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-3">
          <p className="label text-muted lg:pt-3">FAQ</p>
        </div>
        <div className="lg:col-span-9">
          <h2 id={`${name}-title`} className="reveal font-display text-h2">
            {title}
          </h2>
          <div className="mt-10 border-t border-border md:mt-14">
            {items.map((f, i) => (
              <details key={f.q} name={name} open={i === 0} className="disclosure reveal group border-b border-border" style={{ "--i": Math.min(i, 4) } as CSSProperties}>
                <summary className="flex cursor-pointer items-center justify-between gap-6 py-6 text-left font-display text-lg tracking-[-0.01em] transition-colors hover:text-accent md:text-xl">
                  {f.q}
                  <span className="grid size-9 shrink-0 place-items-center rounded-md border border-border transition-[transform,background-color,border-color] duration-300 group-open:rotate-45 group-open:border-fg group-open:bg-fg group-open:text-bg">
                    <Plus aria-hidden className="size-4" />
                  </span>
                </summary>
                <p className="max-w-[62ch] pb-7 pr-12 leading-relaxed text-muted">{f.a}</p>
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
