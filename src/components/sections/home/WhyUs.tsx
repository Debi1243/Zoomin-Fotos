import type { CSSProperties } from "react";
import { BadgeIndianRupee, Clapperboard, MessageCircle, SlidersHorizontal, type LucideIcon } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { reasons } from "@/lib/data";

const icons: LucideIcon[] = [BadgeIndianRupee, Clapperboard, SlidersHorizontal, MessageCircle];

/** Four reasons to book, each one something the site itself shows to be true. */
export default function WhyUs() {
  return (
    <section aria-labelledby="why-title" className="section-y">
      <div className="container-page">
        <SectionHeader id="why-title" label="Why Zoomin Fotos" title="Professional photography, without the guesswork" />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-12 lg:grid-cols-4">
          {reasons.map((r, i) => {
            const Icon = icons[i % icons.length];
            return (
              <li key={r.title} className="stagger-in rounded-lg border border-border bg-surface p-5 md:p-6" style={{ "--i": i } as CSSProperties}>
                <span className="grid size-11 place-items-center rounded-md bg-sand-soft text-accent">
                  <Icon aria-hidden className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-lg">{r.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{r.text}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
