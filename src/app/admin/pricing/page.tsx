import type { Metadata } from "next";
import AdminTabs from "@/components/admin/AdminTabs";
import PricingEditor from "@/components/admin/PricingEditor";

// Not linked from the public site and kept out of search results.
export const metadata: Metadata = {
  title: "Package builder prices",
  robots: { index: false, follow: false, nocache: true },
};

export default function PricingPage() {
  return (
    <section aria-labelledby="pricing-title" className="container-page pb-24 pt-10 md:pb-32 md:pt-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="label text-muted">
          <span aria-hidden className="label-dot festive-gradient" />
          Studio only
        </p>
        <AdminTabs />
      </div>
      <h1 id="pricing-title" className="mt-4 font-display text-h2">
        Package builder prices<em>.</em>
      </h1>
      <div className="mt-10">
        <PricingEditor />
      </div>
    </section>
  );
}
