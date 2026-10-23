import type { Metadata } from "next";
import AdminTabs from "@/components/admin/AdminTabs";
import BillingDesk from "@/components/admin/BillingDesk";

// Studio only: not linked from the public site and kept out of search results.
export const metadata: Metadata = {
  title: "Quotes and bills",
  robots: { index: false, follow: false, nocache: true },
};

export default function BillingPage() {
  return (
    <section aria-labelledby="billing-title" className="container-page pb-24 pt-10 md:pb-32 md:pt-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="label text-muted">
          <span aria-hidden className="label-dot festive-gradient" />
          Studio only
        </p>
        <AdminTabs />
      </div>
      <h1 id="billing-title" className="mt-4 font-display text-h2">
        Quotes and bills
      </h1>
      <p className="mt-2 max-w-[60ch] text-muted">
        Make a professional quotation or bill from your packages, then print it, save it as a PDF or send it on WhatsApp.
      </p>
      <div className="mt-8">
        <BillingDesk />
      </div>
    </section>
  );
}
