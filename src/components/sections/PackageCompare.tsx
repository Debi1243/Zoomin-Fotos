import { Check, Minus } from "lucide-react";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import { formatRupees, type Package, weddingComparison } from "@/lib/data";
import { quoteHref } from "@/lib/contact";

function Cell({ value }: { value: string }) {
  if (value === "Yes") return <Check aria-label="Included" className="mx-auto size-5 text-success" />;
  if (value === "—") return <Minus aria-label="Not included" className="mx-auto size-4 text-border-strong" />;
  return <span>{value}</span>;
}

/**
 * The four wedding packages in one table. The first column stays put while the table scrolls
 * sideways on phones, so every row keeps its label.
 */
export default function PackageCompare({ packages }: { packages: Package[] }) {
  return (
    <section id="compare" aria-labelledby="compare-title" className="section-y scroll-mt-20 bg-sand-soft">
      <div className="container-page">
        <SectionHeader
          id="compare-title"
          label="Compare"
          title="Wedding packages side by side"
          intro="Every package includes all raw photos and videos. A dash means the package doesn't list it, but you can add it with the package builder."
        />
        <div className="mt-8 overflow-x-auto rounded-lg border border-border bg-surface md:mt-10" role="region" aria-label="Package comparison" tabIndex={0}>
          <table className="w-full min-w-[40rem] border-collapse text-sm">
            <caption className="sr-only">What each wedding package includes. Prices are for one day, plus GST.</caption>
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="sticky left-0 z-10 w-40 bg-surface p-4 text-left font-semibold text-muted">Package</th>
                {packages.map((p) => (
                  <th key={p.name} scope="col" className="p-4 text-center align-bottom">
                    <span className="block font-display text-lg">{p.name}</span>
                    <span className="tabular mt-1 block font-display text-xl font-bold text-accent">{formatRupees(p.price)}</span>
                    <span className="block text-xs font-normal text-muted">+ GST</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weddingComparison.map((row) => (
                <tr key={row.label} className="border-b border-border last:border-0 bg-surface even:bg-sand-soft">
                  <th scope="row" className="sticky left-0 z-10 bg-inherit p-4 text-left font-medium">
                    {row.label}
                  </th>
                  {row.values.map((v, i) => (
                    <td key={i} className="p-4 text-center">
                      <Cell value={v} />
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <th scope="row" className="sticky left-0 z-10 bg-surface p-4" />
                {packages.map((p) => (
                  <td key={p.name} className="p-4 text-center">
                    <Link
                      href={quoteHref({ service: "Wedding", pkg: p.name, price: p.price })}
                      data-track="package_select"
                      data-track-source={`compare:${p.name}`}
                      className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-fg hover:bg-primary-hover"
                    >
                      Book {p.name}
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
