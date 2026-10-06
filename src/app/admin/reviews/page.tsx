import type { Metadata } from "next";
import AdminTabs from "@/components/admin/AdminTabs";
import ReviewsManager from "@/components/admin/ReviewsManager";

// Not linked from the public site and kept out of search results. Waiting reviews come from the
// studio's own Google Sheet and are only shown to someone whose GitHub key can edit the website.
export const metadata: Metadata = {
  title: "Reviews",
  robots: { index: false, follow: false, nocache: true },
};

export default function ReviewsPage() {
  return (
    <section aria-labelledby="reviews-title" className="container-page pb-24 pt-10 md:pb-32 md:pt-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="label text-muted">
          <span aria-hidden className="label-dot festive-gradient" />
          Studio only
        </p>
        <AdminTabs />
      </div>
      <h1 id="reviews-title" className="mt-4 font-display text-h2">
        Reviews<em>.</em>
      </h1>
      <div className="mt-10">
        <ReviewsManager />
      </div>
    </section>
  );
}
