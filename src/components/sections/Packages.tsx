import type { CSSProperties } from "react";
import { Check, Users } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { formatRupees, type Package } from "@/lib/data";

const tones = [
  ["var(--peacock)", "var(--peacock-glow)"],
  ["var(--rani)", "var(--rani-glow)"],
  ["var(--marigold)", "var(--marigold-glow)"],
  ["#f2c14e", "var(--gold-glow)"],
];

const defaultIntro =
  "Prices are for one day of coverage, plus GST, and every price is negotiable. Tell us about your day and we will shape a package around it.";

export default function Packages({
  items,
  service,
  intro = defaultIntro,
}: {
  items: Package[];
  service: string;
  intro?: string;
}) {
  const single = items.length === 1;
  return (
    <section id="packages" aria-labelledby="packages-title" className="section-y scroll-mt-20 border-t border-border">
      <div className="container-page">
        <div className="grid gap-y-6 lg:grid-cols-12 lg:gap-x-10">
          <p className="label text-muted lg:col-span-3 lg:pt-3">
            <span aria-hidden className="label-dot festive-gradient" />
            {single ? "Pricing" : "Packages"}
          </p>
          <div className="lg:col-span-9">
            <h2 id="packages-title" className="max-w-[20ch] font-display text-h2">
              {single ? `${service} pricing` : `${service} packages`}
              <em>.</em>
            </h2>
            <p className="mt-5 max-w-[56ch] leading-relaxed text-muted">{intro}</p>
          </div>
        </div>

        <ul
          className={cn(
            "mt-12 grid gap-5 md:mt-16",
            single ? "lg:grid-cols-12 lg:gap-x-10" : "sm:grid-cols-2 xl:grid-cols-4",
          )}
        >
          {items.map((p, i) => (
            <li
              key={p.name}
              style={{ "--i": i, "--tone": tones[i % 4][0], "--tone-glow": tones[i % 4][1] } as CSSProperties}
              className={cn("stagger-in", single && "lg:col-span-6 lg:col-start-4")}
            >
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-lg border p-6 transition-[translate,box-shadow,border-color] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgb(0_0_0/0.45)] md:p-7",
                  p.featured
                    ? "border-[#f2c14e]/60 bg-inverse text-inverse-fg"
                    : "border-border bg-surface hover:border-border-strong",
                )}
              >
                <span aria-hidden className="absolute inset-x-0 -top-px h-1 rounded-t-lg bg-[var(--tone-glow)]" />
                {p.featured && (
                  <span className="label festive-gradient absolute -top-3 right-6 rounded-full px-3 py-1 text-[0.6875rem] text-[#16150f]">
                    Most complete
                  </span>
                )}
                <h3 className="font-display text-h3">{p.name}</h3>
                <p className={cn("label mt-2", p.featured ? "text-inverse-muted" : "text-muted")}>{p.tagline}</p>

                {p.startingFrom && (
                  <p className={cn("label mt-6", p.featured ? "text-inverse-muted" : "text-muted")}>Starting from</p>
                )}
                <p className={cn("flex flex-wrap items-baseline gap-x-2", p.startingFrom ? "mt-2" : "mt-6")}>
                  <span className="tabular font-display text-[2.5rem] leading-none tracking-[-0.02em] text-[var(--tone)]">
                    {formatRupees(p.price)}
                  </span>
                  <span className={cn("text-sm", p.featured ? "text-inverse-muted" : "text-muted")}>
                    {p.unit ?? "1 day + GST"}
                  </span>
                </p>
                <p className={cn("mt-1 text-sm", p.featured ? "text-inverse-muted" : "text-muted")}>
                  {p.note ?? "Price is negotiable"}
                </p>

                <div className={cn("mt-6 border-t pt-5", p.featured ? "border-inverse-border" : "border-border")}>
                  {p.team && (
                    <p className="mb-4 flex gap-3 text-sm leading-relaxed">
                      <Users aria-hidden className={cn("mt-0.5 size-4 shrink-0", "text-[var(--tone)]")} />
                      <span>
                        <span className="sr-only">Team: </span>
                        {p.team}
                      </span>
                    </p>
                  )}
                  <ul className="grid gap-3 text-sm leading-relaxed">
                    {p.items.map((item) => (
                      <li key={item} className="flex gap-3">
                        <Check aria-hidden className={cn("mt-0.5 size-4 shrink-0", "text-[var(--tone)]")} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-8">
                  <ButtonLink
                    href="/contact"
                    variant={p.featured ? "inverse" : "secondary"}
                    className="w-full"
                    aria-label={`Enquire about the ${p.name} package`}
                  >
                    Enquire
                  </ButtonLink>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
